import { withCors, preflightResponse } from "./cors.js";
import { verifyAdminToken, verifyClassCode } from "./auth.js";
import { selectRelevantLectures } from "./relevance.js";
import { askGemini } from "./gemini.js";

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function handleAsk(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }

  const { classCode, question } = body || {};

  if (!verifyClassCode(classCode, env)) {
    return json({ error: "Invalid class access code." }, 401);
  }

  if (!question || typeof question !== "string" || !question.trim()) {
    return json({ error: "A question is required." }, 400);
  }

  const { results } = await env.DB.prepare(
    "SELECT id, lecture_date, lecture_title, extracted_text FROM lectures ORDER BY lecture_date ASC"
  ).all();

  if (!results || results.length === 0) {
    return json({
      error: "No lecture content has been added yet. Check back after the professor uploads slides.",
    }, 400);
  }

  const relevant = selectRelevantLectures(question, results);

  try {
    const answer = await askGemini({ question, lectures: relevant, env });
    return json({ answer });
  } catch (error) {
    console.error("Gemini call failed:", error);
    return json({ error: "The study assistant is temporarily unavailable. Please try again in a minute." }, 502);
  }
}

async function handleIngest(request, env) {
  const auth = await verifyAdminToken(request, env);
  if (!auth.ok) {
    return json({ error: auth.message }, auth.status);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }

  const { lecture_date, lecture_title, source_filename, extracted_text } = body || {};

  if (!lecture_date || !lecture_title || !extracted_text) {
    return json({ error: "lecture_date, lecture_title, and extracted_text are required." }, 400);
  }

  const result = await env.DB.prepare(
    "INSERT INTO lectures (lecture_date, lecture_title, source_filename, extracted_text) VALUES (?, ?, ?, ?)"
  )
    .bind(lecture_date, lecture_title, source_filename || null, extracted_text)
    .run();

  return json({ id: result.meta.last_row_id, ok: true });
}

async function handleListLectures(request, env) {
  const url = new URL(request.url);
  const classCode = url.searchParams.get("classCode");

  const hasValidClassCode = verifyClassCode(classCode, env);
  const hasAdminToken = request.headers.get("Authorization");
  const auth = hasAdminToken ? await verifyAdminToken(request, env) : null;

  if (!hasValidClassCode && !(auth && auth.ok)) {
    return json({ error: "Invalid class access code." }, 401);
  }

  const { results } = await env.DB.prepare(
    "SELECT id, lecture_date, lecture_title, created_at FROM lectures ORDER BY lecture_date DESC"
  ).all();

  return json({ lectures: results || [] });
}

async function handleDeleteLecture(request, env, id) {
  const auth = await verifyAdminToken(request, env);
  if (!auth.ok) {
    return json({ error: auth.message }, auth.status);
  }

  await env.DB.prepare("DELETE FROM lectures WHERE id = ?").bind(id).run();
  return json({ ok: true });
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return preflightResponse(env);
    }

    const url = new URL(request.url);

    try {
      let response;

      if (request.method === "POST" && url.pathname === "/api/ask") {
        response = await handleAsk(request, env);
      } else if (request.method === "POST" && url.pathname === "/api/ingest") {
        response = await handleIngest(request, env);
      } else if (request.method === "GET" && url.pathname === "/api/lectures") {
        response = await handleListLectures(request, env);
      } else {
        const deleteMatch = url.pathname.match(/^\/api\/lectures\/(\d+)$/);
        if (request.method === "DELETE" && deleteMatch) {
          response = await handleDeleteLecture(request, env, deleteMatch[1]);
        } else {
          response = json({ error: "Not found." }, 404);
        }
      }

      return withCors(response, env);
    } catch (error) {
      console.error("Unhandled error:", error);
      return withCors(json({ error: "Internal server error." }, 500), env);
    }
  },
};

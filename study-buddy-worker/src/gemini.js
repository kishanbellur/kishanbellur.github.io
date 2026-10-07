function formatLecture(lecture) {
  return `--- Lecture: ${lecture.lecture_date} — ${lecture.lecture_title} ---\n${lecture.extracted_text}`;
}

function buildSystemInstruction(lectures) {
  const corpus = lectures.map(formatLecture).join("\n\n");

  return `You are a "surrogate student" study assistant for this course — a star student who
has attended every lecture and takes great notes. Your only source of truth is the lecture
excerpts provided below. Do not use outside knowledge to answer, even if you know the general
subject matter.

Rules:
1. Answer using ONLY the lecture material provided below.
2. If the material doesn't cover what's being asked, say so explicitly — e.g. "That topic
   hasn't been covered in the lectures uploaded so far." Do not guess or fill in from
   general knowledge.
3. When you reference specific material, cite it by lecture date and title, e.g.
   "(Lecture: 2026-09-24 — Training Neural Networks)".
4. If asked "when was X covered," scan the lecture headers/content and name the specific
   date(s) and title(s).
5. Be concise and pedagogical — explain concepts the way a strong classmate would, not a
   textbook.
6. The excerpts below are the lectures judged most relevant to this question, not
   necessarily every lecture ever given — if a topic seems like it should be here but
   isn't, say it may not have come up yet rather than asserting it definitely wasn't
   covered at all.

--- LECTURE CONTENT START ---
${corpus}
--- LECTURE CONTENT END ---`;
}

export class GeminiError extends Error {
  constructor(status, detail, model) {
    super(`Gemini API error ${status}: ${detail}`);
    this.status = status;
    this.model = model;
  }
}

export async function askGemini({ question, lectures, env }) {
  const primary = env.GEMINI_MODEL || "gemini-3.8-flash";
  const fallback = env.GEMINI_FALLBACK_MODEL;
  // Try the main model first; if Google says it's overloaded or rate-limited, try the fallback.
  const models = fallback && fallback !== primary ? [primary, fallback] : [primary, primary];

  const body = {
    systemInstruction: {
      parts: [{ text: buildSystemInstruction(lectures) }],
    },
    contents: [
      {
        role: "user",
        parts: [{ text: question }],
      },
    ],
  };

  let response;
  let usedIndex = 0;
  for (let i = 0; i < models.length; i++) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${models[i]}:generateContent?key=${env.GEMINI_API_KEY}`;
    const last = i === models.length - 1;
    usedIndex = i;
    try {
      response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        // Give up on the first model quickly so the fallback has time to answer.
        signal: AbortSignal.timeout(last ? 25000 : 10000),
      });
    } catch (err) {
      if (last) throw new GeminiError(0, `${models[i]} request failed or timed out: ${err.message}`, models[i]);
      console.warn(`${models[i]} timed out or failed (${err.message}), trying ${models[i + 1]}`);
      continue;
    }
    if (response.ok || ![429, 500, 503].includes(response.status) || last) break;
    console.warn(`${models[i]} returned ${response.status}, trying ${models[i + 1]}`);
    await new Promise((r) => setTimeout(r, 1000));
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new GeminiError(response.status, errorText, models[usedIndex]);
  }

  const data = await response.json();
  const answer = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || "";

  if (!answer) {
    throw new Error("Gemini API returned an empty answer.");
  }

  return {
    answer,
    model: models[usedIndex],
    fallbackUsed: usedIndex > 0,
    promptTokens: data?.usageMetadata?.promptTokenCount ?? null,
    outputTokens: data?.usageMetadata?.candidatesTokenCount ?? null,
  };
}

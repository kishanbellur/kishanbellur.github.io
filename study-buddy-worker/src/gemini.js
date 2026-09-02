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

export async function askGemini({ question, lectures, env }) {
  const model = env.GEMINI_MODEL || "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`;

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

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const answer = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || "";

  if (!answer) {
    throw new Error("Gemini API returned an empty answer.");
  }

  return answer;
}

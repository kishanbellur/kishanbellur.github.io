// Usage tracking for /api/ask. Metadata only: no question text, no student identifiers.
// Logging must never break an answer, so every write is wrapped in try/catch.

export async function logUsage(env, row) {
  try {
    await env.DB.prepare(
      `INSERT INTO usage_log
        (ok, model, fallback_used, error_status, prompt_tokens, output_tokens, latency_ms, lecture_ids)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        row.ok ? 1 : 0,
        row.model ?? null,
        row.fallbackUsed ? 1 : 0,
        row.errorStatus ?? null,
        row.promptTokens ?? null,
        row.outputTokens ?? null,
        row.latencyMs ?? null,
        JSON.stringify(row.lectureIds || [])
      )
      .run();
  } catch (error) {
    console.error(`Usage log failed: ${error.message}`);
  }
}

export async function getUsageSummary(env, days) {
  const since = `-${days} days`;
  const q = (sql) => env.DB.prepare(sql).bind(since).all().then((r) => r.results || []);

  const [totals, daily, errors, lectureRows] = await Promise.all([
    q(`SELECT COUNT(*) AS questions,
              SUM(ok) AS answered,
              SUM(fallback_used) AS fallbacks,
              COALESCE(SUM(prompt_tokens), 0) AS prompt_tokens,
              COALESCE(SUM(output_tokens), 0) AS output_tokens,
              CAST(AVG(latency_ms) AS INTEGER) AS avg_latency_ms
       FROM usage_log WHERE created_at >= datetime('now', ?)`),
    q(`SELECT date(created_at) AS day, COUNT(*) AS questions, SUM(1 - ok) AS errors
       FROM usage_log WHERE created_at >= datetime('now', ?)
       GROUP BY day ORDER BY day DESC`),
    q(`SELECT error_status, COUNT(*) AS count
       FROM usage_log WHERE ok = 0 AND created_at >= datetime('now', ?)
       GROUP BY error_status ORDER BY count DESC`),
    q(`SELECT lecture_ids FROM usage_log
       WHERE created_at >= datetime('now', ?) AND lecture_ids IS NOT NULL`),
  ]);

  const counts = new Map();
  for (const { lecture_ids } of lectureRows) {
    try {
      for (const id of JSON.parse(lecture_ids)) counts.set(id, (counts.get(id) || 0) + 1);
    } catch {}
  }
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  let topLectures = [];
  if (top.length) {
    const { results } = await env.DB.prepare(
      `SELECT id, lecture_date, lecture_title FROM lectures WHERE id IN (${top.map(() => "?").join(",")})`
    ).bind(...top.map(([id]) => id)).all();
    const byId = new Map((results || []).map((l) => [l.id, l]));
    topLectures = top
      .filter(([id]) => byId.has(id))
      .map(([id, n]) => ({ ...byId.get(id), times_used: n }));
  }

  return { days, totals: totals[0], daily, errors, topLectures };
}

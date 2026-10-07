CREATE TABLE IF NOT EXISTS lectures (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lecture_date TEXT NOT NULL,
  lecture_title TEXT NOT NULL,
  source_filename TEXT,
  extracted_text TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_lectures_date ON lectures (lecture_date);

-- One row per /api/ask call. Metadata only: no question text, no student identifiers.
CREATE TABLE IF NOT EXISTS usage_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  ok INTEGER NOT NULL,
  model TEXT,
  fallback_used INTEGER NOT NULL DEFAULT 0,
  error_status INTEGER,
  prompt_tokens INTEGER,
  output_tokens INTEGER,
  latency_ms INTEGER,
  lecture_ids TEXT
);

CREATE INDEX IF NOT EXISTS idx_usage_created ON usage_log (created_at);

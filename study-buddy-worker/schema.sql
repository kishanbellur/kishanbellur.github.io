CREATE TABLE IF NOT EXISTS lectures (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lecture_date TEXT NOT NULL,
  lecture_title TEXT NOT NULL,
  source_filename TEXT,
  extracted_text TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_lectures_date ON lectures (lecture_date);

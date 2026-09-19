import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DATA_DIR = path.join(process.cwd(), "data", "woz");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const db = new Database(path.join(DATA_DIR, "woz.db"));

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS participants (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    alias TEXT,
    phone TEXT,
    intake_source TEXT,
    start_date TEXT NOT NULL,
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS threads (
    id TEXT PRIMARY KEY,
    participant_id TEXT NOT NULL,
    inbound_text TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new',
    is_second_ask INTEGER NOT NULL DEFAULT 0,
    related_thread_id TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (participant_id) REFERENCES participants(id),
    FOREIGN KEY (related_thread_id) REFERENCES threads(id)
  );

  CREATE TABLE IF NOT EXISTS answers (
    id TEXT PRIMARY KEY,
    thread_id TEXT NOT NULL UNIQUE,
    the_move TEXT NOT NULL,
    what_to_say TEXT,
    whom_to_say_it_to TEXT,
    order_and_deadline TEXT,
    why_it_works TEXT,
    referral_ids TEXT,
    free_text_referral TEXT,
    review_status TEXT NOT NULL DEFAULT 'needs_review',
    prefilled_from_seed TEXT,
    final_sent_text TEXT,
    sent_at TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (thread_id) REFERENCES threads(id)
  );

  CREATE TABLE IF NOT EXISTS follow_ups (
    id TEXT PRIMARY KEY,
    thread_id TEXT NOT NULL,
    due_date TEXT NOT NULL,
    what_they_did TEXT,
    showed_to_sibling INTEGER,
    could_not_answer TEXT,
    notes TEXT,
    completed_at TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (thread_id) REFERENCES threads(id)
  );

  CREATE INDEX IF NOT EXISTS idx_threads_participant ON threads(participant_id);
  CREATE INDEX IF NOT EXISTS idx_threads_status ON threads(status);
  CREATE INDEX IF NOT EXISTS idx_answers_thread ON answers(thread_id);
  CREATE INDEX IF NOT EXISTS idx_follow_ups_thread ON follow_ups(thread_id);
  CREATE INDEX IF NOT EXISTS idx_follow_ups_due ON follow_ups(due_date);
`);

export default db;

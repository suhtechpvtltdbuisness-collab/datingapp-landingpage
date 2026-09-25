import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { seed } from "./seed";
import { utcNowIso } from "./time";

/**
 * SQLite data layer for the admin panel.
 * Uses Node's built-in sqlite (no native packages to install).
 */
function resolveDbPath(): string {
  if (process.env.ADMIN_DB_PATH) return process.env.ADMIN_DB_PATH;
  // Serverless file systems are read-only except /tmp (ephemeral; re-seeded on cold start).
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) return "/tmp/dating_admin.db";
  return path.join(process.cwd(), "data", "dating_admin.db");
}

function initDb(db: DatabaseSync) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin',
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      gender TEXT,
      age INTEGER,
      city TEXT,
      country TEXT,
      bio TEXT,
      photo_url TEXT,
      is_verified INTEGER NOT NULL DEFAULT 0,
      is_banned INTEGER NOT NULL DEFAULT 0,
      is_online INTEGER NOT NULL DEFAULT 0,
      plan TEXT NOT NULL DEFAULT 'free',
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS matches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_a_id INTEGER NOT NULL,
      user_b_id INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_a_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (user_b_id) REFERENCES users (id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reporter_id INTEGER,
      reported_id INTEGER NOT NULL,
      reason TEXT NOT NULL,
      details TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL,
      resolved_at TEXT,
      FOREIGN KEY (reporter_id) REFERENCES users (id) ON DELETE SET NULL,
      FOREIGN KEY (reported_id) REFERENCES users (id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS activity_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      admin_username TEXT NOT NULL,
      action TEXT NOT NULL,
      target TEXT,
      created_at TEXT NOT NULL
    );
  `);
}

// One connection per server process (kept across dev hot-reloads).
const globalForDb = globalThis as unknown as { __adminDb?: DatabaseSync };

export function db(): DatabaseSync {
  if (!globalForDb.__adminDb) {
    const file = resolveDbPath();
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const conn = new DatabaseSync(file);
    conn.exec("PRAGMA foreign_keys = ON");
    initDb(conn);
    seed(conn);
    globalForDb.__adminDb = conn;
  }
  return globalForDb.__adminDb;
}

export function all<T>(sql: string, ...params: (string | number | null)[]): T[] {
  return db().prepare(sql).all(...params) as unknown as T[];
}

export function get<T>(sql: string, ...params: (string | number | null)[]): T | undefined {
  return db().prepare(sql).get(...params) as unknown as T | undefined;
}

export function run(sql: string, ...params: (string | number | null)[]) {
  return db().prepare(sql).run(...params);
}

export function count(sql: string, ...params: (string | number | null)[]): number {
  return (get<{ c: number }>(sql, ...params)?.c ?? 0) as number;
}

export function logActivity(adminUsername: string, action: string, target: string | null = null) {
  run(
    "INSERT INTO activity_log (admin_username, action, target, created_at) VALUES (?, ?, ?, ?)",
    adminUsername, action, target, utcNowIso(),
  );
}

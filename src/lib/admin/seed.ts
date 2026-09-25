import type { DatabaseSync } from "node:sqlite";
import { generatePasswordHashSync } from "./password";
import { utcNowIso } from "./time";

/**
 * First-run data: a default admin login plus demo users, matches and reports
 * so every screen has content on an empty database.
 */
export const DEFAULT_ADMIN_USERNAME = "admin";
export const DEFAULT_ADMIN_PASSWORD = "ChangeMe!123";

type DemoUser = [string, string, string, number, string, string, number, number, number, string];

const DEMO_USERS: DemoUser[] = [
  ["Ava Martinez", "ava.martinez@example.com", "female", 26, "Mumbai", "India", 1, 0, 1, "premium"],
  ["Rohan Iyer", "rohan.iyer@example.com", "male", 29, "Bengaluru", "India", 1, 0, 0, "free"],
  ["Priya Nair", "priya.nair@example.com", "female", 24, "Delhi", "India", 0, 0, 1, "free"],
  ["Karan Shah", "karan.shah@example.com", "male", 31, "Pune", "India", 1, 0, 0, "premium"],
  ["Meera Joshi", "meera.joshi@example.com", "female", 27, "Hyderabad", "India", 0, 1, 0, "free"],
  ["Aditya Rao", "aditya.rao@example.com", "male", 28, "Chennai", "India", 1, 0, 1, "free"],
  ["Sara Khan", "sara.khan@example.com", "female", 23, "Jaipur", "India", 0, 0, 0, "free"],
  ["Vikram Singh", "vikram.singh@example.com", "male", 33, "Kolkata", "India", 1, 0, 1, "premium"],
];

const DEMO_REPORT_REASONS = [
  "Inappropriate photos",
  "Harassment in chat",
  "Suspected fake profile",
  "Spam / solicitation",
  "Underage suspicion",
];

const randInt = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));
const choice = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)];
function samplePair(ids: number[]): [number, number] {
  const a = choice(ids);
  let b = choice(ids);
  while (b === a) b = choice(ids);
  return [a, b];
}
const daysAgo = (days: number) => utcNowIso(new Date(Date.now() - days * 86_400_000));

export function seed(db: DatabaseSync) {
  const hasAdmin = (db.prepare("SELECT COUNT(*) AS c FROM admins").get() as { c: number }).c > 0;
  if (!hasAdmin) {
    db.prepare("INSERT OR IGNORE INTO admins (username, password_hash, role, created_at) VALUES (?, ?, ?, ?)").run(
      DEFAULT_ADMIN_USERNAME,
      generatePasswordHashSync(DEFAULT_ADMIN_PASSWORD),
      "superadmin",
      utcNowIso(),
    );
    console.log(`[seed] Admin login created -> username: ${DEFAULT_ADMIN_USERNAME}  password: ${DEFAULT_ADMIN_PASSWORD}`);
    console.log("[seed] IMPORTANT: change this password after first login (Settings page).");
  }

  const hasUsers = (db.prepare("SELECT COUNT(*) AS c FROM users").get() as { c: number }).c > 0;
  if (hasUsers) return;

  const insertUser = db.prepare(
    `INSERT INTO users
       (full_name, email, gender, age, city, country, bio, photo_url,
        is_verified, is_banned, is_online, plan, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  const userIds = DEMO_USERS.map(([name, email, gender, age, city, country, verified, banned, online, plan], i) =>
    Number(
      insertUser.run(
        name, email, gender, age, city, country,
        "Living life one swipe at a time.",
        `https://i.pravatar.cc/300?img=${i + 5}`,
        verified, banned, online, plan, daysAgo(randInt(1, 200)),
      ).lastInsertRowid,
    ),
  );

  const insertMatch = db.prepare("INSERT INTO matches (user_a_id, user_b_id, status, created_at) VALUES (?, ?, ?, ?)");
  for (let i = 0; i < 6; i++) {
    const [a, b] = samplePair(userIds);
    insertMatch.run(a, b, choice(["active", "active", "unmatched"]), daysAgo(randInt(0, 60)));
  }

  const insertReport = db.prepare(
    `INSERT INTO reports (reporter_id, reported_id, reason, details, status, created_at, resolved_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  );
  for (let i = 0; i < 5; i++) {
    const [reporter, reported] = samplePair(userIds);
    const status = i < 3 ? "pending" : choice(["resolved", "dismissed"]);
    insertReport.run(
      reporter, reported, choice(DEMO_REPORT_REASONS),
      "Reported via mobile app report flow.",
      status, daysAgo(randInt(0, 30)), status === "pending" ? null : utcNowIso(),
    );
  }
  console.log(`[seed] Inserted ${userIds.length} demo users, 6 matches, 5 reports.`);
}

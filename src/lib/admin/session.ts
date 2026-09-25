import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

/** Signed-cookie admin session holding the signed-in admin's id and username. */
export const SESSION_COOKIE = "admin_session";

export interface AdminSession {
  id: number;
  username: string;
}

let cachedSecret: string | undefined;

/** Stable signing key: ADMIN_SECRET_KEY, else the Vercel deployment, else a key saved in data/secret_key. */
function secret(): string {
  if (cachedSecret) return cachedSecret;
  if (process.env.ADMIN_SECRET_KEY) return (cachedSecret = process.env.ADMIN_SECRET_KEY);
  const deployment = process.env.VERCEL_DEPLOYMENT_ID || process.env.VERCEL_URL;
  if (deployment) return (cachedSecret = crypto.createHash("sha256").update(deployment).digest("hex"));

  const file = path.join(process.cwd(), "data", "secret_key");
  try {
    cachedSecret = fs.readFileSync(file, "utf8").trim();
  } catch {
    /* first run */
  }
  if (!cachedSecret) {
    cachedSecret = crypto.randomBytes(32).toString("hex");
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, cachedSecret, { mode: 0o600 });
  }
  return cachedSecret;
}

const sign = (payload: string) => crypto.createHmac("sha256", secret()).update(payload).digest("base64url");

export async function getSession(): Promise<AdminSession | null> {
  const raw = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  const [payload, signature] = raw.split(".");
  if (!payload || !signature) return null;
  const expected = sign(payload);
  if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return null;
  }
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (typeof data.id === "number" && typeof data.username === "string") return { id: data.id, username: data.username };
  } catch {
    /* malformed */
  }
  return null;
}

export async function setSession(session: AdminSession) {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  (await cookies()).set(SESSION_COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    path: "/admin",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearSession() {
  (await cookies()).delete({ name: SESSION_COOKIE, path: "/admin" });
}

/** Guard for signed-in pages and actions: send signed-out visitors to the login page with ?next=. */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getSession();
  if (!session) {
    const current = (await headers()).get("x-admin-path") ?? "/admin";
    redirect(`/admin/login?next=${encodeURIComponent(current)}`);
  }
  return session;
}

/** Only follow ?next= links that stay inside the admin panel. */
export function safeNext(next: string | null | undefined): string | null {
  if (!next || !next.startsWith("/admin") || next.startsWith("//") || next.includes("\\")) return null;
  return next;
}

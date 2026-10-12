import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

/**
 * The admin session is the backend's admin access token, kept in an httpOnly cookie.
 * The backend verifies it on every call; here we only read the username and expiry from it.
 */
export const SESSION_COOKIE = "admin_session";

export interface AdminSession {
  id: string;
  username: string;
}

function decode(token: string): { sub: string; username: string; exp: number } | null {
  try {
    const data = JSON.parse(Buffer.from(token.split(".")[1] ?? "", "base64url").toString("utf8"));
    if (typeof data.sub === "string" && typeof data.username === "string" && typeof data.exp === "number") {
      return data;
    }
  } catch {
    /* malformed */
  }
  return null;
}

export async function getToken(): Promise<string | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const claims = decode(token);
  return claims && claims.exp * 1000 > Date.now() ? token : null;
}

export async function getSession(): Promise<AdminSession | null> {
  const token = await getToken();
  const claims = token ? decode(token) : null;
  return claims ? { id: claims.sub, username: claims.username } : null;
}

export async function setSession(token: string) {
  const claims = decode(token);
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/admin",
    secure: process.env.NODE_ENV === "production",
    expires: claims ? new Date(claims.exp * 1000) : undefined,
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

import { NextResponse } from "next/server";

/** Backend base URL for public (non-admin) account calls. Mirrors lib/admin/api.ts without its auth/redirect helpers. */
export function backendUrl(): string {
  const raw = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
  return raw.replace(/\/+$/, "");
}

export function fail(message: string, status: number) {
  return NextResponse.json({ message }, { status, headers: { "Cache-Control": "no-store" } });
}

export function ok(data: Record<string, unknown>) {
  return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
}

/** Calls the backend and returns the parsed JSON, or throws a message safe to show the user. */
export async function callBackend(path: string, init: RequestInit): Promise<{ status: number; ok: boolean; json: any }> {
  try {
    const res = await fetch(`${backendUrl()}${path}`, { ...init, cache: "no-store", signal: AbortSignal.timeout(20_000) });
    const json = await res.json().catch(() => ({}));
    return { status: res.status, ok: res.ok, json };
  } catch {
    throw new Error("We couldn't reach our servers. Please try again in a moment.");
  }
}

/** Reads the `sub` claim from a JWT (no signature check — the backend verifies the token on every call). */
export function jwtSub(token: string): string {
  try {
    const payload = token.split(".")[1];
    const json = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return typeof json.sub === "string" ? json.sub : "";
  } catch {
    return "";
  }
}

/** Clients get 4xx messages from the backend as-is; anything else is a generic failure. */
export function clientStatus(status: number): number {
  return status >= 400 && status < 500 ? status : 502;
}

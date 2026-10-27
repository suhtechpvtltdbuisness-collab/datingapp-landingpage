import { callBackend, clientStatus, fail, ok } from "@/lib/account";

/** POST { phone } — asks the backend to text a login code (GET /users/otp/:phone). */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const phone = typeof body?.phone === "string" ? body.phone.trim() : "";
  if (!/^\+\d{8,15}$/.test(phone)) return fail("Enter a valid phone number with country code.", 400);

  try {
    const res = await callBackend(`/users/otp/${encodeURIComponent(phone)}`, { method: "GET" });
    if (!res.ok) return fail(res.json?.message || "We couldn't send a code to that number.", clientStatus(res.status));
    return ok({ sent: true });
  } catch (e) {
    return fail((e as Error).message, 502);
  }
}

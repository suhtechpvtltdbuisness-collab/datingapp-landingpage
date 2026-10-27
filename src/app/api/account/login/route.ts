import { callBackend, clientStatus, fail, jwtSub, ok } from "@/lib/account";

/**
 * POST { email, password } or { phone, otp } — signs in against POST /users/login purely to verify
 * ownership of the account. The token is returned to the page only for the follow-up delete call.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return fail("Invalid request.", 400);

  let payload: Record<string, string>;
  if (typeof body.phone === "string") {
    const phone = body.phone.trim();
    const otp = typeof body.otp === "string" ? body.otp.trim() : "";
    if (!/^\+\d{8,15}$/.test(phone) || !/^\d{4,8}$/.test(otp)) return fail("Enter your phone number and the code we sent.", 400);
    payload = { phoneNumber: phone, otp };
  } else {
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";
    if (!email || !password) return fail("Enter your email and password.", 400);
    payload = { email, password };
  }

  try {
    const res = await callBackend("/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const fallback = res.status === 401 || res.status === 400 ? "Those details don't match an account." : "We couldn't verify your account.";
      return fail(res.json?.message || fallback, clientStatus(res.status));
    }

    const data = res.json?.data ?? res.json ?? {};
    const token: string = data.accessToken || data.token || data.access_token || "";
    if (!token) return fail("We couldn't verify your account.", 502);

    return ok({
      token,
      userId: data.userId || data.user?.id || data.user?._id || jwtSub(token),
      email: data.userEmail || data.user?.email || payload.email || "",
    });
  } catch (e) {
    return fail((e as Error).message, 502);
  }
}

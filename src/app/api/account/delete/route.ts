import { callBackend, clientStatus, fail, jwtSub, ok } from "@/lib/account";

/** POST { token, userId } — permanently deletes the verified user (DELETE /users/:id). */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const token = typeof body?.token === "string" ? body.token : "";
  if (!token) return fail("Your session has expired. Please verify again.", 401);

  // The token's own subject wins over anything the client sends, so a token can only delete its owner.
  const userId = jwtSub(token) || (typeof body?.userId === "string" ? body.userId : "");
  if (!userId) return fail("Your session has expired. Please verify again.", 401);

  try {
    const res = await callBackend(`/users/${encodeURIComponent(userId)}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return fail(res.json?.message || "We couldn't delete your account. Please try again.", clientStatus(res.status));
    return ok({ deleted: true });
  } catch (e) {
    return fail((e as Error).message, 502);
  }
}

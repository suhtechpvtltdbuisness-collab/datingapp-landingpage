import { redirect } from "next/navigation";
import { api } from "@/lib/admin/api";
import { clearSession, getToken } from "@/lib/admin/session";

/** Also the landing spot when the backend rejects the session token: clear the cookie and sign in again. */
export async function GET() {
  if (await getToken()) await api("/auth/logout", { method: "POST" }).catch(() => undefined);
  await clearSession();
  redirect("/admin/login");
}

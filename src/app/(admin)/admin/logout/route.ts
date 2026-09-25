import { redirect } from "next/navigation";
import { logActivity } from "@/lib/admin/db";
import { clearSession, getSession } from "@/lib/admin/session";

export async function GET() {
  const session = await getSession();
  if (session) logActivity(session.username, "logout");
  await clearSession();
  redirect("/admin/login");
}

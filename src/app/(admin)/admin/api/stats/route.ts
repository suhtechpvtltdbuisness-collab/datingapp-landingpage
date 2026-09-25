import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { count } from "@/lib/admin/db";
import { getSession } from "@/lib/admin/session";

/** JSON stats endpoint, protected by the same session login. */
export async function GET() {
  if (!(await getSession())) redirect("/admin/login?next=%2Fadmin%2Fapi%2Fstats");
  return NextResponse.json({
    total_users: count("SELECT COUNT(*) c FROM users"),
    total_matches: count("SELECT COUNT(*) c FROM matches"),
    pending_reports: count("SELECT COUNT(*) c FROM reports WHERE status='pending'"),
  });
}

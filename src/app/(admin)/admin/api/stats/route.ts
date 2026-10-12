import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { api } from "@/lib/admin/api";
import { getSession } from "@/lib/admin/session";

/** JSON stats endpoint, protected by the same session login. */
export async function GET() {
  if (!(await getSession())) redirect("/admin/login?next=%2Fadmin%2Fapi%2Fstats");
  const { data } = await api<unknown>("/stats");
  return NextResponse.json(data);
}

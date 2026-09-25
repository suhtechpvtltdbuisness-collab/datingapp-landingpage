"use server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { get, logActivity, run } from "@/lib/admin/db";
import { flash } from "@/lib/admin/flash";
import { checkPasswordHash, generatePasswordHash } from "@/lib/admin/password";
import { requireAdmin, safeNext, setSession } from "@/lib/admin/session";
import { utcNowIso } from "@/lib/admin/time";
import type { AdminRow } from "@/lib/admin/types";

/** Go back to the page the action came from (the Referer), staying inside /admin. */
async function back(fallback: string): Promise<never> {
  const referer = (await headers()).get("referer");
  if (referer) {
    try {
      const url = new URL(referer);
      const target = safeNext(url.pathname + url.search);
      if (target) redirect(target);
    } catch (err) {
      if (!(err instanceof TypeError)) throw err;
    }
  }
  redirect(fallback);
}

// ------------------------------------------------------------------ auth
export async function login(formData: FormData) {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(String(formData.get("next") ?? ""));

  const admin = get<AdminRow>("SELECT * FROM admins WHERE username = ?", username);
  if (admin && (await checkPasswordHash(admin.password_hash, password))) {
    await setSession({ id: admin.id, username: admin.username });
    logActivity(admin.username, "login");
    redirect(next ?? "/admin");
  }

  await flash("Invalid username or password.", "error");
  redirect(next ? `/admin/login?next=${encodeURIComponent(next)}` : "/admin/login");
}

// ------------------------------------------------------------------ users
export async function banUser(userId: number) {
  const admin = await requireAdmin();
  run("UPDATE users SET is_banned = 1 WHERE id = ?", userId);
  logActivity(admin.username, "ban_user", `user#${userId}`);
  await flash("User banned.", "success");
  await back("/admin/users");
}

export async function unbanUser(userId: number) {
  const admin = await requireAdmin();
  run("UPDATE users SET is_banned = 0 WHERE id = ?", userId);
  logActivity(admin.username, "unban_user", `user#${userId}`);
  await flash("User unbanned.", "success");
  await back("/admin/users");
}

export async function verifyUser(userId: number) {
  const admin = await requireAdmin();
  run("UPDATE users SET is_verified = 1 WHERE id = ?", userId);
  logActivity(admin.username, "verify_user", `user#${userId}`);
  await flash("User marked as verified.", "success");
  await back("/admin/users");
}

export async function deleteUser(userId: number) {
  const admin = await requireAdmin();
  run("DELETE FROM users WHERE id = ?", userId);
  logActivity(admin.username, "delete_user", `user#${userId}`);
  await flash("User deleted.", "success");
  redirect("/admin/users");
}

// ------------------------------------------------------------------ reports
export async function resolveReport(reportId: number) {
  const admin = await requireAdmin();
  run("UPDATE reports SET status = 'resolved', resolved_at = ? WHERE id = ?", utcNowIso(), reportId);
  logActivity(admin.username, "resolve_report", `report#${reportId}`);
  await flash("Report marked as resolved.", "success");
  await back("/admin/reports");
}

export async function dismissReport(reportId: number) {
  const admin = await requireAdmin();
  run("UPDATE reports SET status = 'dismissed', resolved_at = ? WHERE id = ?", utcNowIso(), reportId);
  logActivity(admin.username, "dismiss_report", `report#${reportId}`);
  await flash("Report dismissed.", "success");
  await back("/admin/reports");
}

// ------------------------------------------------------------------ settings
export async function changePassword(formData: FormData) {
  const admin = await requireAdmin();
  const currentPassword = String(formData.get("current_password") ?? "");
  const newPassword = String(formData.get("new_password") ?? "");
  const confirmPassword = String(formData.get("confirm_password") ?? "");

  const row = get<AdminRow>("SELECT * FROM admins WHERE id = ?", admin.id);
  if (!row || !(await checkPasswordHash(row.password_hash, currentPassword))) {
    await flash("Current password is incorrect.", "error");
  } else if (newPassword.length < 8) {
    await flash("New password must be at least 8 characters.", "error");
  } else if (newPassword !== confirmPassword) {
    await flash("New password and confirmation do not match.", "error");
  } else {
    run("UPDATE admins SET password_hash = ? WHERE id = ?", await generatePasswordHash(newPassword), admin.id);
    logActivity(admin.username, "change_password");
    await flash("Password updated successfully.", "success");
  }
  redirect("/admin/settings");
}

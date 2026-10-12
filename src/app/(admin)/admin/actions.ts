"use server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ApiError, api } from "@/lib/admin/api";
import { flash } from "@/lib/admin/flash";
import { requireAdmin, safeNext, setSession } from "@/lib/admin/session";

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

/** Runs a backend call and flashes its outcome; backend errors become an error flash, not a crash. */
async function perform(request: Promise<{ message?: string }>, fallbackMessage: string) {
  try {
    const res = await request;
    await flash(res.message ?? fallbackMessage, "success");
  } catch (err) {
    if (!(err instanceof ApiError)) throw err;
    await flash(err.message, "error");
  }
}

// ------------------------------------------------------------------ auth
export async function login(formData: FormData) {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(String(formData.get("next") ?? ""));

  try {
    const res = await api<{ accessToken: string }>("/auth/login", {
      method: "POST",
      body: { username, password },
      auth: false,
    });
    await setSession(res.data.accessToken);
  } catch (err) {
    if (!(err instanceof ApiError)) throw err;
    await flash(err.status === 401 ? "Invalid username or password." : err.message, "error");
    redirect(next ? `/admin/login?next=${encodeURIComponent(next)}` : "/admin/login");
  }
  redirect(next ?? "/admin");
}

// ------------------------------------------------------------------ users
export async function banUser(userId: string) {
  await requireAdmin();
  await perform(api(`/users/${userId}/ban`, { method: "POST" }), "User banned.");
  await back("/admin/users");
}

export async function unbanUser(userId: string) {
  await requireAdmin();
  await perform(api(`/users/${userId}/unban`, { method: "POST" }), "User unbanned.");
  await back("/admin/users");
}

export async function verifyUser(userId: string) {
  await requireAdmin();
  await perform(api(`/users/${userId}/verify`, { method: "POST" }), "User marked as verified.");
  await back("/admin/users");
}

export async function deleteUser(userId: string) {
  await requireAdmin();
  await perform(api(`/users/${userId}`, { method: "DELETE" }), "User deleted.");
  redirect("/admin/users");
}

// ------------------------------------------------------------------ reports
export async function resolveReport(reportId: string) {
  await requireAdmin();
  await perform(api(`/reports/${reportId}/resolve`, { method: "POST" }), "Report marked as resolved.");
  await back("/admin/reports");
}

export async function dismissReport(reportId: string) {
  await requireAdmin();
  await perform(api(`/reports/${reportId}/dismiss`, { method: "POST" }), "Report dismissed.");
  await back("/admin/reports");
}

// ------------------------------------------------------------------ settings
export async function changePassword(formData: FormData) {
  await requireAdmin();
  await perform(
    api("/auth/password", {
      method: "PUT",
      body: {
        currentPassword: String(formData.get("current_password") ?? ""),
        newPassword: String(formData.get("new_password") ?? ""),
        confirmPassword: String(formData.get("confirm_password") ?? ""),
      },
    }),
    "Password updated successfully.",
  );
  redirect("/admin/settings");
}

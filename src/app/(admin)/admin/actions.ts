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

// ------------------------------------------------------------------ plans
export async function createPlan(formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  const price = String(formData.get("price") ?? "").trim();
  const period = String(formData.get("period") ?? "PER WEEK").trim();
  const subtitle = String(formData.get("subtitle") ?? "").trim();
  const badge = String(formData.get("badge") ?? "").trim();
  const isBest = formData.get("isBest") === "on" || formData.get("isBest") === "true";
  const sortOrder = Number(formData.get("sortOrder") ?? 0);
  const features = String(formData.get("features") ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  await perform(
    api("/plans", {
      method: "POST",
      body: { title, price, period, subtitle, badge, isBest, sortOrder, features },
    }),
    "Plan created successfully.",
  );
  redirect("/admin/plans");
}

export async function updatePlan(planId: string, formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  const price = String(formData.get("price") ?? "").trim();
  const period = String(formData.get("period") ?? "PER WEEK").trim();
  const subtitle = String(formData.get("subtitle") ?? "").trim();
  const badge = String(formData.get("badge") ?? "").trim();
  const isBest = formData.get("isBest") === "on" || formData.get("isBest") === "true";
  const isActive = formData.get("isActive") === "on" || formData.get("isActive") === "true";
  const sortOrder = Number(formData.get("sortOrder") ?? 0);
  const features = String(formData.get("features") ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  await perform(
    api(`/plans/${planId}`, {
      method: "PUT",
      body: { title, price, period, subtitle, badge, isBest, isActive, sortOrder, features },
    }),
    "Plan updated successfully.",
  );
  redirect("/admin/plans");
}

export async function togglePlan(planId: string) {
  await requireAdmin();
  await perform(api(`/plans/${planId}/toggle`, { method: "POST" }), "Plan status updated.");
  await back("/admin/plans");
}

export async function deletePlan(planId: string) {
  await requireAdmin();
  await perform(api(`/plans/${planId}`, { method: "DELETE" }), "Plan removed.");
  await back("/admin/plans");
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

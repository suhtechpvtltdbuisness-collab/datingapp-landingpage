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

// ------------------------------------------------------------------ blogs
export async function createBlogPost(formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  let coverImage = String(formData.get("coverImage") ?? "").trim();

  // If user uploaded a cover image file, send to backend upload endpoint
  const coverImageFile = formData.get("coverImageFile");
  if (coverImageFile && typeof coverImageFile === "object" && "size" in coverImageFile && coverImageFile.size > 0) {
    try {
      const uploadData = new FormData();
      uploadData.append("file", coverImageFile);
      const res = await api<{ url: string }>("/blogs/upload-cover", {
        method: "POST",
        body: uploadData,
      });
      if (res?.data?.url) {
        coverImage = res.data.url;
      }
    } catch (uploadErr) {
      console.error("Cover image upload failed:", uploadErr);
    }
  }

  const category = String(formData.get("category") ?? "Dating Tips").trim();
  const author = String(formData.get("author") ?? "Vellora Team").trim();
  const readTime = String(formData.get("readTime") ?? "3 min read").trim();
  const isPublished = formData.get("isPublished") === "on" || formData.get("isPublished") === "true";
  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  await perform(
    api("/blogs", {
      method: "POST",
      body: {
        title,
        slug: slug || undefined,
        summary,
        content,
        coverImage,
        category,
        author,
        readTime,
        isPublished,
        tags,
      },
    }),
    "Blog post created successfully.",
  );
  redirect("/admin/blogs");
}

export async function updateBlogPost(blogId: string, formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  let coverImage = String(formData.get("coverImage") ?? "").trim();

  // If user uploaded a new cover image file, send to backend upload endpoint
  const coverImageFile = formData.get("coverImageFile");
  if (coverImageFile && typeof coverImageFile === "object" && "size" in coverImageFile && coverImageFile.size > 0) {
    try {
      const uploadData = new FormData();
      uploadData.append("file", coverImageFile);
      const res = await api<{ url: string }>("/blogs/upload-cover", {
        method: "POST",
        body: uploadData,
      });
      if (res?.data?.url) {
        coverImage = res.data.url;
      }
    } catch (uploadErr) {
      console.error("Cover image upload failed:", uploadErr);
    }
  }

  const category = String(formData.get("category") ?? "Dating Tips").trim();
  const author = String(formData.get("author") ?? "Vellora Team").trim();
  const readTime = String(formData.get("readTime") ?? "3 min read").trim();
  const isPublished = formData.get("isPublished") === "on" || formData.get("isPublished") === "true";
  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  await perform(
    api(`/blogs/${blogId}`, {
      method: "PUT",
      body: {
        title,
        slug: slug || undefined,
        summary,
        content,
        coverImage,
        category,
        author,
        readTime,
        isPublished,
        tags,
      },
    }),
    "Blog post updated successfully.",
  );
  redirect("/admin/blogs");
}

export async function toggleBlogPost(blogId: string) {
  await requireAdmin();
  await perform(api(`/blogs/${blogId}/toggle`, { method: "POST" }), "Blog status updated.");
  await back("/admin/blogs");
}

export async function deleteBlogPost(blogId: string) {
  await requireAdmin();
  await perform(api(`/blogs/${blogId}`, { method: "DELETE" }), "Blog post removed.");
  await back("/admin/blogs");
}

// ------------------------------------------------------------------ blog comments
export async function approveBlogComment(commentId: string) {
  await requireAdmin();
  await perform(
    api(`/blogs-comments/${commentId}/approve`, { method: "POST" }),
    "Comment approved and is now visible publicly.",
  );
  await back("/admin/blogs?tab=comments");
}

export async function rejectBlogComment(commentId: string) {
  await requireAdmin();
  await perform(
    api(`/blogs-comments/${commentId}/reject`, { method: "POST" }),
    "Comment rejected.",
  );
  await back("/admin/blogs?tab=comments");
}

export async function deleteBlogComment(commentId: string) {
  await requireAdmin();
  await perform(
    api(`/blogs-comments/${commentId}`, { method: "DELETE" }),
    "Comment deleted.",
  );
  await back("/admin/blogs?tab=comments");
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

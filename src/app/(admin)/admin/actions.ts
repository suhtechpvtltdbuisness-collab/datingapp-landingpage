"use server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
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
  revalidatePath("/", "layout");
  revalidatePath("/admin/plans");
  revalidatePath("/safety");
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
  revalidatePath("/", "layout");
  revalidatePath("/admin/plans");
  revalidatePath("/safety");
  redirect("/admin/plans");
}

export async function togglePlan(planId: string) {
  await requireAdmin();
  await perform(api(`/plans/${planId}/toggle`, { method: "POST" }), "Plan status updated.");
  revalidatePath("/", "layout");
  revalidatePath("/admin/plans");
  revalidatePath("/safety");
  await back("/admin/plans");
}

export async function deletePlan(planId: string) {
  await requireAdmin();
  await perform(api(`/plans/${planId}`, { method: "DELETE" }), "Plan removed.");
  revalidatePath("/", "layout");
  revalidatePath("/admin/plans");
  revalidatePath("/safety");
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
  revalidatePath("/", "layout");
  revalidatePath("/admin/blogs");
  revalidatePath("/blogs");
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
  revalidatePath("/", "layout");
  revalidatePath("/admin/blogs");
  revalidatePath("/blogs");
  redirect("/admin/blogs");
}

export async function toggleBlogPost(blogId: string) {
  await requireAdmin();
  await perform(api(`/blogs/${blogId}/toggle`, { method: "POST" }), "Blog status updated.");
  revalidatePath("/", "layout");
  revalidatePath("/admin/blogs");
  revalidatePath("/blogs");
  await back("/admin/blogs");
}

export async function deleteBlogPost(blogId: string) {
  await requireAdmin();
  await perform(api(`/blogs/${blogId}`, { method: "DELETE" }), "Blog post removed.");
  revalidatePath("/", "layout");
  revalidatePath("/admin/blogs");
  revalidatePath("/blogs");
  await back("/admin/blogs");
}

// ------------------------------------------------------------------ blog comments
export async function approveBlogComment(commentId: string) {
  await requireAdmin();
  await perform(
    api(`/blogs-comments/${commentId}/approve`, { method: "POST" }),
    "Comment approved and is now visible publicly.",
  );
  revalidatePath("/", "layout");
  revalidatePath("/admin/blogs");
  revalidatePath("/blogs");
  await back("/admin/blogs?tab=comments");
}

export async function rejectBlogComment(commentId: string) {
  await requireAdmin();
  await perform(
    api(`/blogs-comments/${commentId}/reject`, { method: "POST" }),
    "Comment rejected.",
  );
  revalidatePath("/", "layout");
  revalidatePath("/admin/blogs");
  revalidatePath("/blogs");
  await back("/admin/blogs?tab=comments");
}

export async function deleteBlogComment(commentId: string) {
  await requireAdmin();
  await perform(
    api(`/blogs-comments/${commentId}`, { method: "DELETE" }),
    "Comment deleted.",
  );
  revalidatePath("/", "layout");
  revalidatePath("/admin/blogs");
  revalidatePath("/blogs");
  await back("/admin/blogs?tab=comments");
}

// ------------------------------------------------------------------ website content CMS
export async function saveWebsiteContent(formData: FormData) {
  await requireAdmin();

  // Extract hero
  const heroBadge = String(formData.get("hero_badge") ?? "").trim();
  const heroH1 = String(formData.get("hero_headline_1") ?? "").trim();
  const heroH2 = String(formData.get("hero_headline_2") ?? "").trim();
  const heroH3 = String(formData.get("hero_headline_3") ?? "").trim();
  const heroSubtitle = String(formData.get("hero_subtitle") ?? "").trim();
  const googlePlayUrl = String(formData.get("googlePlayUrl") ?? "").trim();
  const appStoreUrl = String(formData.get("appStoreUrl") ?? "").trim();

  // Extract company
  const legalName = String(formData.get("legalName") ?? "").trim();
  const cin = String(formData.get("cin") ?? "").trim();
  const gstin = String(formData.get("gstin") ?? "").trim();
  const registeredOffice = String(formData.get("registeredOffice") ?? "").trim();
  const supportEmail = String(formData.get("supportEmail") ?? "").trim();
  const supportPhone = String(formData.get("supportPhone") ?? "").trim();
  const instagram = String(formData.get("instagram") ?? "").trim();
  const youtube = String(formData.get("youtube") ?? "").trim();
  const x = String(formData.get("x") ?? "").trim();

  // Extract handbook
  const handbookTitle = String(formData.get("handbook_title") ?? "").trim();
  const handbookDesc = String(formData.get("handbook_desc") ?? "").trim();
  const handbookCta = String(formData.get("handbook_cta") ?? "").trim();

  // FAQs
  const faqsRaw = String(formData.get("faqs_json") ?? "");
  let faqs;
  if (faqsRaw) {
    try {
      faqs = JSON.parse(faqsRaw);
    } catch {}
  }

  // Features
  const featuresRaw = String(formData.get("features_json") ?? "");
  let features;
  if (featuresRaw) {
    try {
      features = JSON.parse(featuresRaw);
    } catch {}
  }

  // Campaigns
  const campaignsRaw = String(formData.get("campaigns_json") ?? "");
  let campaigns;
  if (campaignsRaw) {
    try {
      campaigns = JSON.parse(campaignsRaw);
    } catch {}
  }

  // Plans Header
  const plansHeaderRaw = String(formData.get("plans_header_json") ?? "");
  let plansHeader;
  if (plansHeaderRaw) {
    try {
      plansHeader = JSON.parse(plansHeaderRaw);
    } catch {}
  }

  // Sub-pages: Kinder Together, Safety Tips, Real Talk
  const kinderTogetherRaw = String(formData.get("kinder_together_json") ?? "");
  let kinderTogether;
  if (kinderTogetherRaw) {
    try {
      kinderTogether = JSON.parse(kinderTogetherRaw);
    } catch {}
  }

  const safetyTipsRaw = String(formData.get("safety_tips_json") ?? "");
  let safetyTips;
  if (safetyTipsRaw) {
    try {
      safetyTips = JSON.parse(safetyTipsRaw);
    } catch {}
  }

  const realTalkRaw = String(formData.get("real_talk_json") ?? "");
  let realTalk;
  if (realTalkRaw) {
    try {
      realTalk = JSON.parse(realTalkRaw);
    } catch {}
  }

  const payload: Record<string, unknown> = {
    hero: {
      badge: heroBadge,
      headline: [heroH1, heroH2, heroH3].filter(Boolean),
      subtitle: heroSubtitle,
      googlePlayUrl,
      appStoreUrl,
    },
    company: {
      legalName,
      cin,
      gstin,
      registeredOffice,
      supportEmail,
      supportPhone,
      instagram,
      youtube,
      x,
    },
    handbook: {
      title: handbookTitle,
      description: handbookDesc,
      ctaText: handbookCta,
    },
  };

  if (faqs) payload.faqs = faqs;
  if (features) payload.features = features;
  if (campaigns) payload.campaigns = campaigns;
  if (plansHeader) payload.plansHeader = plansHeader;
  if (kinderTogether) payload.kinderTogether = kinderTogether;
  if (safetyTips) payload.safetyTips = safetyTips;
  if (realTalk) payload.realTalk = realTalk;

  await perform(
    api("/website-content", {
      method: "PUT",
      body: payload,
    }),
    "Website content saved and published.",
  );

  revalidatePath("/", "layout");
  revalidatePath("/admin/website");
  revalidatePath("/safety");
  revalidatePath("/about");
  revalidatePath("/kinder-together");
  revalidatePath("/safety-tips");
  revalidatePath("/real-talk");
  redirect("/admin/website");
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

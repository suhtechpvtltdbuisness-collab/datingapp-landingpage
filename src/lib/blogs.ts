import { backendUrl } from "./backend";

export interface PublicBlogPost {
  id: string;
  _id?: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage?: string;
  category: string;
  author: string;
  tags?: string[];
  readTime: string;
  isPublished: boolean;
  views: number;
  commentsCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface PublicBlogComment {
  id: string;
  _id?: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface PublicBlogDetail {
  post: PublicBlogPost;
  comments: PublicBlogComment[];
}

export function formatBlogDate(dateStr: string | Date | undefined): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function formatBlogDateLong(dateStr: string | Date | undefined): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return `${months[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

export async function getPublicBlogs(opts: {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
} = {}): Promise<{ items: PublicBlogPost[]; total: number; pages: number }> {
  try {
    const url = new URL(`${backendUrl()}/blogs`);
    if (opts.category && opts.category.toLowerCase() !== "all") {
      url.searchParams.set("category", opts.category);
    }
    if (opts.search) {
      url.searchParams.set("search", opts.search);
    }
    if (opts.page) url.searchParams.set("page", String(opts.page));
    if (opts.limit) url.searchParams.set("limit", String(opts.limit));

    const res = await fetch(url.toString(), {
      next: { revalidate: 30 },
    });
    if (!res.ok) return { items: [], total: 0, pages: 1 };
    const json = await res.json();
    return {
      items: json.data || [],
      total: json.pagination?.total || 0,
      pages: json.pagination?.pages || 1,
    };
  } catch (error) {
    console.error("Failed to fetch public blogs:", error);
    return { items: [], total: 0, pages: 1 };
  }
}

export async function getPublicBlogBySlug(
  slug: string,
): Promise<PublicBlogDetail | null> {
  try {
    const res = await fetch(`${backendUrl()}/blogs/${encodeURIComponent(slug)}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error(`Failed to fetch public blog (${slug}):`, error);
    return null;
  }
}

export async function postBlogComment(
  slug: string,
  data: { authorName: string; authorEmail: string; content: string },
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(
      `${backendUrl()}/blogs/${encodeURIComponent(slug)}/comments`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
    );
    const json = await res.json();
    if (!res.ok) {
      return {
        success: false,
        message: json.message || "Failed to submit comment",
      };
    }
    return {
      success: true,
      message:
        json.message ||
        "Thank you! Your comment has been submitted and will appear once approved by our moderation team.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Network error. Please try again.",
    };
  }
}

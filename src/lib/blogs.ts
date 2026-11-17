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

/**
 * Sanitizes blog HTML content to prevent XSS attacks while preserving formatting,
 * inline styles (colors, font-weights, alignments, etc.), links, and media.
 */
export function sanitizeBlogHtml(html: string): string {
  if (!html) return "";
  return html
    // Authors sometimes paste a whole HTML document. Drop document-level tags so a stray <title>,
    // <meta name=robots> or <link rel=canonical> from the pasted head can't end up in the page body.
    .replace(/<head\b[^>]*>[\s\S]*?<\/head>/gi, "")
    .replace(/<\/?(?:html|body)\b[^>]*>/gi, "")
    .replace(/<(?:title|meta|link|base)\b[^>]*>(?:[\s\S]*?<\/title>)?/gi, "")
    // The post title is the page's single <h1>; keep any <h1> in the body content as a (visually identical) <h2>.
    .replace(/<h1\b/gi, "<h2 data-h1")
    .replace(/<\/h1>/gi, "</h2>")
    // Remove script tags and their content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    // Remove style tags
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    // Remove applet, object, embed, iframe, frameset
    .replace(/<\/?(?:applet|object|embed|frame|frameset)\b[^>]*>/gi, "")
    // Remove on* inline event handlers (onclick, onerror, onload, onmouseover, etc.)
    .replace(/\son\w+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, "")
    // Prevent javascript: or vbscript: pseudoprotocols in href or src
    .replace(
      /(href|src)\s*=\s*['"]\s*(?:javascript|vbscript|data(?!\s*:\s*image)):[^'"]*['"]/gi,
      '$1="#"',
    );
}

/**
 * Renders blog content:
 * - If the content contains HTML tags, it sanitizes and returns the HTML.
 * - If it's legacy plain text, it wraps paragraphs in <p> tags with clean line breaks.
 */
export function renderBlogContent(rawContent: string | undefined | null): string {
  if (!rawContent) return "";
  const trimmed = rawContent.trim();
  if (!trimmed) return "";

  // Check if content already contains HTML tags (e.g., <p>, <div>, <b>, <span>, <h2>, <br>, etc.)
  const hasHtml = /<\/?[a-z][\s\S]*>/i.test(trimmed);
  if (!hasHtml) {
    return trimmed
      .split(/\n\n+/)
      .map((p) => `<p>${p.trim().replace(/\n/g, "<br/>")}</p>`)
      .join("");
  }

  return sanitizeBlogHtml(trimmed);
}

/**
 * Resolves a blog image URL:
 * - If the URL is already absolute and matches the current backend, returns as is.
 * - If the URL is relative (e.g. "/media/..."), prepends the backend URL.
 * - If in local development and the URL points to Railway production,
 *   rewrites origin to active local backend URL so local development loads images properly.
 */
export function blogImageSrc(url: string | null | undefined): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (!trimmed) return "";

  // If already a data URI or blob URL, return as is
  if (trimmed.startsWith("data:") || trimmed.startsWith("blob:")) {
    return trimmed;
  }

  const currentBackend = backendUrl();

  // If relative path like "/media/file/..." or "/media/..."
  if (trimmed.startsWith("/")) {
    return `${currentBackend}${trimmed}`;
  }

  // If it points to Railway production backend while running locally against localhost:5001
  if (
    currentBackend.includes("localhost") ||
    currentBackend.includes("127.0.0.1")
  ) {
    if (trimmed.includes("newdatingappbackend-production.up.railway.app")) {
      try {
        const parsed = new URL(trimmed);
        return `${currentBackend}${parsed.pathname}${parsed.search}`;
      } catch {
        // ignore
      }
    }
  }

  return trimmed;
}



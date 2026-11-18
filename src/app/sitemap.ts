import type { MetadataRoute } from "next";
import { getPublicBlogs, type PublicBlogPost } from "@/lib/blogs";
import { absoluteUrl } from "@/lib/seo";

// Blog posts come from the backend, so build the sitemap per request rather than freezing it at build time.
export const dynamic = "force-dynamic";

/**
 * Indexable public pages. Keep in sync with the routes under src/app/(site).
 * Excluded on purpose: /admin/** (private, noindex), /api/** (internal), /safety (308 redirect to "/").
 * No lastmod for static pages: we have no reliable per-page modification date, and Google ignores guessed ones.
 */
const STATIC_PATHS = [
  "/",
  "/about",
  "/safety-tips",
  "/real-talk",
  "/kinder-together",
  "/report-problem",
  "/privacy",
  "/terms",
  "/cookies",
  "/child-safety",
  "/delete",
];

const PAGE_SIZE = 100;
const MAX_PAGES = 50; // hard stop: 5,000 posts, well under the 50,000-URL sitemap limit

async function getAllPublishedPosts(): Promise<PublicBlogPost[]> {
  const posts: PublicBlogPost[] = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const { items, pages } = await getPublicBlogs({ page, limit: PAGE_SIZE });
    posts.push(...items);
    if (page >= pages || items.length === 0) break;
  }
  return posts.filter((p) => p.slug && p.isPublished !== false);
}

function validDate(value: string | undefined): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPublishedPosts();
  const postEntries = posts.map((p) => ({
    url: absoluteUrl(`/blogs/${encodeURIComponent(p.slug)}`),
    lastModified: validDate(p.updatedAt) ?? validDate(p.createdAt),
  }));

  const postDates = postEntries.map((e) => e.lastModified?.getTime()).filter((t): t is number => typeof t === "number");
  const blogIndexLastMod = postDates.length ? new Date(Math.max(...postDates)) : undefined;

  const staticEntries = STATIC_PATHS.map((path) => ({ url: absoluteUrl(path) }));
  // The blog index carries the newest post's date as its lastmod (a reliable signal, unlike a guessed one).
  const blogIndex = { url: absoluteUrl("/blogs"), ...(blogIndexLastMod ? { lastModified: blogIndexLastMod } : {}) };

  const seen = new Set<string>();
  return [...staticEntries, blogIndex, ...postEntries].filter((e) => !seen.has(e.url) && !!seen.add(e.url));
}
let a = 1;
console.log(a);
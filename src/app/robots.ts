import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

/**
 * Public pages (and the CSS/JS/images they need under /_next and /brand etc.) stay crawlable.
 * Only the admin panel and internal API routes are blocked; the admin panel is also noindex + auth-gated.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}

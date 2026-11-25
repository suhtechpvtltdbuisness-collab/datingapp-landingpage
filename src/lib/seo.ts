import type { Metadata } from "next";
import { company, socialLinks } from "./company";
import { brand } from "@/app/(site)/safety/theme";

/**
 * Canonical origin of the public site: https, non-www, no trailing slash.
 * Defaults to the production domain in company.ts; set NEXT_PUBLIC_SITE_URL to override (e.g. a staging host).
 */
export const siteUrl: string = (process.env.NEXT_PUBLIC_SITE_URL || `https://${company.domain}`)
  .trim()
  .replace(/\/+$/, "");

/** Absolute URL for a site path. The homepage is the bare origin: Next.js emits that form for canonical/og:url, so everything matches. */
export function absoluteUrl(path = "/"): string {
  if (path === "/" || path === "") return siteUrl;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Default social-share image (square brand logo, 1254x1254). */
export const defaultOgImage = {
  url: absoluteUrl(brand.logo),
  width: 1254,
  height: 1254,
  alt: `${brand.name} logo`,
};

interface PageSeo {
  /** Full <title> text (already includes the brand where wanted). */
  title: string;
  description: string;
  /** Site-relative path, e.g. "/about". Used for the canonical URL and og:url. */
  path: string;
  /** Override the share image (absolute URL). */
  image?: { url: string; width?: number; height?: number; alt?: string };
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
}

/**
 * Per-page metadata. Next.js replaces (not deep-merges) openGraph/twitter objects set in a child,
 * so every page builds the complete set here to avoid missing og:url / og:image.
 */
export function pageMetadata({ title, description, path, image, type = "website", publishedTime, modifiedTime }: PageSeo): Metadata {
  const url = absoluteUrl(path);
  const img = image ?? defaultOgImage;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      type,
      siteName: brand.name,
      title,
      description,
      url,
      images: [img],
      ...(type === "article" ? { publishedTime, modifiedTime } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: [img.url],
    },
  };
}

/** JSON-LD for the Organization. Only includes details that are already shown publicly on the site. */
export function organizationJsonLd(opts?: { sameAs?: (string | null | undefined)[] }) {
  const sameAs = [socialLinks.instagram, socialLinks.facebook, socialLinks.youtube, socialLinks.x, ...(opts?.sameAs ?? [])].filter(
    (u, i, all): u is string => !!u && all.indexOf(u) === i,
  );
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: brand.name,
    legalName: company.legalName,
    url: absoluteUrl("/"),
    logo: absoluteUrl(brand.emblem),
    slogan: brand.tagline,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: company.supportEmail,
        telephone: company.supportPhone,
      },
    ],
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: brand.name,
    url: absoluteUrl("/"),
    inLanguage: "en",
    publisher: { "@id": `${siteUrl}/#organization` },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

/** Serialises JSON-LD for a <script> tag; "<" is escaped so content can never close the script element. */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

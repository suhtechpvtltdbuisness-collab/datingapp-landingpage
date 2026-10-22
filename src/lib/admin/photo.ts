/**
 * The backend sends `Cross-Origin-Resource-Policy: same-origin`, so browsers refuse to show its
 * images on a page from another origin. Photos are loaded through our own /admin/api/photo route,
 * which fetches them server-side; no src (or a failed fetch) gives a placeholder.
 */
export function photoSrc(url: string | null | undefined): string {
  return url ? `/admin/api/photo?src=${encodeURIComponent(url)}` : "/admin/api/photo";
}

import { backendUrl } from "@/lib/admin/api";
import { getSession } from "@/lib/admin/session";

const PLACEHOLDER = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#e5e7eb"/><circle cx="50" cy="38" r="18" fill="#9ca3af"/><path d="M14 100c0-22 16-36 36-36s36 14 36 36z" fill="#9ca3af"/></svg>`;
const MAX_BYTES = 10 * 1024 * 1024;

function placeholder(status = 200) {
  return new Response(PLACEHOLDER, {
    status,
    headers: { "Content-Type": "image/svg+xml", "Cache-Control": "private, max-age=60" },
  });
}

/** Streams a user photo from the backend so the browser sees it as same-origin. */
export async function GET(req: Request) {
  if (!(await getSession())) return new Response("Unauthorized", { status: 401 });

  const src = new URL(req.url).searchParams.get("src");
  if (!src) return placeholder();

  // Only the backend's own /media files, never an arbitrary URL (SSRF guard).
  let target: URL;
  try {
    target = new URL(src, `${backendUrl()}/`);
  } catch {
    return placeholder(400);
  }
  if (target.origin !== new URL(backendUrl()).origin || !target.pathname.startsWith("/media/")) {
    return placeholder(400);
  }

  try {
    const upstream = await fetch(target, { redirect: "error", cache: "no-store", signal: AbortSignal.timeout(15_000) });
    const type = upstream.headers.get("content-type") ?? "";
    const length = Number(upstream.headers.get("content-length") ?? 0);
    if (!upstream.ok || !upstream.body || !type.startsWith("image/") || length > MAX_BYTES) return placeholder();
    return new Response(upstream.body, {
      headers: {
        "Content-Type": type,
        "Cache-Control": "private, max-age=3600",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return placeholder();
  }
}

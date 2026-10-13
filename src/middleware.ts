import { NextResponse, type NextRequest } from "next/server";

/**
 * Admin guard. Signed-out visitors go to /admin/login?next=<path> (the full
 * signature check happens on the server in requireAdmin), and every admin
 * request carries its path so requireAdmin can build the same ?next= link.
 */
export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  // /admin/logout stays open: without it, signing out with no session would bounce through
  // login?next=/admin/logout and sign the admin straight back out after the next login.
  const open = pathname === "/admin/login" || pathname === "/admin/logout";
  if (!open && !req.cookies.has("admin_session")) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-admin-path", pathname + search);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = { matcher: ["/admin", "/admin/:path*"] };

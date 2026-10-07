import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROUTES, isProtectedRoute, isAuthRoute } from "./shared/lib/routes";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve session cookies.
  // Access tokens are kept in Redux memory only (never written to document.cookie)
  // to prevent XSS exfiltration. A lightweight boolean session indicator (tailr_session)
  // or backend HttpOnly refreshToken signals an active authenticated session.
  const sessionIndicator =
    request.cookies.get("tailr_session")?.value ||
    request.cookies.get("refreshToken")?.value ||
    request.cookies.get("tailr_access_token")?.value ||
    request.cookies.get("accessToken")?.value;
  const hasValidSession = Boolean(sessionIndicator && sessionIndicator.trim().length > 0);

  // 1. Unauthenticated visitor accessing a protected route -> redirect to /login
  if (isProtectedRoute(pathname) && !hasValidSession) {
    console.info(
      `[${new Date().toISOString()}] [INFO] [Middleware] Redirecting unauthenticated request: "${pathname}" -> "${ROUTES.LOGIN}"`
    );
    const loginUrl = new URL(ROUTES.LOGIN, request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Active session holder accessing /login or /signup -> redirect to /dashboard
  if (isAuthRoute(pathname) && hasValidSession) {
    console.info(
      `[${new Date().toISOString()}] [INFO] [Middleware] Redirecting authenticated request: "${pathname}" -> "${ROUTES.DASHBOARD}"`
    );
    return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url));
  }

  return NextResponse.next();
}

/**
 * Exclude static assets, Next.js internal files, favicon, etc.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - images, icons, and static assets (.png, .jpg, .svg, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROUTES, isProtectedRoute, isAuthRoute } from "./shared/lib/routes";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve the secure HttpOnly refresh token managed by the backend.
  // Access tokens are kept in Redux memory only (never written to document.cookie)
  // to prevent XSS exfiltration.
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const hasValidSession = Boolean(refreshToken && refreshToken.trim().length > 0);

  // 1. Unauthenticated visitor accessing a protected route -> redirect to /login
  if (isProtectedRoute(pathname) && !hasValidSession) {
    const loginUrl = new URL(ROUTES.LOGIN, request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Active session holder accessing /login or /signup -> redirect to /dashboard
  if (isAuthRoute(pathname) && hasValidSession) {
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

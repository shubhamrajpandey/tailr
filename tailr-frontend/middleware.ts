import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Route paths that require an active authentication session.
 */
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/applications",
  "/resume",
  "/resumes",
  "/analytics",
  "/settings",
  "/companies",
  "/cover-letter",
  "/docs",
];

/**
 * Public authentication routes where logged-in users should be redirected to dashboard.
 */
const AUTH_ROUTES = ["/login", "/signup"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve the secure HttpOnly refresh token managed by the backend.
  // Access tokens are kept in Redux memory only (never written to document.cookie)
  // to prevent XSS exfiltration.
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const hasValidSession = Boolean(refreshToken && refreshToken.trim().length > 0);

  const isProtectedRoute = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // 1. Unauthenticated visitor accessing a protected route -> redirect to /login
  if (isProtectedRoute && !hasValidSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Active session holder accessing /login or /signup -> redirect to /dashboard
  if (isAuthRoute && hasValidSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
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

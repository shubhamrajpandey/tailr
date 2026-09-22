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
  "/n8n",
];

/**
 * Public authentication routes where logged-in users should be redirected to dashboard.
 */
const AUTH_ROUTES = ["/login", "/signup"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve auth token from cookies (never from localStorage)
  const authToken =
    request.cookies.get("tailr_access_token")?.value ||
    request.cookies.get("accessToken")?.value ||
    request.cookies.get("refreshToken")?.value;

  const isAuthenticated = Boolean(authToken);

  const isProtectedRoute = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // 1. Unauthenticated user trying to access protected route -> Redirect to /login
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Authenticated user trying to access /login or /signup -> Redirect to /dashboard
  if (isAuthRoute && isAuthenticated) {
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

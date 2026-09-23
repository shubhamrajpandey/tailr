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

function isTokenValid(token?: string): boolean {
  if (!token) return false;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const json = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(json);
    if (!payload.exp) return true;
    // Expired if current time exceeds token expiry (with 10s leeway)
    return Date.now() < (payload.exp - 10) * 1000;
  } catch {
    return false;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve auth token from cookies
  const accessToken =
    request.cookies.get("tailr_access_token")?.value ||
    request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const hasValidAccessToken = isTokenValid(accessToken);
  const hasRefreshToken = Boolean(refreshToken);

  const isProtectedRoute = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // 1. Unauthenticated user on a protected route with NO tokens at all → hard redirect to /login
  //    If a refresh token exists, let the client-side AuthProvider handle the refresh flow.
  if (isProtectedRoute && !hasValidAccessToken && !hasRefreshToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Already authenticated (valid access token) user visiting /login or /signup → /dashboard
  if (isAuthRoute && hasValidAccessToken) {
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

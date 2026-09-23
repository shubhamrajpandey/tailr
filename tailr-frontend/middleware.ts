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

  // Retrieve auth token from cookies (never from localStorage)
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

  // 1. Root route "/" handling
  if (pathname === "/") {
    if (hasValidAccessToken) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    const loginUrl = new URL("/login", request.url);
    const response = NextResponse.redirect(loginUrl);
    if (!hasRefreshToken) {
      response.cookies.delete("tailr_access_token");
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");
    }
    return response;
  }

  // 2. Unauthenticated user trying to access protected route -> Redirect to /login & clear stale cookies
  // If a refresh token is present, allow access so client-side AuthProvider can attempt silent refresh.
  if (isProtectedRoute && !hasValidAccessToken && !hasRefreshToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("tailr_access_token");
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
  }

  // 3. Auth routes (/login, /signup)
  if (isAuthRoute) {
    // Only redirect to /dashboard if the user actually has a valid, active access token
    if (hasValidAccessToken) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // If visiting /login or /signup without a valid access token, allow access and
    // clear any stale/broken auth cookies to break any redirect or refresh loops
    const response = NextResponse.next();
    response.cookies.delete("tailr_access_token");
    response.cookies.delete("accessToken");
    response.cookies.delete("refreshToken");
    return response;
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

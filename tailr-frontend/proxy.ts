import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROUTES, isProtectedRoute } from "./shared/lib/routes";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve the client-managed session indicator cookie.
  // Access tokens are stored in Redux memory only (never written to document.cookie)
  // to prevent XSS exfiltration. The lightweight boolean cookie (tailr_session)
  const hasValidSession =
    request.cookies.get("tailr_session")?.value === "1" ||
    Boolean(request.cookies.get("accessToken")?.value) ||
    Boolean(request.cookies.get("tailr_access_token")?.value) ||
    Boolean(request.cookies.get("refreshToken")?.value);

  // 1. Edge protection for internal API routes
  if (pathname.startsWith("/api/")) {
    // Whitelist public endpoints: OAuth initiation/callback, public insights, health
    if (
      pathname.startsWith("/api/auth/") ||
      pathname === "/api/insights-fallback"
    ) {
      return NextResponse.next();
    }

    const authHeader = request.headers.get("authorization");
    if (!hasValidSession && !authHeader) {
      return NextResponse.json(
        { error: "Unauthorized. Authentication required to access API endpoint." },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  // 2. Unauthenticated visitor accessing a protected route -> redirect to /login
  if (isProtectedRoute(pathname) && !hasValidSession) {
    console.info(
      `[${new Date().toISOString()}] [INFO] [Proxy] Redirecting unauthenticated request: "${pathname}" -> "${ROUTES.LOGIN}"`
    );
    const loginUrl = new URL(ROUTES.LOGIN, request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Note: We deliberately do NOT redirect /login or /signup at the Edge Proxy layer.
  // Edge proxy cannot verify whether backend tokens are still valid or expired in the database.
  // Redirecting auth routes at the edge causes an infinite redirect loop if a session expires.
  // Legitimate authenticated users visiting /login are redirected cleanly by client-side auth state.

  return NextResponse.next();
}

// Backwards-compatibility alias
export const middleware = proxy;

/**
 * Exclude static assets, Next.js internal files, favicon, etc.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - images, icons, and static assets (.png, .jpg, .svg, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Next.js Route Handler: /api/auth/google
 *
 * Proxies the Google OAuth initiation request to the backend service.
 * Eliminates client-side hardcoded localhost/port mismatch when accessed
 * from mobile devices, LAN IP addresses, or custom environments.
 */
export async function GET(request: Request) {
  try {
    const backendUrl =
      process.env.INTERNAL_BACKEND_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      (process.env.NODE_ENV === "production" ? "https://api.tailr.ai" : "http://localhost:3001");

    const res = await fetch(`${backendUrl}/auth/google`, {
      method: "GET",
      redirect: "manual",
    });

    const location = res.headers.get("location");
    if (location) {
      return NextResponse.redirect(location);
    }

    return NextResponse.redirect(new URL("/login?error=google_auth_failed", request.url));
  } catch (err) {
    console.error("[/api/auth/google] Failed to initiate Google OAuth:", err);
    return NextResponse.redirect(new URL("/login?error=google_auth_failed", request.url));
  }
}

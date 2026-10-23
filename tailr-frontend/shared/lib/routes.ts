/**
 * Centralized Route Registry for Tailr Application.
 *
 * Single source of truth for all public, authentication, and protected dashboard routes.
 * Decouples routing configuration from components, layout shells, and middleware.
 */

export const ROUTES = {
  // Public Routes
  HOME: "/",
  SUPPORT: "/support",
  COMPANIES: "/companies",

  // Authentication Routes
  LOGIN: "/login",
  SIGNUP: "/signup",

  // Authenticated Dashboard Routes
  DASHBOARD: "/dashboard",
  APPLICATIONS: "/applications",
  NEW_APPLICATION: "/applications/new",
  APPLICATION_DETAIL: (id: string) => `/applications/${id}`,
  APPLICATION_EDIT: (id: string) => `/applications/${id}/edit`,

  RESUME: "/resume",
  RESUME_TAILOR: "/resume/tailor",
  RESUME_VERSIONS: "/resume/versions",
  RESUMES_LEGACY: "/resumes",

  COVER_LETTER: "/cover-letter",
  NEW_COVER_LETTER: "/cover-letter/new",
  COVER_LETTER_DETAIL: (id: string) => `/cover-letter/${id}`,

  ANALYTICS: "/analytics",
  SETTINGS: "/settings",
} as const;

/**
 * Routes restricted to unauthenticated guests (redirects active sessions to dashboard).
 */
export const AUTH_ROUTES: readonly string[] = [ROUTES.LOGIN, ROUTES.SIGNUP];

/**
 * Route prefixes requiring an active authentication session.
 */
export const PROTECTED_ROUTE_PREFIXES: readonly string[] = [
  ROUTES.DASHBOARD,
  ROUTES.APPLICATIONS,
  ROUTES.RESUME,
  ROUTES.RESUMES_LEGACY,
  ROUTES.ANALYTICS,
  ROUTES.SETTINGS,
  ROUTES.COVER_LETTER,
];

/**
 * Helper to determine whether a given pathname is a protected dashboard route.
 */
export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

/**
 * Helper to determine whether a given pathname is an auth route (login/signup).
 */
export function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

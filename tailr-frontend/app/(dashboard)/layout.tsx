import { ProtectedRoute } from "@/shared/components/layout/protected-route";
import type { ReactNode } from "react";

/**
 * Layout for all dashboard routes — protected behind authentication.
 *
 * ProtectedRoute reads isAuthenticated from Redux. On app boot it waits
 * for the silent /auth/refresh query (AuthProvider) to resolve before
 * deciding whether to render children or redirect to /login.
 */
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

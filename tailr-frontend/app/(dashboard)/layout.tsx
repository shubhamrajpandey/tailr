import { ProtectedRoute } from "@/shared/components/layout/protected-route";
import { Sidebar } from "@/shared/components/layout/sidebar";
import { TopBar } from "@/shared/components/layout/top-bar";
import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Precision job application pipeline, interview conversion metrics, and AI resume workspace.",
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * Layout for all dashboard routes — protected behind authentication.
 *
 * Persists the Sidebar and TopBar navigation shell across route transitions
 * so they mount once and don't flicker or re-initialize on page changes.
 */
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-background text-foreground font-sans selection:bg-indigo-500/30 selection:text-indigo-200 transition-colors">
        {/* Left Sidebar Navigation */}
        <div className="print:hidden">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-x-clip">
          {/* Fixed Top Navigation Bar */}
          <div className="print:hidden">
            <TopBar />
          </div>

          {children}
        </div>
      </div>
    </ProtectedRoute>
  );
}

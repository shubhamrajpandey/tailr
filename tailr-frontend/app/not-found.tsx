import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Home, Compass, HelpCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden select-none">
      {/* Background radial ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent blur-[120px] rounded-full"
      />

      {/* Header Brand */}
      <header className="relative z-10 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <Image
            src="/main_logo.png"
            alt="Tailr"
            width={32}
            height={32}
            className="w-8 h-8 object-contain"
          />
          <span className="font-extrabold text-lg tracking-tight text-neutral-950 dark:text-white">
            Tailr
          </span>
        </Link>
        <a
          href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@tailr.io"}`}
          className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors inline-flex items-center gap-1.5"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Need help?</span>
        </a>
      </header>

      {/* Main 404 Hero */}
      <main className="relative z-10 max-w-xl mx-auto text-center my-auto py-12 space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-500/20">
          <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "8s" }} />
          <span>ERROR 404 • ROUTE NOT FOUND</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-neutral-950 dark:text-white font-sans">
          Lost in Space?
        </h1>

        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
          The application route or resource you are trying to access does not exist, has been
          relocated, or requires authorization.
        </p>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button variant="primary" className="w-full sm:w-auto">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              <span>Go to Dashboard</span>
            </Button>
          </Link>
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto">
              <Home className="w-4 h-4 mr-1.5" />
              <span>Back to Home</span>
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer Meta */}
      <footer className="relative z-10 text-center text-xs text-neutral-500 dark:text-neutral-500">
        &copy; {new Date().getFullYear()} Tailr. Deterministic Career Operating System.
      </footer>
    </div>
  );
}

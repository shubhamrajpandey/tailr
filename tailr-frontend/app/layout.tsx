import type { Metadata } from "next";
import { Urbanist, Geist_Mono, Noto_Sans_Devanagari } from "next/font/google";
import { ThemeProvider } from "@/shared/components/providers/theme-provider";
import { ReduxProvider } from "@/shared/components/providers/redux-provider";
import { QueryProvider } from "@/shared/components/providers/query-provider";
import { AuthProvider } from "@/shared/components/providers/auth-provider";
import { I18nProvider } from "@/shared/i18n/i18n-provider";
import "./globals.css";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  variable: "--font-noto-nepali",
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tailr — AI Resume Tailoring & Job Application Tracker",
  description:
    "Zero-hallucination AI resume tailoring and precision job application tracker.",
  icons: {
    icon: [
      {
        url: "/tailr_bg_remove_logo.png",
        type: "image/png",
      },
    ],
    shortcut: "/tailr_bg_remove_logo.png",
    apple: "/tailr_bg_remove_logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${urbanist.variable} ${geistMono.variable} ${notoSansDevanagari.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col font-sans">
        <ReduxProvider>
          <QueryProvider>
            <AuthProvider>
              <I18nProvider>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="dark"
                  enableSystem
                  disableTransitionOnChange
                >
                  {children}
                </ThemeProvider>
              </I18nProvider>
            </AuthProvider>
          </QueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}

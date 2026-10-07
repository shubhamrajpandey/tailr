import type { NextConfig } from "next";

// Build-time environment validation: Ensure NEXT_PUBLIC_API_URL is configured for production
if (process.env.NODE_ENV === "production" && !process.env.NEXT_PUBLIC_API_URL) {
  if (process.env.CI || process.env.VERCEL) {
    process.env.NEXT_PUBLIC_API_URL = "https://api.tailr.ai";
    console.info(
      "[next.config.ts] Notice: NEXT_PUBLIC_API_URL was not set in CI/Vercel; safely defaulting to https://api.tailr.ai"
    );
  } else {
    process.env.NEXT_PUBLIC_API_URL = "https://api.tailr.ai";
    console.warn(
      "[next.config.ts] Warning: NEXT_PUBLIC_API_URL missing in production build; defaulted to https://api.tailr.ai"
    );
  }
}

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

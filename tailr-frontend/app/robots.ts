import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://app.tailr.ai";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/login", "/signup", "/docs", "/support"],
        disallow: [
          "/api/",
          "/dashboard",
          "/dashboard/",
          "/applications",
          "/applications/",
          "/resume",
          "/resume/",
          "/cover-letter",
          "/cover-letter/",
          "/companies",
          "/companies/",
          "/settings",
          "/settings/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

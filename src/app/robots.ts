import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/** Vercel sets VERCEL_ENV automatically ("production" | "preview" |
 *  "development") — anything other than production blocks crawling
 *  entirely, so preview deployments never get indexed as duplicate URLs
 *  alongside the real production domain. */
const isProduction = process.env.VERCEL_ENV === "production";

export default function robots(): MetadataRoute.Robots {
  if (!isProduction) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        // Route handlers only — no page content, and callback URLs carry
        // one-time auth codes that shouldn't be crawled.
        "/auth/",
        // Account/application pages — no search value, kept out via
        // `noindex` too so an already-crawled URL still gets dropped.
        "/dashboard",
        "/login",
        "/signup",
        "/forgot-password",
        "/reset-password",
        // Private edit-token links and personal recipient content (love
        // letters, personal messages, photos) — capability URLs that
        // shouldn't be fetched by crawlers at all, not just kept out of
        // search results. Each prefix leaves its own public index page
        // (/gifts, /templates) allowed, since only their nested paths
        // match.
        "/edit/",
        "/story/",
        "/templates/",
        "/gifts/",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

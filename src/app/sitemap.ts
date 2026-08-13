import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/** Only canonical, indexable marketing pages — no login/signup/dashboard,
 *  no edit-token links, and no per-user recipient pages (/story/[id],
 *  /gifts/*\/[id]), since those are personal content marked `noindex`
 *  rather than something search engines should discover and list. */
const PAGES: {
  path: string;
  priority: number;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
}[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/gifts", priority: 0.9, changeFrequency: "weekly" },
  { path: "/templates", priority: 0.9, changeFrequency: "weekly" },
  { path: "/gifts-for-friends", priority: 0.8, changeFrequency: "monthly" },
  { path: "/long-distance-gifts", priority: 0.8, changeFrequency: "monthly" },
  { path: "/digital-birthday-gifts", priority: 0.8, changeFrequency: "monthly" },
  { path: "/create", priority: 0.8, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return PAGES.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}

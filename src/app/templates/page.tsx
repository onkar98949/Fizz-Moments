import type { Metadata } from "next";
import { Navbar } from "@/components/shared/navbar";
import { getTemplateCatalog } from "@/database/queries/templates";
import { TemplatesGallery } from "@/features/templates/templates-gallery";
import { pageSeo } from "@/lib/seo";

export const metadata: Metadata = pageSeo({
  title: "Templates",
  description:
    "Beautiful, ready-made templates for love stories, birthdays, and anniversaries — or start from a blank canvas and design every photo, word, and animation yourself.",
  path: "/templates",
});

export default async function TemplatesPage() {
  const templates = await getTemplateCatalog();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <TemplatesGallery templates={templates} />
    </div>
  );
}

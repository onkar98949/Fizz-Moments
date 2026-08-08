import type { Metadata } from "next";
import { Navbar } from "@/components/shared/navbar";
import { getTemplateCatalog } from "@/database/queries/templates";
import { TemplatesGallery } from "@/features/templates/templates-gallery";

export const metadata: Metadata = {
  title: "Templates — FizzMoments",
};

export default async function TemplatesPage() {
  const templates = await getTemplateCatalog();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <TemplatesGallery templates={templates} />
    </div>
  );
}

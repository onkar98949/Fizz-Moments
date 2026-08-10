import type { Metadata } from "next";
import { Navbar } from "@/components/shared/navbar";
import { getStoryTemplateCatalog } from "@/database/queries/story-templates";
import { StoryTemplatePicker } from "@/features/story-templates/story-template-picker";
import { pageSeo } from "@/lib/seo";

export const metadata: Metadata = pageSeo({
  title: "Create a Surprise",
  description:
    "Turn your photos and memories into an animated story — start from a love story, birthday, or anniversary template, or build one scene at a time. Share it with one link.",
  path: "/create",
});

export default async function CreatePage() {
  const templates = await getStoryTemplateCatalog();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <StoryTemplatePicker templates={templates} />
    </div>
  );
}

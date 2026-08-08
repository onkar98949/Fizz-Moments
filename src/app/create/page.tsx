import type { Metadata } from "next";
import { Navbar } from "@/components/shared/navbar";
import { getStoryTemplateCatalog } from "@/database/queries/story-templates";
import { StoryTemplatePicker } from "@/features/story-templates/story-template-picker";

export const metadata: Metadata = {
  title: "Create a Surprise — FizzMoments",
};

export default async function CreatePage() {
  const templates = await getStoryTemplateCatalog();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <StoryTemplatePicker templates={templates} />
    </div>
  );
}

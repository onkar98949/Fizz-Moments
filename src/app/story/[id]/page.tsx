import type { Metadata } from "next";
import { getStoryById } from "@/database/queries/stories";
import { InvalidLink } from "@/components/shared/invalid-link";
import { RecipientStoryView } from "@/features/story-player/recipient-story-view";

type StoryPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const { id } = await params;
  const story = await getStoryById(id);

  if (!story) {
    return { title: "FizzMoments" };
  }

  return {
    title: `${story.title} — FizzMoments`,
    description: `A surprise for ${story.recipientName}.`,
  };
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { id } = await params;
  const story = await getStoryById(id);

  if (!story) {
    return (
      <InvalidLink
        title="This surprise couldn't be found"
        description="The link might be mistyped, or the story may no longer exist."
      />
    );
  }

  return <RecipientStoryView story={story} />;
}

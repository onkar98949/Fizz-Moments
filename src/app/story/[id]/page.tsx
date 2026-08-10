import type { Metadata } from "next";
import { getStoryById } from "@/database/queries/stories";
import { InvalidLink } from "@/components/shared/invalid-link";
import { RecipientStoryView } from "@/features/story-player/recipient-story-view";
import { NOINDEX_ROBOTS, pageSeo } from "@/lib/seo";

type StoryPageProps = {
  params: Promise<{ id: string }>;
};

/** A personal story made for one specific recipient — not indexable (see
 *  the SEO report's "Indexing safety" section), but still gets real
 *  Open Graph/Twitter tags so the share link previews nicely wherever
 *  it's actually sent. */
export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const { id } = await params;
  const story = await getStoryById(id);

  if (!story) {
    return { robots: NOINDEX_ROBOTS };
  }

  return pageSeo({
    title: story.title,
    description: `A personal surprise for ${story.recipientName}, made with FizzMoments.`,
    path: `/story/${id}`,
    noindex: true,
  });
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

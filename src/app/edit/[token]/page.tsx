import type { Metadata } from "next";
import { getStoryByEditToken } from "@/database/queries/stories";
import { claimOwnershipIfUnowned } from "@/database/queries/ownership";
import { getCurrentUserId } from "@/lib/supabase/server";
import { InvalidLink } from "@/components/shared/invalid-link";
import { StoryCanvas } from "@/features/story-canvas/story-canvas";
import { NOINDEX_ROBOTS } from "@/lib/seo";

type EditPageProps = {
  params: Promise<{ token: string }>;
};

export const metadata: Metadata = {
  title: "Story Canvas",
  robots: NOINDEX_ROBOTS,
};

export default async function EditPage({ params }: EditPageProps) {
  const { token } = await params;
  const [story, userId] = await Promise.all([getStoryByEditToken(token), getCurrentUserId()]);

  if (!story) {
    return (
      <InvalidLink
        title="This edit link has expired"
        description="We couldn't find a story for this link. It may have been mistyped."
      />
    );
  }

  if (userId && !story.userId) {
    await claimOwnershipIfUnowned("story", story.id, userId);
    story.userId = userId;
  }

  return <StoryCanvas story={story} isSignedIn={!!userId} />;
}

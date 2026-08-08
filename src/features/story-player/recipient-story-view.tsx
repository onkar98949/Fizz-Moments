"use client";

import { StoryPlayer } from "@/components/shared/story-player";
import { reactToStoryAction } from "@/actions/story-actions";
import type { ReactionType, StoryData } from "@/types/story";

export function RecipientStoryView({ story }: { story: StoryData }) {
  async function handleReact(reaction: ReactionType) {
    await reactToStoryAction({ storyId: story.id, reaction });
  }

  return (
    <div className="bg-secondary flex min-h-screen w-full items-center justify-center p-4 sm:p-8">
      <StoryPlayer story={story} onReact={handleReact} />
    </div>
  );
}

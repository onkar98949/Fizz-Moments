import type { Metadata } from "next";
import { getMemoryQuizByEditToken } from "@/database/queries/gifts";
import { claimOwnershipIfUnowned } from "@/database/queries/ownership";
import { getCurrentUserId } from "@/lib/supabase/server";
import { InvalidLink } from "@/components/shared/invalid-link";
import { MemoryQuizEditor } from "@/features/gifts/memory-quiz/memory-quiz-editor";

type EditPageProps = {
  params: Promise<{ token: string }>;
};

export const metadata: Metadata = {
  title: "Edit your quiz — FizzMoments",
};

export default async function MemoryQuizEditPage({ params }: EditPageProps) {
  const { token } = await params;
  const [quiz, userId] = await Promise.all([getMemoryQuizByEditToken(token), getCurrentUserId()]);

  if (!quiz) {
    return (
      <InvalidLink
        title="This edit link has expired"
        description="We couldn't find a quiz for this link. It may have been mistyped."
      />
    );
  }

  if (userId && !quiz.userId) {
    await claimOwnershipIfUnowned("memory-quiz", quiz.id, userId);
    quiz.userId = userId;
  }

  return <MemoryQuizEditor quiz={quiz} isSignedIn={!!userId} />;
}

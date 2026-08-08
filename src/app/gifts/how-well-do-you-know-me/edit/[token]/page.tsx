import type { Metadata } from "next";
import { getRelationshipQuizByEditToken } from "@/database/queries/gifts";
import { claimOwnershipIfUnowned } from "@/database/queries/ownership";
import { getCurrentUserId } from "@/lib/supabase/server";
import { InvalidLink } from "@/components/shared/invalid-link";
import { QuizEditor } from "@/features/gifts/quiz/quiz-editor";

type EditPageProps = {
  params: Promise<{ token: string }>;
};

export const metadata: Metadata = {
  title: "Edit your quiz — FizzMoments",
};

export default async function QuizEditPage({ params }: EditPageProps) {
  const { token } = await params;
  const [quiz, userId] = await Promise.all([getRelationshipQuizByEditToken(token), getCurrentUserId()]);

  if (!quiz) {
    return (
      <InvalidLink
        title="This edit link has expired"
        description="We couldn't find a quiz for this link. It may have been mistyped."
      />
    );
  }

  if (userId && !quiz.userId) {
    await claimOwnershipIfUnowned("how-well", quiz.id, userId);
    quiz.userId = userId;
  }

  return <QuizEditor quiz={quiz} isSignedIn={!!userId} />;
}

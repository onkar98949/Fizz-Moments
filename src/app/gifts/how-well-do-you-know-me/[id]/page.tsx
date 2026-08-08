import type { Metadata } from "next";
import { getRelationshipQuizById } from "@/database/queries/gifts";
import { InvalidLink } from "@/components/shared/invalid-link";
import { QuizPlayer } from "@/features/gifts/quiz/quiz-player";

type QuizPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: QuizPageProps): Promise<Metadata> {
  const { id } = await params;
  const quiz = await getRelationshipQuizById(id);
  return { title: quiz ? `${quiz.title} — FizzMoments` : "FizzMoments" };
}

export default async function QuizPage({ params }: QuizPageProps) {
  const { id } = await params;
  const quiz = await getRelationshipQuizById(id);

  if (!quiz) {
    return (
      <InvalidLink
        title="This quiz couldn't be found"
        description="The link might be mistyped, or the quiz may no longer exist."
      />
    );
  }

  return <QuizPlayer quiz={quiz} />;
}

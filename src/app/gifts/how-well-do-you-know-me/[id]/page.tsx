import type { Metadata } from "next";
import { getRelationshipQuizById } from "@/database/queries/gifts";
import { InvalidLink } from "@/components/shared/invalid-link";
import { QuizPlayer } from "@/features/gifts/quiz/quiz-player";
import { NOINDEX_ROBOTS, pageSeo } from "@/lib/seo";

type QuizPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: QuizPageProps): Promise<Metadata> {
  const { id } = await params;
  const quiz = await getRelationshipQuizById(id);

  if (!quiz) {
    return { robots: NOINDEX_ROBOTS };
  }

  return pageSeo({
    title: quiz.title,
    description: "A quiz to see how well they really know you.",
    path: `/gifts/how-well-do-you-know-me/${id}`,
    noindex: true,
  });
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

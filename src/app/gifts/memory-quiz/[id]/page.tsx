import type { Metadata } from "next";
import { getMemoryQuizById } from "@/database/queries/gifts";
import { InvalidLink } from "@/components/shared/invalid-link";
import { MemoryQuizPlayer } from "@/features/gifts/memory-quiz/memory-quiz-player";

type GiftPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: GiftPageProps): Promise<Metadata> {
  const { id } = await params;
  const quiz = await getMemoryQuizById(id);
  return { title: quiz ? `${quiz.title} — FizzMoments` : "FizzMoments" };
}

export default async function MemoryQuizGiftPage({ params }: GiftPageProps) {
  const { id } = await params;
  const quiz = await getMemoryQuizById(id);

  if (!quiz) {
    return (
      <InvalidLink
        title="This quiz couldn't be found"
        description="The link might be mistyped, or the quiz may no longer exist."
      />
    );
  }

  return <MemoryQuizPlayer quiz={quiz} />;
}

import type { Metadata } from "next";
import { getMemoryQuizById } from "@/database/queries/gifts";
import { InvalidLink } from "@/components/shared/invalid-link";
import { MemoryQuizPlayer } from "@/features/gifts/memory-quiz/memory-quiz-player";
import { NOINDEX_ROBOTS, pageSeo } from "@/lib/seo";

type GiftPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: GiftPageProps): Promise<Metadata> {
  const { id } = await params;
  const quiz = await getMemoryQuizById(id);

  if (!quiz) {
    return { robots: NOINDEX_ROBOTS };
  }

  return pageSeo({
    title: quiz.title,
    description: "A quiz about your story together.",
    path: `/gifts/memory-quiz/${id}`,
    noindex: true,
  });
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

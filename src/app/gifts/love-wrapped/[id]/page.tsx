import type { Metadata } from "next";
import { getLoveWrappedById } from "@/database/queries/gifts";
import { InvalidLink } from "@/components/shared/invalid-link";
import { LoveWrappedPlayer } from "@/features/gifts/love-wrapped/love-wrapped-player";

type WrappedPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: WrappedPageProps): Promise<Metadata> {
  const { id } = await params;
  const wrapped = await getLoveWrappedById(id);
  return { title: wrapped ? `${wrapped.title} — FizzMoments` : "FizzMoments" };
}

export default async function LoveWrappedPage({ params }: WrappedPageProps) {
  const { id } = await params;
  const wrapped = await getLoveWrappedById(id);

  if (!wrapped) {
    return (
      <InvalidLink
        title="This recap couldn't be found"
        description="The link might be mistyped, or the recap may no longer exist."
      />
    );
  }

  return <LoveWrappedPlayer wrapped={wrapped} />;
}

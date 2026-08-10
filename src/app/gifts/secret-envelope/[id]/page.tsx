import type { Metadata } from "next";
import { getSecretEnvelopeById } from "@/database/queries/gifts";
import { InvalidLink } from "@/components/shared/invalid-link";
import { SecretEnvelopePlayer } from "@/features/gifts/secret-envelope/secret-envelope-player";

type GiftPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: GiftPageProps): Promise<Metadata> {
  const { id } = await params;
  const envelope = await getSecretEnvelopeById(id);
  return { title: envelope ? `${envelope.title} — FizzMoments` : "FizzMoments" };
}

export default async function SecretEnvelopeGiftPage({ params }: GiftPageProps) {
  const { id } = await params;
  const envelope = await getSecretEnvelopeById(id);

  if (!envelope) {
    return (
      <InvalidLink
        title="This letter couldn't be found"
        description="The link might be mistyped, or the letter may no longer exist."
      />
    );
  }

  return <SecretEnvelopePlayer envelope={envelope} />;
}

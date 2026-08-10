import type { Metadata } from "next";
import { getSecretEnvelopeById } from "@/database/queries/gifts";
import { InvalidLink } from "@/components/shared/invalid-link";
import { SecretEnvelopePlayer } from "@/features/gifts/secret-envelope/secret-envelope-player";
import { NOINDEX_ROBOTS, pageSeo } from "@/lib/seo";

type GiftPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: GiftPageProps): Promise<Metadata> {
  const { id } = await params;
  const envelope = await getSecretEnvelopeById(id);

  if (!envelope) {
    return { robots: NOINDEX_ROBOTS };
  }

  return pageSeo({
    title: envelope.title,
    description: "A personal letter, sealed inside a digital envelope.",
    path: `/gifts/secret-envelope/${id}`,
    noindex: true,
  });
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

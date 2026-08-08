import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/shared/legal-page";

export const metadata: Metadata = {
  title: "Terms & Conditions — FizzMoments",
  description: "The terms that govern using FizzMoments to create and share stories and gifts.",
};

const CONTACT_EMAIL = "hello@fizzmoments.app";

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      lastUpdated="August 6, 2026"
      intro="By using FizzMoments, you agree to the terms below. We've kept them short on purpose — this is a small product, not a contract you need a lawyer to read."
    >
      <LegalSection title="Using FizzMoments">
        <p>
          FizzMoments lets you create stories, templates, and interactive gifts from your own photos and
          messages, and share them with a link. You can use it to make something for another person as long as
          it&apos;s for personal, non-commercial purposes, unless we&apos;ve agreed otherwise with you directly.
        </p>
      </LegalSection>

      <LegalSection title="Your content">
        <p>
          You own whatever you upload — your photos, your words, your ideas. By uploading content, you confirm
          you have the right to use it (for example, that a photo is yours to share) and you give us permission
          to store and display it back to you and to whoever you share your link with, solely so the product can
          work.
        </p>
        <p>
          You&apos;re responsible for what you upload and who you share your link with. Don&apos;t upload content that
          is illegal, infringes someone else&apos;s rights, or that you don&apos;t have permission to use.
        </p>
      </LegalSection>

      <LegalSection title="Sharing links responsibly">
        <p>
          Public links aren&apos;t password protected — anyone with the link can view the content. It&apos;s on you to
          share links only with the people you intend to see them, the same way you&apos;d be careful sharing a
          photo album or a private message.
        </p>
      </LegalSection>

      <LegalSection title="Acceptable use">
        <p>Please don&apos;t use FizzMoments to:</p>
        <ul>
          <li>Upload content that harasses, threatens, or targets another person without consent.</li>
          <li>Upload illegal content, or content that infringes someone else&apos;s intellectual property.</li>
          <li>Attempt to disrupt, overload, or gain unauthorized access to the service.</li>
        </ul>
        <p>We reserve the right to remove content or restrict access that violates these terms.</p>
      </LegalSection>

      <LegalSection title="The service, as-is">
        <p>
          FizzMoments is provided &quot;as is,&quot; without warranties of any kind. We do our best to keep things
          running and your content available, but we can&apos;t guarantee the service will be uninterrupted or
          error-free. To the extent permitted by law, we&apos;re not liable for indirect or consequential damages
          arising from your use of FizzMoments.
        </p>
      </LegalSection>

      <LegalSection title="Changes to the service or these terms">
        <p>
          We may update FizzMoments or these terms over time. If we make a meaningful change to these terms,
          we&apos;ll update the date at the top of this page. Continuing to use the service after a change means
          you accept the updated terms.
        </p>
      </LegalSection>

      <LegalSection title="Contact us">
        <p>
          Questions about these terms? Reach out at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}

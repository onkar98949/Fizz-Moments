import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/shared/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy — FizzMoments",
  description: "How FizzMoments collects, uses, and protects the content you create.",
};

const CONTACT_EMAIL = "hello@fizzmoments.app";

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      lastUpdated="August 6, 2026"
      intro="FizzMoments is built to hold something personal — a photo, a message, a memory. This page explains, plainly, what we collect and what we do with it."
    >
      <LegalSection title="What we collect">
        <p>We only collect what you choose to put into a story, template, or gift:</p>
        <ul>
          <li>Photos, text, dates, and other content you upload or type in.</li>
          <li>The design choices you make — layout, music selection, colors, and similar preferences.</li>
        </ul>
        <p>
          Creating a story, template, or gift doesn&apos;t require an account — we don&apos;t ask for your name,
          email, or phone number to make something, so we don&apos;t have any of that unless you send it to us
          directly or choose to sign in.
        </p>
      </LegalSection>

      <LegalSection title="Creating an account">
        <p>Signing in is optional. You can still create and share stories, templates, and gifts without it.</p>
        <p>If you create an account, we collect either:</p>
        <ul>
          <li>
            Your name, email address, and profile photo, shared with us by Google if you sign in that way — we
            never receive or ask for your Google password.
          </li>
          <li>The name, email address, and password you enter yourself, if you sign up directly.</li>
        </ul>
        <p>
          Passwords are stored securely by our authentication provider (Supabase) using standard hashing — we
          never see or store your password in plain text. None of this is used for marketing or shared with
          advertisers.
        </p>
      </LegalSection>

      <LegalSection title="How your content is stored and accessed">
        <p>
          Each story, template, or gift you create gets two links: a public link for the person you&apos;re
          sharing with, and a private edit link only you should have. Anyone who has the public link can view
          what you&apos;ve made — treat it like you would any shareable link, and only send it to the person it&apos;s
          meant for.
        </p>
        <p>
          Your content is stored on our hosting infrastructure (Supabase, for our database and file storage) in
          order to serve your story or gift when someone opens the link. We don&apos;t sell, rent, or share your
          content with advertisers.
        </p>
      </LegalSection>

      <LegalSection title="Cookies and tracking">
        <p>
          FizzMoments doesn&apos;t use advertising cookies or third-party trackers. We don&apos;t run analytics that
          profile individual visitors. Anything stored in your browser is there to make the app work — for
          example, remembering where you left off in an editor.
        </p>
      </LegalSection>

      <LegalSection title="How long we keep content">
        <p>
          We keep your stories and gifts for as long as the service is running, so the links you&apos;ve shared
          keep working. If you&apos;d like something you made removed, email us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> with the link in question and we&apos;ll take it
          down.
        </p>
      </LegalSection>

      <LegalSection title="Children's privacy">
        <p>
          FizzMoments is meant for general audiences and isn&apos;t directed at children under 13. We don&apos;t
          knowingly collect personal information from children. If you believe a child has shared personal
          information with us, contact us and we&apos;ll remove it.
        </p>
      </LegalSection>

      <LegalSection title="Changes to this policy">
        <p>
          If this policy changes in a meaningful way, we&apos;ll update the date at the top of this page. Continued
          use of FizzMoments after a change means you accept the updated policy.
        </p>
      </LegalSection>

      <LegalSection title="Contact us">
        <p>
          Questions about this policy or your content? Reach out at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </LegalSection>
    </LegalPage>
  );
}

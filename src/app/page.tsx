import type { Metadata } from "next";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { HeroSection } from "@/features/landing/hero-section";
import { ModesSection } from "@/features/landing/modes-section";
import { StoryShowcase } from "@/features/landing/story-showcase";
import { HowItWorks } from "@/features/landing/how-it-works";
import { FinalCta } from "@/features/landing/final-cta";
import { getStoryTemplateCatalog } from "@/database/queries/story-templates";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/seo";

const HOME_DESCRIPTION =
  "FizzMoments turns your memories into personalized digital experiences — interactive gifts, animated stories, and relationship games you create in minutes and share with one link.";

export const metadata: Metadata = {
  title: { absolute: "FizzMoments — Make Moments They'll Never Forget" },
  description: HOME_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: "FizzMoments — Make Moments They'll Never Forget",
    description: HOME_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [DEFAULT_OG_IMAGE],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FizzMoments — Make Moments They'll Never Forget",
    description: HOME_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
};

const WEB_APPLICATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE_NAME,
  url: SITE_URL,
  description: HOME_DESCRIPTION,
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any (web-based)",
};

export default async function Home() {
  const storyTemplates = await getStoryTemplateCatalog();

  return (
    <div className="flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(WEB_APPLICATION_JSON_LD) }}
      />
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <ModesSection />
        <StoryShowcase storyTemplates={storyTemplates} />
        <HowItWorks />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}

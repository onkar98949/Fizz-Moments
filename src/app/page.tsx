import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { HeroSection } from "@/features/landing/hero-section";
import { ModesSection } from "@/features/landing/modes-section";
import { StoryShowcase } from "@/features/landing/story-showcase";
import { HowItWorks } from "@/features/landing/how-it-works";
import { FinalCta } from "@/features/landing/final-cta";
import { getStoryTemplateCatalog } from "@/database/queries/story-templates";

export default async function Home() {
  const storyTemplates = await getStoryTemplateCatalog();

  return (
    <div className="flex min-h-screen flex-col">
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

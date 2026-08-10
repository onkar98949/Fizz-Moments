import type { Metadata } from "next";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { GiftLibrary } from "@/features/gifts/gift-library";
import { pageSeo } from "@/lib/seo";

export const metadata: Metadata = pageSeo({
  title: "Romantic Interactive Gifts",
  description:
    "Interactive digital gifts to send someone you love — scratch cards, treasure hunts, memory quizzes, secret letters, and more. Personalize one and share it with a link in minutes.",
  path: "/gifts",
});

export default function GiftsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <GiftLibrary />
      </main>
      <Footer />
    </div>
  );
}

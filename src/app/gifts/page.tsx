import type { Metadata } from "next";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { GiftLibrary } from "@/features/gifts/gift-library";

export const metadata: Metadata = {
  title: "Romantic Interactive Gifts — FizzMoments",
};

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

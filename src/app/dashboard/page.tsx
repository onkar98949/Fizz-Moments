import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { getCurrentUserId } from "@/lib/supabase/server";
import { getUserCreations } from "@/database/queries/ownership";
import { DashboardGrid } from "@/features/dashboard/dashboard-grid";

export const metadata: Metadata = {
  title: "My Creations — FizzMoments",
  description: "Everything you've made with FizzMoments, in one place.",
};

export default async function DashboardPage() {
  const userId = await getCurrentUserId();
  if (!userId) {
    redirect("/login?next=/dashboard");
  }

  const items = await getUserCreations(userId);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-6 py-16 sm:px-10 sm:py-20">
          <div className="flex flex-col gap-3 pb-10">
            <span className="text-muted-foreground text-eyebrow font-medium uppercase">My Creations</span>
            <h1 className="font-display text-section text-balance">Everything you&apos;ve made.</h1>
          </div>

          <DashboardGrid items={items} />
        </section>
      </main>
      <Footer />
    </div>
  );
}

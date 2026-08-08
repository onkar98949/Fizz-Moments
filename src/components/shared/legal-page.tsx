import type { ReactNode } from "react";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";

type LegalPageProps = {
  title: string;
  lastUpdated: string;
  intro?: string;
  children: ReactNode;
};

/** Shared long-form article shell for /privacy and /terms — same chrome as
 *  the rest of the site, but a narrower reading column and quieter type
 *  scale suited to paragraphs instead of marketing copy. */
export function LegalPage({ title, lastUpdated, intro, children }: LegalPageProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <article className="mx-auto max-w-2xl px-6 py-20 sm:px-10 sm:py-28">
          <header className="flex flex-col gap-4 pb-14">
            <span className="text-muted-foreground text-eyebrow font-medium uppercase">Legal</span>
            <h1 className="font-display text-section text-balance">{title}</h1>
            <p className="text-muted-foreground text-meta">Last updated {lastUpdated}</p>
            {intro ? <p className="text-muted-foreground text-body-lg pt-2 text-balance">{intro}</p> : null}
          </header>

          <div className="[&>section+section]:border-border [&>section+section]:mt-10 [&>section+section]:border-t [&>section+section]:pt-10 flex flex-col">
            {children}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-display text-card-title">{title}</h2>
      <div className="text-muted-foreground text-body-lg flex flex-col gap-3 leading-relaxed [&_a]:text-primary-active [&_a]:underline [&_a]:underline-offset-2 [&_li]:ml-5 [&_li]:list-disc [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1.5">
        {children}
      </div>
    </section>
  );
}

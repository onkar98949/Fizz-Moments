export type FaqItem = { question: string; answer: string };

/** Visible Q&A + matching FAQPage structured data, generated from the same
 *  array — the schema can never drift from what's actually on the page,
 *  since there's only one source of truth for the content. Only used
 *  where the questions are genuinely useful, not padding. */
export function FaqSection({ items }: { items: FaqItem[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <section className="mx-auto w-full max-w-2xl px-6 py-16 sm:px-10 sm:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h2 className="font-heading text-section mb-10 text-balance font-semibold">
        Questions people actually ask
      </h2>
      <div className="flex flex-col gap-7">
        {items.map((item) => (
          <div key={item.question} className="border-border border-b pb-7 last:border-0 last:pb-0">
            <h3 className="font-heading text-card-title mb-2 font-semibold">{item.question}</h3>
            <p className="text-muted-foreground text-body-lg leading-relaxed">{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

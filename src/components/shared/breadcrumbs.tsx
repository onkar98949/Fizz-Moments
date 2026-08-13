import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SITE_URL } from "@/lib/seo";

type Crumb = { label: string; href: string };

/** Visible breadcrumb trail + matching BreadcrumbList structured data —
 *  used only on pages that genuinely sit inside a real hierarchy (Home →
 *  Gifts → an occasion page), not sprinkled everywhere. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: `${SITE_URL}${item.href}`,
    })),
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-1.5 px-6 pt-6 text-sm sm:px-10"
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {items.map((item, index) => (
        <span key={item.href} className="flex items-center gap-1.5">
          {index > 0 ? <ChevronRight className="text-muted-foreground size-3.5" /> : null}
          {index === items.length - 1 ? (
            <span className="text-foreground font-medium" aria-current="page">
              {item.label}
            </span>
          ) : (
            <Link href={item.href} className="text-muted-foreground hover:text-foreground transition-colors">
              {item.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}

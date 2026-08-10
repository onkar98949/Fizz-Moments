import type { Metadata } from "next";

export const SITE_URL = "https://www.fizzmoments.com";
export const SITE_NAME = "FizzMoments";

/** Square brand mark — used as the fallback Open Graph / Twitter image
 *  wherever a page has no more specific image of its own. Not a proper
 *  1200×630 social card; see the SEO report for what to add. */
export const DEFAULT_OG_IMAGE = "/fizzMoments.png";

export const NOINDEX_ROBOTS: NonNullable<Metadata["robots"]> = {
  index: false,
  follow: false,
};

type PageSeoInput = {
  /** Wrapped by the root layout's "%s — FizzMoments" title template. */
  title: string;
  description: string;
  /** Site-relative path, e.g. "/gifts" — used for the canonical URL and
   *  the absolute Open Graph URL. */
  path: string;
  noindex?: boolean;
  image?: string;
};

/** Builds one page's title/description/canonical/Open Graph/Twitter
 *  metadata from a single set of inputs, so every page gets a real,
 *  page-specific social preview instead of silently inheriting the root
 *  layout's — Next.js metadata doesn't deep-merge the `openGraph` object
 *  across segments, so each page needs to state its own. The canonical
 *  also guards against `/path` vs `/path/` being indexed as two separate
 *  URLs, which `skipTrailingSlashRedirect` in next.config.ts otherwise
 *  allows to happen. */
export function pageSeo({ title, description, path, noindex, image = DEFAULT_OG_IMAGE }: PageSeoInput): Metadata {
  const socialTitle = `${title} — ${SITE_NAME}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    ...(noindex ? { robots: NOINDEX_ROBOTS } : null),
    openGraph: {
      title: socialTitle,
      description,
      url: `${SITE_URL}${path}`,
      siteName: SITE_NAME,
      images: [image],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [image],
    },
  };
}

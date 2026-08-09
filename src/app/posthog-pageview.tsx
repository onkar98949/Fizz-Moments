"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { usePostHog } from "posthog-js/react";

/** Fires a $pageview on every client-side route change. Must be rendered
 *  inside a <Suspense> boundary — useSearchParams() requires it in the App
 *  Router, since it otherwise forces the whole route to bail out of static
 *  rendering. */
export function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();

  useEffect(() => {
    if (!pathname || !posthog) return;

    let url = `${window.location.origin}${pathname}`;
    const query = searchParams.toString();
    if (query) url += `?${query}`;

    posthog.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams, posthog]);

  return null;
}

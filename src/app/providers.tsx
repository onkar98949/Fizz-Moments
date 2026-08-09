"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

// Only initializes once, and only when a real project key is configured —
// without one, analytics is silently inert rather than erroring, so this
// stays safe to ship even before PostHog is actually set up.
if (typeof window !== "undefined" && POSTHOG_KEY && !posthog.__loaded) {
  posthog.init(POSTHOG_KEY, {
    api_host: "/ingest",
    ui_host: POSTHOG_HOST.replace(/\.i\.posthog\.com/, ".posthog.com"),
    // Pageviews are captured explicitly by <PostHogPageView>, since the
    // App Router navigates client-side and a route change is never a
    // fresh page load that autocapture would otherwise catch.
    capture_pageview: false,
    // Anonymous browsing (the default way to use this app) doesn't build
    // a persistent person profile — one is only created once someone
    // signs in and gets identified. Matches the "no profiling casual
    // visitors" stance in the Privacy Policy.
    person_profiles: "identified_only",
  });
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return <PHProvider client={posthog}>{children}</PHProvider>;
}

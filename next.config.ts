import type { NextConfig } from "next";

// PostHog ingest host, derived from the same env var the client uses —
// swapping "us" for "eu" in NEXT_PUBLIC_POSTHOG_HOST updates both sides.
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";
const posthogAssetHost = posthogHost.replace(".i.posthog.com", "-assets.i.posthog.com");

const nextConfig: NextConfig = {
  // Proxies PostHog's ingestion through this app's own domain (as /ingest)
  // instead of calling posthog.com directly — ad-blockers that block
  // known analytics domains by name don't touch first-party paths.
  async rewrites() {
    return [
      { source: "/ingest/static/:path*", destination: `${posthogAssetHost}/static/:path*` },
      { source: "/ingest/decide", destination: `${posthogHost}/decide` },
      { source: "/ingest/:path*", destination: `${posthogHost}/:path*` },
    ];
  },
  skipTrailingSlashRedirect: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      // Matches the 10MB per-photo limit enforced in actions/photo-actions.ts.
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;

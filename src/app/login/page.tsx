import type { Metadata } from "next";
import { AuthCard } from "@/features/auth/auth-card";
import { NOINDEX_ROBOTS } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to FizzMoments with Google.",
  robots: NOINDEX_ROBOTS,
};

type LoginPageProps = {
  searchParams: Promise<{ next?: string; error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next, error } = await searchParams;
  return <AuthCard mode="login" next={next} error={error} />;
}

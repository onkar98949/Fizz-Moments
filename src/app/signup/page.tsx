import type { Metadata } from "next";
import { AuthCard } from "@/features/auth/auth-card";
import { NOINDEX_ROBOTS } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create a FizzMoments account with Google.",
  robots: NOINDEX_ROBOTS,
};

type SignupPageProps = {
  searchParams: Promise<{ next?: string; error?: string }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const { next, error } = await searchParams;
  return <AuthCard mode="signup" next={next} error={error} />;
}

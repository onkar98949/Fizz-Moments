import type { Metadata } from "next";
import { AuthCard } from "@/features/auth/auth-card";

export const metadata: Metadata = {
  title: "Sign up — FizzMoments",
  description: "Create a FizzMoments account with Google.",
};

type SignupPageProps = {
  searchParams: Promise<{ next?: string; error?: string }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const { next, error } = await searchParams;
  return <AuthCard mode="signup" next={next} error={error} />;
}

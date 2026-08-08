import type { Metadata } from "next";
import { AuthCard } from "@/features/auth/auth-card";

export const metadata: Metadata = {
  title: "Log in — FizzMoments",
  description: "Log in to FizzMoments with Google.",
};

type LoginPageProps = {
  searchParams: Promise<{ next?: string; error?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next, error } = await searchParams;
  return <AuthCard mode="login" next={next} error={error} />;
}

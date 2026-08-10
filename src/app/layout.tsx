import type { Metadata } from "next";
import { Suspense } from "react";
import Script from "next/script";
import { Alex_Brush, Fraunces, Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { PostHogProvider } from "./providers";
import { PostHogPageView } from "./posthog-pageview";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-DWW1H0Q93H";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const alexBrush = Alex_Brush({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "FizzMoments — Create a beautiful digital surprise",
  description:
    "Turn your favorite memories into a beautiful animated surprise. No editing. Just tell your story.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} ${alexBrush.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        <PostHogProvider>
          <Suspense fallback={null}>
            <PostHogPageView />
          </Suspense>
          {children}
          <Toaster position="top-center" richColors />
        </PostHogProvider>
      </body>
    </html>
  );
}

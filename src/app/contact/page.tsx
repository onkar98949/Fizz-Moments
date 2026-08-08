import type { Metadata } from "next";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { ContactForm } from "@/features/contact/contact-form";

export const metadata: Metadata = {
  title: "Contact — FizzMoments",
  description: "Send FizzMoments your feedback, ideas, or improvements.",
};

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="mx-auto max-w-2xl px-6 py-20 sm:px-10 sm:py-28">
          <div className="flex flex-col gap-4 pb-12">
            <span className="text-muted-foreground text-eyebrow font-medium uppercase">Get in touch</span>
            <h1 className="font-display text-section text-balance">We&apos;d love to hear from you.</h1>
            <p className="text-muted-foreground text-body-lg text-balance">
              Found a bug, have an idea for a new scene or gift, or just want to tell us what worked and what
              didn&apos;t? This goes straight to the people building FizzMoments.
            </p>
          </div>

          <ContactForm />
        </section>
      </main>
      <Footer />
    </div>
  );
}

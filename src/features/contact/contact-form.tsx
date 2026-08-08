"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { Bug, Lightbulb, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { submitFeedbackAction } from "@/actions/feedback-actions";
import type { z } from "zod";
import type { feedbackCategorySchema } from "@/schemas/feedback";

type Category = z.infer<typeof feedbackCategorySchema>;

const CATEGORIES: { value: Category; label: string; icon: typeof MessageCircle }[] = [
  { value: "FEEDBACK", label: "General feedback", icon: MessageCircle },
  { value: "IDEA", label: "Feature idea", icon: Lightbulb },
  { value: "IMPROVEMENT", label: "Improvement", icon: Sparkles },
  { value: "BUG", label: "Something's broken", icon: Bug },
];

const EASE = [0.16, 1, 0.3, 1] as const;

export function ContactForm() {
  const [category, setCategory] = useState<Category>("FEEDBACK");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    const result = await submitFeedbackAction({ category, email, message });

    setSubmitting(false);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    setSent(true);
  }

  return (
    <AnimatePresence mode="wait">
      {sent ? (
        <motion.div
          key="sent"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="border-border bg-card flex flex-col items-start gap-3 rounded-2xl border p-8"
        >
          <span className="border-border bg-background flex size-12 items-center justify-center rounded-full border">
            <Sparkles className="text-primary-active size-5" strokeWidth={1.5} />
          </span>
          <p className="font-display text-card-title">Thanks — we got it.</p>
          <p className="text-muted-foreground text-body-lg">
            Every message gets read. If you left an email and it needs a reply, we&apos;ll be in touch.
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-2"
            onClick={() => {
              setSent(false);
              setMessage("");
              setEmail("");
              setCategory("FEEDBACK");
            }}
          >
            Send another
          </Button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.4, ease: EASE }}
          onSubmit={handleSubmit}
          className="flex flex-col gap-7"
        >
          <div className="flex flex-col gap-3">
            <Label>What&apos;s this about?</Label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(({ value, label, icon: Icon }) => {
                const active = category === value;
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setCategory(value)}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200",
                      active
                        ? "border-primary/40 bg-accent text-primary-active"
                        : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/20",
                    )}
                  >
                    <Icon className="size-3.5" strokeWidth={1.75} />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="contact-message">Your message</Label>
            <Textarea
              id="contact-message"
              required
              minLength={10}
              maxLength={2000}
              placeholder="What's on your mind? The more specific, the more useful it is to us."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-40"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="contact-email">Email (optional)</Label>
            <Input
              id="contact-email"
              type="email"
              placeholder="you@example.com — only if you'd like a reply"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Button type="submit" size="lg" disabled={submitting} className="self-start">
            {submitting ? "Sending…" : "Send message"}
          </Button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

"use client";

import { Sparkles } from "lucide-react";
import { EnvelopeReveal } from "./envelope-reveal";
import type { SecretEnvelopeData } from "@/types/gifts";

export function SecretEnvelopePlayer({ envelope }: { envelope: SecretEnvelopeData }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-5 py-16">
      <EnvelopeReveal
        style={envelope.style}
        recipientName={envelope.recipientName}
        letterTitle={envelope.letterTitle}
        message={envelope.message}
        senderName={envelope.senderName}
        photoUrl={envelope.photoUrl}
      />

      <p className="text-muted-foreground flex items-center gap-1.5 text-meta">
        <Sparkles className="size-3.5" />
        Made with FizzMoments
      </p>
    </div>
  );
}

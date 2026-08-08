"use server";

import { createFeedback } from "@/database/queries/feedback";
import { submitFeedbackSchema } from "@/schemas/feedback";

export type SubmitFeedbackResult = { success: true } | { success: false; error: string };

export async function submitFeedbackAction(input: unknown): Promise<SubmitFeedbackResult> {
  const parsed = submitFeedbackSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Something in that form isn't right." };
  }

  try {
    await createFeedback(parsed.data);
    return { success: true };
  } catch {
    return { success: false, error: "That didn't go through. Please try again in a moment." };
  }
}

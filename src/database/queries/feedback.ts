import "server-only";
import { prisma } from "@/database/client";
import type { SubmitFeedbackInput } from "@/schemas/feedback";

export async function createFeedback(input: SubmitFeedbackInput) {
  await prisma.feedback.create({
    data: {
      category: input.category,
      message: input.message,
      email: input.email || null,
    },
  });
}

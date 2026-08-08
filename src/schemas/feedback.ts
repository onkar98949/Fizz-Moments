import { z } from "zod";

export const feedbackCategorySchema = z.enum(["FEEDBACK", "IDEA", "IMPROVEMENT", "BUG"]);

export const submitFeedbackSchema = z.object({
  category: feedbackCategorySchema,
  message: z.string().trim().min(10, "Tell us a little more — at least 10 characters.").max(2000),
  email: z.union([z.string().trim().email("That doesn't look like a valid email."), z.literal("")]),
});

export type SubmitFeedbackInput = z.infer<typeof submitFeedbackSchema>;

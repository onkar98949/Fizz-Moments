import { z } from "zod";

export const emailSchema = z.string().trim().min(1, "Enter your email.").email("That doesn't look like a valid email.");

// Length over arbitrary complexity rules — matches current NIST guidance
// and doesn't punish password managers for using long random strings.
export const passwordSchema = z.string().min(8, "Use at least 8 characters.").max(128, "That password is too long.");

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Enter your password."),
});

export const signUpSchema = z.object({
  name: z.string().trim().min(1, "Enter your name.").max(80, "That name is too long."),
  email: emailSchema,
  password: passwordSchema,
});

export const requestPasswordResetSchema = z.object({
  email: emailSchema,
});

export const updatePasswordSchema = z.object({
  password: passwordSchema,
});

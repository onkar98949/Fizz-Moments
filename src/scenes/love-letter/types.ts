import { z } from "zod";

export const letterStyleSchema = z.enum(["classic", "luxury", "vintage", "minimal"]);
export type LetterStyle = z.infer<typeof letterStyleSchema>;

export const loveLetterDataSchema = z.object({
  recipientName: z.string().trim().min(1, "Who is this for?").max(60),
  message: z.string().trim().min(1, "Write your letter.").max(240),
  signature: z.string().trim().min(1, "Sign it.").max(40),
  photoUrl: z.string().url({ message: "Add a photo for this scene." }),
  /** Lives in `data`, not the registry's `variant` field — the shared
   *  SceneBuilderProps contract only lets a builder change `data`, and this
   *  needs to be a normal user-facing form field. `renderer.tsx` reads this
   *  to pick the treatment, the same role `variant` plays elsewhere. */
  letterStyle: letterStyleSchema.optional().default("classic"),
});

export type LoveLetterData = z.infer<typeof loveLetterDataSchema>;

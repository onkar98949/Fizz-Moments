import { z } from "zod";
import { chatMessageSchema, wallpaperSchema } from "../text-conversation/config";
import type { SceneConfig } from "../types";

/** Same shape as Text Conversation's data (structurally — so its Builder
 *  and Renderer can be reused here without casting), just a different
 *  message-count range and Love Story framing. */
export const firstConversationDataSchema = z.object({
  senderName: z.string().trim().min(1, "Who's sending these?").max(40),
  receiverName: z.string().trim().min(1, "Who's receiving these?").max(40),
  messages: z.array(chatMessageSchema).min(6, "Add at least 6 messages.").max(10, "Add at most 10 messages."),
  finalImageUrl: z.string().url({ message: "Add a final photo to reveal." }),
  wallpaper: wallpaperSchema.optional().default("love"),
});

export type FirstConversationData = z.infer<typeof firstConversationDataSchema>;

export const firstConversationInstanceSchema = z.object({
  id: z.string().min(1),
  scene: z.literal("first-conversation"),
  variant: z.string().min(1),
  data: firstConversationDataSchema,
});

const MS_PER_MESSAGE = 1500;
const FINAL_IMAGE_MS = 2800;

export const firstConversationConfig: SceneConfig<FirstConversationData> = {
  id: "first-conversation",
  label: "First Conversation",
  description: "The very first messages you exchanged, recreated as a typing chat thread.",
  category: "love-story",
  tags: ["love story", "first conversation", "chat", "text", "message", "typing"],
  emoji: "💬",
  variants: [{ id: "bubbles", label: "Bubbles" }],
  defaultVariant: "bubbles",
  dataSchema: firstConversationDataSchema,
  defaultData: () => ({ senderName: "", receiverName: "", messages: [], finalImageUrl: "", wallpaper: "love" }),
  previewData: () => ({
    senderName: "Alex",
    receiverName: "You",
    messages: [
      { id: "m1", from: "sender", text: "hey! this is going to sound random" },
      { id: "m2", from: "receiver", text: "try me" },
      { id: "m3", from: "sender", text: "do you believe in fate?" },
      { id: "m4", from: "receiver", text: "depends who's asking" },
      { id: "m5", from: "sender", text: "someone who can't stop thinking about you" },
      { id: "m6", from: "receiver", text: "oh 👀" },
    ],
    finalImageUrl: "https://picsum.photos/seed/moment-preview-firstconvo/900/1400",
    wallpaper: "love",
  }),
  getDurationMs: (data) => Math.max(data.messages.length, 1) * MS_PER_MESSAGE + FINAL_IMAGE_MS,
};

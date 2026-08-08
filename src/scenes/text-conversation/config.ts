import { z } from "zod";
import { STORY_LIMITS } from "@/constants/story";
import type { SceneConfig } from "../types";

export const chatSenderSchema = z.enum(["sender", "receiver"]);

export const chatMessageSchema = z.object({
  id: z.string(),
  from: chatSenderSchema,
  text: z.string().trim().min(1).max(STORY_LIMITS.CAPTION_MAX_LENGTH),
});

export const wallpaperSchema = z.enum(["default", "love", "dreamy", "sky"]);

export const textConversationDataSchema = z.object({
  senderName: z.string().trim().min(1, "Who's sending these?").max(STORY_LIMITS.RECIPIENT_NAME_MAX_LENGTH),
  receiverName: z.string().trim().min(1, "Who's receiving these?").max(STORY_LIMITS.RECIPIENT_NAME_MAX_LENGTH),
  messages: z.array(chatMessageSchema).min(4, "Add at least 4 messages.").max(8, "Add at most 8 messages."),
  finalImageUrl: z.string().url({ message: "Add a final photo to reveal." }),
  wallpaper: wallpaperSchema.optional().default("default"),
});

export type ChatSender = z.infer<typeof chatSenderSchema>;
export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type Wallpaper = z.infer<typeof wallpaperSchema>;
export type TextConversationData = z.infer<typeof textConversationDataSchema>;

export const textConversationInstanceSchema = z.object({
  id: z.string().min(1),
  scene: z.literal("text-conversation"),
  variant: z.string().min(1),
  data: textConversationDataSchema,
});

const MS_PER_MESSAGE = 1500;
const FINAL_IMAGE_MS = 2800;

export const textConversationConfig: SceneConfig<TextConversationData> = {
  id: "text-conversation",
  label: "Text Conversation",
  description: "A modern chat thread that types itself out, ending on a photo reveal.",
  category: "emotional",
  tags: ["chat", "text", "message", "imessage", "whatsapp", "conversation", "typing", "sms", "texting"],
  emoji: "💬",
  variants: [{ id: "bubbles", label: "Bubbles" }],
  defaultVariant: "bubbles",
  dataSchema: textConversationDataSchema,
  defaultData: () => ({ senderName: "", receiverName: "", messages: [], finalImageUrl: "", wallpaper: "default" }),
  previewData: () => ({
    senderName: "Sam",
    receiverName: "You",
    messages: [
      { id: "m1", from: "sender", text: "ok don't laugh but" },
      { id: "m2", from: "sender", text: "I made you something" },
      { id: "m3", from: "receiver", text: "omg what is it 👀" },
      { id: "m4", from: "sender", text: "just open it" },
    ],
    finalImageUrl: "https://picsum.photos/seed/moment-preview-chat/900/1400",
    wallpaper: "dreamy",
  }),
  getDurationMs: (data) => Math.max(data.messages.length, 1) * MS_PER_MESSAGE + FINAL_IMAGE_MS,
};

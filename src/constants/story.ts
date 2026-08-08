import type { ReactionType } from "@/types/story";

/** Also imported directly by the Templates feature — keep this exact
 *  export name/shape at this exact path even as the rest of this file
 *  is refactored around it. */
export const MUSIC_TRACKS: {
  value: string;
  label: string;
  mood: string;
  src: string;
}[] = [
  { value: "gentle-piano", label: "Gentle Piano", mood: "Tender & warm", src: "/audio/gentle-piano.mp3" },
  { value: "soft-strings", label: "Soft Strings", mood: "Cinematic", src: "/audio/soft-strings.mp3" },
  { value: "warm-acoustic", label: "Warm Acoustic", mood: "Cozy & light", src: "/audio/warm-acoustic.mp3" },
  { value: "dreamy-ambient", label: "Dreamy Ambient", mood: "Floaty & calm", src: "/audio/dreamy-ambient.mp3" },
  { value: "playful-keys", label: "Playful Keys", mood: "Joyful", src: "/audio/playful-keys.mp3" },
];

export const REACTIONS: { value: ReactionType; emoji: string; label: string }[] = [
  { value: "HEART", emoji: "❤️", label: "Love it" },
  { value: "TEARY_EYES", emoji: "🥹", label: "Made me cry" },
  { value: "SMILE", emoji: "😊", label: "So sweet" },
];

export const STORY_LIMITS = {
  MESSAGE_MAX_LENGTH: 600,
  RECIPIENT_NAME_MAX_LENGTH: 60,
  TITLE_MAX_LENGTH: 80,
  SUBTITLE_MAX_LENGTH: 120,
  CAPTION_MAX_LENGTH: 120,
} as const;

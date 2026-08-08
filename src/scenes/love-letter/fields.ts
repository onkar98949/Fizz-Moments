import type { LetterStyle } from "./types";

export const MESSAGE_MAX_LENGTH = 240;
export const SIGNATURE_MAX_LENGTH = 40;
export const RECIPIENT_MAX_LENGTH = 60;

/** Only "classic" has a real component today (see `renderer.tsx`'s
 *  STYLE_RENDERERS map). The other three are shown, disabled, in the
 *  builder so the picker itself documents where this is headed. */
export const LETTER_STYLE_OPTIONS: { value: LetterStyle; label: string; available: boolean }[] = [
  { value: "classic", label: "Classic", available: true },
  { value: "luxury", label: "Luxury", available: false },
  { value: "vintage", label: "Vintage", available: false },
  { value: "minimal", label: "Minimal", available: false },
];

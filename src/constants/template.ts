import type { TemplateCategory } from "@/types/template";

export const TEMPLATE_CATEGORIES: { value: TemplateCategory; label: string; emoji: string }[] = [
  { value: "LOVE", label: "Love", emoji: "💕" },
  { value: "BIRTHDAY", label: "Birthday", emoji: "🎂" },
  { value: "ANNIVERSARY", label: "Anniversary", emoji: "🥂" },
  { value: "MINIMAL", label: "Minimal", emoji: "🤍" },
  { value: "SCRAPBOOK", label: "Scrapbook", emoji: "📸" },
];

/** Canvas is a fixed 9:16 surface; every element's x/y/width/height is a
 *  percentage of this, so the editor and the read-only player always agree. */
export const CANVAS_ASPECT_RATIO = 9 / 16;

/** Text `fontSize` values in Scene data are authored in px at this reference
 *  canvas width, then rendered with container query units so text scales
 *  correctly whether the canvas is 300px (phone) or 500px (desktop preview). */
export const REFERENCE_CANVAS_WIDTH = 400;

export const SCENE_LIMITS = {
  MIN_SCENES: 1,
  MAX_SCENES: 12,
  MIN_DURATION_MS: 1000,
  MAX_DURATION_MS: 15000,
  DEFAULT_DURATION_MS: 4000,
  MAX_ELEMENTS_PER_SCENE: 20,
  PROJECT_TITLE_MAX_LENGTH: 80,
} as const;

export const BACKGROUND_SWATCHES: { label: string; type: "color" | "gradient"; value: string }[] = [
  { label: "Cream", type: "color", value: "#FAF9F6" },
  { label: "White", type: "color", value: "#FFFFFF" },
  { label: "Ink", type: "color", value: "#1B1B1F" },
  { label: "Light Green", type: "color", value: "#DDF7C8" },
  { label: "Coral", type: "color", value: "#FFB199" },
  { label: "Lavender", type: "color", value: "#D7C8FF" },
  { label: "Sky", type: "color", value: "#D6EFFF" },
  { label: "Warm Yellow", type: "color", value: "#FFE9A8" },
  { label: "Fresh Green", type: "gradient", value: "linear-gradient(135deg, #8CD94A 0%, #B7F36A 100%)" },
  { label: "Love", type: "gradient", value: "linear-gradient(135deg, #FF8A65 0%, #FFB199 100%)" },
  { label: "Celebration", type: "gradient", value: "linear-gradient(135deg, #FFD166 0%, #FFE9A8 100%)" },
  { label: "Dreamy", type: "gradient", value: "linear-gradient(135deg, #B79CED 0%, #D7C8FF 100%)" },
];

export const TEXT_COLOR_SWATCHES: { label: string; value: string }[] = [
  { label: "Ink", value: "#1B1B1F" },
  { label: "White", value: "#FFFFFF" },
  { label: "Green", value: "#5EAD27" },
  { label: "Coral", value: "#FF8A65" },
  { label: "Lavender", value: "#B79CED" },
  { label: "Warm Yellow", value: "#E3A400" },
];

export const FONT_OPTIONS: { value: "display" | "body" | "script"; label: string }[] = [
  { value: "display", label: "Serif" },
  { value: "body", label: "Sans" },
  { value: "script", label: "Script" },
];

/** One click applies a whole look — background, text color, and font —
 *  across every scene, reusing the exact swatches/fonts already in this
 *  file so a theme never introduces an off-palette color. */
export const THEME_PRESETS: {
  id: string;
  label: string;
  swatch: string;
  background: { type: "color" | "gradient"; value: string };
  textColor: string;
  fontFamily: "display" | "body" | "script";
}[] = [
  {
    id: "romantic",
    label: "Romantic",
    swatch: "linear-gradient(135deg, #FF8A65 0%, #FFB199 100%)",
    background: { type: "gradient", value: "linear-gradient(135deg, #FF8A65 0%, #FFB199 100%)" },
    textColor: "#FFFFFF",
    fontFamily: "script",
  },
  {
    id: "minimal",
    label: "Minimal",
    swatch: "#FFFFFF",
    background: { type: "color", value: "#FFFFFF" },
    textColor: "#1B1B1F",
    fontFamily: "body",
  },
  {
    id: "vintage",
    label: "Vintage",
    swatch: "#FFE9A8",
    background: { type: "color", value: "#FFE9A8" },
    textColor: "#1B1B1F",
    fontFamily: "display",
  },
  {
    id: "luxury",
    label: "Luxury",
    swatch: "#1B1B1F",
    background: { type: "color", value: "#1B1B1F" },
    textColor: "#E3A400",
    fontFamily: "display",
  },
  {
    id: "dreamy",
    label: "Dreamy",
    swatch: "linear-gradient(135deg, #B79CED 0%, #D7C8FF 100%)",
    background: { type: "gradient", value: "linear-gradient(135deg, #B79CED 0%, #D7C8FF 100%)" },
    textColor: "#FFFFFF",
    fontFamily: "script",
  },
  {
    id: "dark",
    label: "Dark",
    swatch: "#1B1B1F",
    background: { type: "color", value: "#1B1B1F" },
    textColor: "#FFFFFF",
    fontFamily: "body",
  },
  {
    id: "pastel",
    label: "Pastel",
    swatch: "#D6EFFF",
    background: { type: "color", value: "#D6EFFF" },
    textColor: "#1B1B1F",
    fontFamily: "body",
  },
];

export const STICKERS: string[] = [
  "💐", "🌸", "🌹", "🎀", "✨", "💌", "💕", "🥂", "🎂", "🕯️", "🎈", "🍰",
  "📷", "🖤", "🤍", "💫", "🌙", "⭐️", "🧸", "🎉",
];

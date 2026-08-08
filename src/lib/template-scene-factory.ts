import { SCENE_LIMITS } from "@/constants/template";
import type { ImageElement, Scene, StickerElement, TextElement } from "@/types/template";

export function createElementId(): string {
  return crypto.randomUUID();
}

export function createTextElement(overrides: Partial<TextElement> = {}): TextElement {
  return {
    id: createElementId(),
    type: "text",
    content: "Your text here",
    fontFamily: "display",
    fontSize: 28,
    color: "#1B1B1F",
    align: "center",
    x: 15,
    y: 42,
    width: 70,
    height: 16,
    rotation: 0,
    ...overrides,
  };
}

export function createImageElement(src: string, overrides: Partial<ImageElement> = {}): ImageElement {
  return {
    id: createElementId(),
    type: "image",
    src,
    x: 15,
    y: 20,
    width: 70,
    height: 45,
    rotation: 0,
    ...overrides,
  };
}

export function createStickerElement(emoji: string, overrides: Partial<StickerElement> = {}): StickerElement {
  return {
    id: createElementId(),
    type: "sticker",
    emoji,
    x: 40,
    y: 40,
    width: 16,
    height: 16,
    rotation: 0,
    ...overrides,
  };
}

export function createBlankScene(): Scene {
  return {
    id: createElementId(),
    background: { type: "color", value: "#FAF9F6" },
    elements: [createTextElement({ content: "Your Title Here", fontSize: 36 })],
    durationMs: SCENE_LIMITS.DEFAULT_DURATION_MS,
  };
}

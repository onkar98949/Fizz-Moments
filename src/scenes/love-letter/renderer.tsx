"use client";

import type { ComponentType } from "react";
import { ClassicLoveLetter } from "./variants/classic";
import type { LetterStyle, LoveLetterData } from "./types";
import type { SceneRendererProps } from "../types";

/** One entry per `LetterStyle`. Only "classic" is a real treatment today —
 *  the other three fall back to it rather than 404-ing, and each becomes a
 *  one-line addition here once its own `variants/<style>.tsx` exists. */
const STYLE_RENDERERS: Record<LetterStyle, ComponentType<{ data: LoveLetterData }>> = {
  classic: ClassicLoveLetter,
  luxury: ClassicLoveLetter,
  vintage: ClassicLoveLetter,
  minimal: ClassicLoveLetter,
};

export function LoveLetterRenderer({ data }: SceneRendererProps<LoveLetterData>) {
  const Treatment = STYLE_RENDERERS[data.letterStyle ?? "classic"];
  return <Treatment data={data} />;
}

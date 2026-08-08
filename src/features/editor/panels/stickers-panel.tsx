"use client";

import { STICKERS } from "@/constants/template";
import type { TemplateEditor } from "../use-template-editor";

export function StickersPanel({ addStickerElement }: TemplateEditor) {
  return (
    <div className="grid grid-cols-6 gap-2">
      {STICKERS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={() => addStickerElement(emoji)}
          className="border-border hover:border-primary/40 hover:bg-accent/40 flex aspect-square items-center justify-center rounded-xl border text-2xl"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}

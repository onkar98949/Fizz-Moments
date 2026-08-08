"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextPanel } from "./text-panel";
import { StickersPanel } from "./stickers-panel";
import type { TemplateEditor } from "../use-template-editor";

function StickerEditPanel({ selectedElement, deleteElement }: TemplateEditor) {
  if (selectedElement?.type !== "sticker") return null;
  return (
    <div className="flex flex-col items-center gap-3 py-4">
      <span className="text-5xl">{selectedElement.emoji}</span>
      <p className="text-muted-foreground text-xs">Drag on the canvas to move, resize, or rotate it.</p>
      <Button type="button" variant="outline" onClick={() => deleteElement(selectedElement.id)} className="rounded-full">
        <Trash2 className="size-3.5" />
        Delete sticker
      </Button>
    </div>
  );
}

/** "Content" merges the old Text and Stickers tabs — selecting a text
 *  element shows text controls, selecting a sticker shows its controls;
 *  with nothing selected it offers both entry points at once, since adding
 *  either is the same kind of action from the user's point of view. */
export function ContentPanel(editor: TemplateEditor) {
  const selected = editor.selectedElement;

  if (selected?.type === "sticker") {
    return <StickerEditPanel {...editor} />;
  }

  return (
    <div className="flex flex-col gap-5">
      <TextPanel {...editor} />
      {!selected ? (
        <div className="border-border flex flex-col gap-1.5 border-t pt-4">
          <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Or add a sticker</span>
          <StickersPanel {...editor} />
        </div>
      ) : null}
    </div>
  );
}

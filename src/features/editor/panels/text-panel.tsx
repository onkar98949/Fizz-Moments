"use client";

import { AlignCenter, AlignLeft, AlignRight, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FONT_OPTIONS, TEXT_COLOR_SWATCHES } from "@/constants/template";
import { cn } from "@/lib/utils";
import type { TemplateEditor } from "../use-template-editor";

export function TextPanel({ selectedElement, updateElementProps, addTextElement, deleteElement }: TemplateEditor) {
  const textElement = selectedElement?.type === "text" ? selectedElement : null;

  if (!textElement) {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <p className="text-muted-foreground text-sm">Add a text box, or tap one on the canvas to edit it.</p>
        <Button onClick={addTextElement} className="rounded-full">
          <Plus className="size-4" />
          Add Text
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Textarea
        value={textElement.content}
        onChange={(e) => updateElementProps(textElement.id, { content: e.target.value })}
        rows={2}
        maxLength={400}
        placeholder="Your text"
      />

      <div className="flex flex-col gap-1.5">
        <span className="text-muted-foreground text-xs">Font</span>
        <div className="flex gap-2">
          {FONT_OPTIONS.map((font) => (
            <button
              key={font.value}
              type="button"
              onClick={() => updateElementProps(textElement.id, { fontFamily: font.value })}
              className={cn(
                "flex-1 rounded-xl border px-3 py-1.5 text-sm",
                textElement.fontFamily === font.value ? "border-primary bg-accent" : "border-border",
              )}
            >
              {font.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-muted-foreground text-xs">Size</span>
        <input
          type="range"
          min={12}
          max={72}
          value={textElement.fontSize}
          onChange={(e) => updateElementProps(textElement.id, { fontSize: Number(e.target.value) })}
          className="accent-primary w-full"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-muted-foreground text-xs">Color</span>
        <div className="flex flex-wrap gap-2">
          {TEXT_COLOR_SWATCHES.map((swatch) => (
            <button
              key={swatch.value}
              type="button"
              aria-label={swatch.label}
              onClick={() => updateElementProps(textElement.id, { color: swatch.value })}
              className={cn(
                "border-border size-7 rounded-full border-2",
                textElement.color === swatch.value && "ring-primary ring-2 ring-offset-2",
              )}
              style={{ backgroundColor: swatch.value }}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {(["left", "center", "right"] as const).map((align) => {
            const Icon = align === "left" ? AlignLeft : align === "center" ? AlignCenter : AlignRight;
            return (
              <button
                key={align}
                type="button"
                aria-label={align}
                onClick={() => updateElementProps(textElement.id, { align })}
                className={cn(
                  "flex size-8 items-center justify-center rounded-lg border",
                  textElement.align === align ? "border-primary bg-accent" : "border-border",
                )}
              >
                <Icon className="size-4" />
              </button>
            );
          })}
        </div>
        <Button variant="outline" size="sm" onClick={() => deleteElement(textElement.id)} className="rounded-full">
          <Trash2 className="size-3.5" />
          Delete
        </Button>
      </div>
    </div>
  );
}

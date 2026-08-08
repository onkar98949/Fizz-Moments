"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { COVER_EMOJI_OPTIONS, type CoverData } from "./config";
import type { SceneBuilderProps } from "../types";

export function CoverBuilder({ data, onChange }: SceneBuilderProps<CoverData>) {
  return (
    <div className="flex flex-col gap-3">
      <Label>Cover icon</Label>
      <div className="flex flex-wrap gap-2">
        {COVER_EMOJI_OPTIONS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => onChange({ ...data, emoji })}
            className={cn(
              "flex size-11 items-center justify-center rounded-2xl border-2 text-xl",
              data.emoji === emoji ? "border-primary bg-accent" : "border-border",
            )}
          >
            {emoji}
          </button>
        ))}
      </div>
      <p className="text-muted-foreground text-xs">
        The title, subtitle, and recipient name are edited in Story Details, above the scene list.
      </p>
    </div>
  );
}

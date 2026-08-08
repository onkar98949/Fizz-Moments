"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { uploadPhotoAction } from "@/actions/photo-actions";
import { BACKGROUND_SWATCHES, THEME_PRESETS } from "@/constants/template";
import { cn } from "@/lib/utils";
import type { TemplateEditor } from "../use-template-editor";

export function ThemePanel({ activeScene, setBackground, applyTheme }: TemplateEditor) {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(file: File) {
    setIsUploading(true);
    const formData = new FormData();
    formData.set("file", file);
    const result = await uploadPhotoAction(formData);
    setIsUploading(false);
    if (result.success) {
      setBackground({ type: "image", value: result.url });
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Theme presets</span>
        <p className="text-muted-foreground text-xs">Applies to every scene — colors, font, and background.</p>
        <div className="grid grid-cols-4 gap-2.5 pt-1">
          {THEME_PRESETS.map((theme) => (
            <button
              key={theme.id}
              type="button"
              onClick={() => applyTheme(theme)}
              className="flex flex-col items-center gap-1"
            >
              <span
                className="border-border size-11 rounded-full border-2 shadow-soft transition-transform hover:scale-105"
                style={theme.background.type === "gradient" ? { backgroundImage: theme.background.value } : { backgroundColor: theme.background.value }}
              />
              <span className="text-[10px]">{theme.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">This scene&apos;s background</span>
        <div className="grid grid-cols-6 gap-2 pt-1">
          {BACKGROUND_SWATCHES.map((swatch) => {
            const isActive = activeScene?.background.type === swatch.type && activeScene.background.value === swatch.value;
            return (
              <button
                key={swatch.label}
                type="button"
                aria-label={swatch.label}
                onClick={() => setBackground({ type: swatch.type, value: swatch.value })}
                className={cn("aspect-square rounded-xl border-2", isActive ? "border-primary" : "border-border")}
                style={swatch.type === "gradient" ? { backgroundImage: swatch.value } : { backgroundColor: swatch.value }}
              />
            );
          })}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="border-border hover:border-primary/40 mt-1 flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-3.5 text-sm disabled:opacity-60"
        >
          {isUploading ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
          Upload a photo background
        </button>
      </div>
    </div>
  );
}

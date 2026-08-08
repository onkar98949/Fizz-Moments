"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadPhotoAction } from "@/actions/photo-actions";
import { STORY_LIMITS } from "@/constants/story";
import { cn } from "@/lib/utils";
import { REEL_EMOJI_OPTIONS, type MemoryReelData } from "./config";
import type { SceneBuilderProps } from "../types";

export function MemoryReelBuilder({ data, onChange }: SceneBuilderProps<MemoryReelData>) {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setIsUploading(true);
    const formData = new FormData();
    formData.set("file", file);
    const result = await uploadPhotoAction(formData);
    setIsUploading(false);
    if (result.success) onChange({ ...data, photoUrl: result.url });
  }

  return (
    <div className="flex flex-col gap-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
      <div className="flex flex-col gap-1.5">
        <Label>Photo</Label>
        {data.photoUrl ? (
          <button type="button" onClick={() => inputRef.current?.click()} className="relative aspect-[9/14] w-full max-w-40 overflow-hidden rounded-2xl">
            <Image src={data.photoUrl} alt="" fill className="object-cover" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="border-border bg-secondary/40 hover:border-primary/50 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-8 disabled:opacity-60"
          >
            {isUploading ? <Loader2 className="size-5 animate-spin" /> : <ImagePlus className="size-5" />}
            <span className="text-sm font-medium">Add a photo</span>
          </button>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="reel-caption">Caption (optional)</Label>
        <Input
          id="reel-caption"
          maxLength={STORY_LIMITS.CAPTION_MAX_LENGTH}
          value={data.caption}
          onChange={(e) => onChange({ ...data, caption: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="reel-date">Date (optional)</Label>
        <Input id="reel-date" value={data.date} onChange={(e) => onChange({ ...data, date: e.target.value })} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Reaction</Label>
        <div className="flex gap-2">
          {REEL_EMOJI_OPTIONS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => onChange({ ...data, emoji })}
              className={cn(
                "flex size-10 items-center justify-center rounded-2xl border-2 text-lg",
                data.emoji === emoji ? "border-primary bg-accent" : "border-border",
              )}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

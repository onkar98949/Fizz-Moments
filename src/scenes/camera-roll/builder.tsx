"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, Star, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { uploadPhotoAction } from "@/actions/photo-actions";
import { STORY_LIMITS } from "@/constants/story";
import type { CameraRollData } from "./config";
import type { SceneBuilderProps } from "../types";

export function CameraRollBuilder({ data, onChange }: SceneBuilderProps<CameraRollData>) {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const atMax = data.photos.length >= 20;
  const favorites = data.photos.filter((p) => p.isFavorite);

  async function handleFiles(files: FileList) {
    const room = 20 - data.photos.length;
    const toUpload = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, room);
    if (toUpload.length === 0) return;

    setIsUploading(true);
    const uploaded = await Promise.all(
      toUpload.map(async (file) => {
        const formData = new FormData();
        formData.set("file", file);
        const result = await uploadPhotoAction(formData);
        return result.success ? { id: crypto.randomUUID(), photoUrl: result.url, caption: "", isFavorite: false } : null;
      }),
    );
    setIsUploading(false);

    const successes = uploaded.filter((p): p is NonNullable<typeof p> => p !== null);
    onChange({ photos: [...data.photos, ...successes] });
  }

  function toggleFavorite(id: string) {
    onChange({ photos: data.photos.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p)) });
  }

  function updateCaption(id: string, caption: string) {
    onChange({ photos: data.photos.map((p) => (p.id === id ? { ...p, caption } : p)) });
  }

  function removePhoto(id: string) {
    onChange({ photos: data.photos.filter((p) => p.id !== id) });
  }

  return (
    <div className="flex flex-col gap-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
      {!atMax ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="border-border bg-secondary/40 hover:border-primary/50 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-7 text-center disabled:opacity-60"
        >
          {isUploading ? <Loader2 className="size-5 animate-spin" /> : <ImagePlus className="size-5" />}
          <span className="text-sm font-medium">Add photos</span>
          <span className="text-muted-foreground text-xs">{data.photos.length}/20 added · 10-20 works best</span>
        </button>
      ) : null}

      {data.photos.length > 0 ? (
        <div className="flex flex-col gap-2">
          <Label>Tap the star on your favorites — those are the ones that get their moment</Label>
          <div className="grid grid-cols-4 gap-2">
            {data.photos.map((p) => (
              <div key={p.id} className="bg-secondary relative aspect-square overflow-hidden rounded-xl">
                <Image src={p.photoUrl} alt="" fill className="object-cover" />
                <button
                  type="button"
                  aria-label="Toggle favorite"
                  onClick={() => toggleFavorite(p.id)}
                  className={cn(
                    "absolute bottom-1 left-1 flex size-6 items-center justify-center rounded-full",
                    p.isFavorite ? "bg-primary text-primary-foreground" : "bg-white/85 text-foreground",
                  )}
                >
                  <Star className="size-3.5" fill={p.isFavorite ? "currentColor" : "none"} />
                </button>
                <button
                  type="button"
                  aria-label="Remove photo"
                  onClick={() => removePhoto(p.id)}
                  className="absolute top-1 right-1 flex size-6 items-center justify-center rounded-full bg-white/85"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {favorites.length > 0 ? (
        <div className="flex flex-col gap-2">
          <Label>Captions for your favorites (optional)</Label>
          {favorites.map((p) => (
            <div key={p.id} className="flex items-center gap-2">
              <div className="bg-secondary relative size-10 shrink-0 overflow-hidden rounded-lg">
                <Image src={p.photoUrl} alt="" fill className="object-cover" />
              </div>
              <Input
                placeholder="Caption (optional)"
                maxLength={STORY_LIMITS.CAPTION_MAX_LENGTH}
                value={p.caption}
                onChange={(e) => updateCaption(p.id, e.target.value)}
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

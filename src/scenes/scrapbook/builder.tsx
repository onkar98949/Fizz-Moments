"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { uploadPhotoAction } from "@/actions/photo-actions";
import { cn } from "@/lib/utils";
import { STICKER_OPTIONS, type ScrapbookData } from "./config";
import type { SceneBuilderProps } from "../types";

function randomRotation() {
  return Math.round((Math.random() * 16 - 8) * 10) / 10;
}

export function ScrapbookBuilder({ data, onChange }: SceneBuilderProps<ScrapbookData>) {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const atMax = data.photos.length >= 5;

  async function handleFiles(files: FileList) {
    const room = 5 - data.photos.length;
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
        return result.success ? { id: crypto.randomUUID(), photoUrl: result.url, rotation: randomRotation() } : null;
      }),
    );
    setIsUploading(false);

    const successes = uploaded.filter((p): p is NonNullable<typeof p> => p !== null);
    onChange({ ...data, photos: [...data.photos, ...successes] });
  }

  function removePhoto(id: string) {
    onChange({ ...data, photos: data.photos.filter((p) => p.id !== id) });
  }

  function toggleSticker(sticker: string) {
    const current = data.stickers ?? [];
    if (current.includes(sticker)) {
      onChange({ ...data, stickers: current.filter((s) => s !== sticker) });
    } else if (current.length < 4) {
      onChange({ ...data, stickers: [...current, sticker] });
    }
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
          <span className="text-muted-foreground text-xs">{data.photos.length}/5 added · at least 2 needed</span>
        </button>
      ) : null}

      {data.photos.length > 0 ? (
        <div className="grid grid-cols-3 gap-2">
          {data.photos.map((p) => (
            <div key={p.id} className="bg-secondary relative aspect-square overflow-hidden rounded-xl">
              <Image src={p.photoUrl} alt="" fill className="object-cover" />
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
      ) : null}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="scrapbook-note">Handwritten note</Label>
        <Textarea id="scrapbook-note" rows={3} maxLength={160} value={data.note} onChange={(e) => onChange({ ...data, note: e.target.value })} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="scrapbook-date">Date (optional)</Label>
        <Input id="scrapbook-date" value={data.date} onChange={(e) => onChange({ ...data, date: e.target.value })} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Stickers (up to 4)</Label>
        <div className="flex flex-wrap gap-2">
          {STICKER_OPTIONS.map((sticker) => (
            <button
              key={sticker}
              type="button"
              onClick={() => toggleSticker(sticker)}
              className={cn(
                "flex size-10 items-center justify-center rounded-2xl border-2 text-lg",
                (data.stickers ?? []).includes(sticker) ? "border-primary bg-accent" : "border-border",
              )}
            >
              {sticker}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

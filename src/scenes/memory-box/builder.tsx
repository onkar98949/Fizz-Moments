"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { uploadPhotoAction } from "@/actions/photo-actions";
import { cn } from "@/lib/utils";
import { KEEPSAKE_OPTIONS, type MemoryBoxData } from "./config";
import type { SceneBuilderProps } from "../types";

export function MemoryBoxBuilder({ data, onChange }: SceneBuilderProps<MemoryBoxData>) {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const atMax = data.photos.length >= 6;

  async function handleFiles(files: FileList) {
    const room = 6 - data.photos.length;
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
        return result.success ? { id: crypto.randomUUID(), photoUrl: result.url } : null;
      }),
    );
    setIsUploading(false);

    const successes = uploaded.filter((p): p is NonNullable<typeof p> => p !== null);
    onChange({ ...data, photos: [...data.photos, ...successes] });
  }

  function removePhoto(id: string) {
    onChange({ ...data, photos: data.photos.filter((p) => p.id !== id) });
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
          <span className="text-muted-foreground text-xs">{data.photos.length}/6 added · at least 2 needed</span>
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
        <Label htmlFor="box-note">Note (optional)</Label>
        <Textarea id="box-note" rows={2} maxLength={160} value={data.note} onChange={(e) => onChange({ ...data, note: e.target.value })} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="box-date">Date (optional)</Label>
        <Input id="box-date" value={data.date} onChange={(e) => onChange({ ...data, date: e.target.value })} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Keepsake icon</Label>
        <div className="flex gap-2">
          {KEEPSAKE_OPTIONS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => onChange({ ...data, keepsakeEmoji: emoji })}
              className={cn(
                "flex size-10 items-center justify-center rounded-2xl border-2 text-lg",
                data.keepsakeEmoji === emoji ? "border-primary bg-accent" : "border-border",
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

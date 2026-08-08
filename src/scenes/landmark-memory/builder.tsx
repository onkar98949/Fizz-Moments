"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadPhotoAction } from "@/actions/photo-actions";
import { STORY_LIMITS } from "@/constants/story";
import type { LandmarkMemoryData } from "./config";
import type { SceneBuilderProps } from "../types";

export function LandmarkMemoryBuilder({ data, onChange }: SceneBuilderProps<LandmarkMemoryData>) {
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
          <button type="button" onClick={() => inputRef.current?.click()} className="relative aspect-video w-full overflow-hidden rounded-2xl">
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
        <Label htmlFor="landmark-name">Landmark name</Label>
        <Input id="landmark-name" value={data.landmarkName} onChange={(e) => onChange({ ...data, landmarkName: e.target.value })} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="landmark-caption">Caption (optional)</Label>
        <Input
          id="landmark-caption"
          maxLength={STORY_LIMITS.CAPTION_MAX_LENGTH}
          value={data.caption}
          onChange={(e) => onChange({ ...data, caption: e.target.value })}
        />
      </div>
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Car, ImagePlus, Loader2, Plane, TrainFront } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadPhotoAction } from "@/actions/photo-actions";
import { STORY_LIMITS } from "@/constants/story";
import { cn } from "@/lib/utils";
import type { JourneyData, Transportation } from "./config";
import type { SceneBuilderProps } from "../types";

const TRANSPORT_OPTIONS: { value: Transportation; label: string; icon: typeof Plane }[] = [
  { value: "plane", label: "Plane", icon: Plane },
  { value: "car", label: "Car", icon: Car },
  { value: "train", label: "Train", icon: TrainFront },
];

export function JourneyBuilder({ data, onChange }: SceneBuilderProps<JourneyData>) {
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
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="journey-from">From</Label>
          <Input id="journey-from" value={data.from} onChange={(e) => onChange({ ...data, from: e.target.value })} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="journey-to">To</Label>
          <Input id="journey-to" value={data.to} onChange={(e) => onChange({ ...data, to: e.target.value })} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Transportation</Label>
        <div className="flex gap-2">
          {TRANSPORT_OPTIONS.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => onChange({ ...data, transportation: value })}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-xl border-2 py-2.5",
                data.transportation === value ? "border-primary bg-accent" : "border-border",
              )}
            >
              <Icon className="size-4" />
              <span className="text-xs">{label}</span>
            </button>
          ))}
        </div>
      </div>

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
      {data.photoUrl ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="relative aspect-video w-full overflow-hidden rounded-2xl"
        >
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
          <span className="text-sm font-medium">Add a photo (optional)</span>
        </button>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="journey-caption">Caption (optional)</Label>
        <Input
          id="journey-caption"
          maxLength={STORY_LIMITS.CAPTION_MAX_LENGTH}
          value={data.caption}
          onChange={(e) => onChange({ ...data, caption: e.target.value })}
        />
      </div>
    </div>
  );
}

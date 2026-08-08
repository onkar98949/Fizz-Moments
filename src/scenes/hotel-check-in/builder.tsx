"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadPhotoAction } from "@/actions/photo-actions";
import type { HotelCheckInData } from "./config";
import type { SceneBuilderProps } from "../types";

export function HotelCheckInBuilder({ data, onChange }: SceneBuilderProps<HotelCheckInData>) {
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
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="hotel-name">Hotel name</Label>
        <Input id="hotel-name" value={data.hotelName} onChange={(e) => onChange({ ...data, hotelName: e.target.value })} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="hotel-city">City (optional)</Label>
        <Input id="hotel-city" value={data.city} onChange={(e) => onChange({ ...data, city: e.target.value })} />
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
    </div>
  );
}

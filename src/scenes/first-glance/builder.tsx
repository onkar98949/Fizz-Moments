"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadPhotoAction } from "@/actions/photo-actions";
import type { FirstGlanceData } from "./config";
import type { SceneBuilderProps } from "../types";

export function FirstGlanceBuilder({ data, onChange }: SceneBuilderProps<FirstGlanceData>) {
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
        <Label>Couple photo</Label>
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

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="glance-name-a">First name</Label>
          <Input id="glance-name-a" value={data.nameA} onChange={(e) => onChange({ ...data, nameA: e.target.value })} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="glance-name-b">Second name</Label>
          <Input id="glance-name-b" value={data.nameB} onChange={(e) => onChange({ ...data, nameB: e.target.value })} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="glance-title">Short title (optional)</Label>
        <Input id="glance-title" value={data.title} onChange={(e) => onChange({ ...data, title: e.target.value })} />
      </div>
    </div>
  );
}

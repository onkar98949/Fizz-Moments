"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadPhotoAction } from "@/actions/photo-actions";
import type { CinemaTicketData } from "./config";
import type { SceneBuilderProps } from "../types";

export function CinemaTicketBuilder({ data, onChange }: SceneBuilderProps<CinemaTicketData>) {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setIsUploading(true);
    const formData = new FormData();
    formData.set("file", file);
    const result = await uploadPhotoAction(formData);
    setIsUploading(false);
    if (result.success) onChange({ ...data, posterUrl: result.url });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="ticket-title">Title</Label>
        <Input id="ticket-title" value={data.movieTitle} onChange={(e) => onChange({ ...data, movieTitle: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ticket-date">Date (optional)</Label>
          <Input id="ticket-date" value={data.date} onChange={(e) => onChange({ ...data, date: e.target.value })} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ticket-location">Location (optional)</Label>
          <Input id="ticket-location" value={data.location} onChange={(e) => onChange({ ...data, location: e.target.value })} />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="ticket-subtitle">Subtitle (optional)</Label>
        <Input id="ticket-subtitle" value={data.subtitle} onChange={(e) => onChange({ ...data, subtitle: e.target.value })} />
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
        <Label>Poster image</Label>
        {data.posterUrl ? (
          <button type="button" onClick={() => inputRef.current?.click()} className="relative aspect-[2/3] w-32 overflow-hidden rounded-2xl">
            <Image src={data.posterUrl} alt="" fill className="object-cover" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="border-border bg-secondary/40 hover:border-primary/50 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-8 disabled:opacity-60"
          >
            {isUploading ? <Loader2 className="size-5 animate-spin" /> : <ImagePlus className="size-5" />}
            <span className="text-sm font-medium">Add a poster photo</span>
          </button>
        )}
      </div>
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ImagePlus, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { uploadPhotoAction } from "@/actions/photo-actions";
import { STORY_LIMITS } from "@/constants/story";
import type { TimelineData } from "./config";
import type { SceneBuilderProps } from "../types";

export function TimelineBuilder({ data, onChange }: SceneBuilderProps<TimelineData>) {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const atMax = data.moments.length >= 6;

  async function handleFiles(files: FileList) {
    const room = 6 - data.moments.length;
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
        return result.success ? { id: crypto.randomUUID(), photoUrl: result.url, title: "", caption: "" } : null;
      }),
    );
    setIsUploading(false);

    const successes = uploaded.filter((m): m is NonNullable<typeof m> => m !== null);
    onChange({ moments: [...data.moments, ...successes] });
  }

  function updateMoment(id: string, patch: Partial<TimelineData["moments"][number]>) {
    onChange({ moments: data.moments.map((m) => (m.id === id ? { ...m, ...patch } : m)) });
  }

  function removeMoment(id: string) {
    onChange({ moments: data.moments.filter((m) => m.id !== id) });
  }

  function moveMoment(id: string, direction: -1 | 1) {
    const index = data.moments.findIndex((m) => m.id === id);
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= data.moments.length) return;
    const next = [...data.moments];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    onChange({ moments: next });
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
      {!atMax && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="border-border bg-secondary/40 hover:border-primary/50 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center disabled:opacity-60"
        >
          <span className="bg-moment-gradient flex size-10 items-center justify-center rounded-full text-white">
            {isUploading ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
          </span>
          <span className="text-sm font-medium">Add photos</span>
          <span className="text-muted-foreground text-xs">{data.moments.length}/6 added · at least 2 needed</span>
        </button>
      )}

      <div className="flex flex-col gap-3">
        {data.moments.map((moment, index) => (
          <div key={moment.id} className="bg-secondary/40 flex gap-3 rounded-2xl p-3">
            <div className="relative size-16 shrink-0 overflow-hidden rounded-xl">
              <Image src={moment.photoUrl} alt={moment.title || "Moment"} fill className="object-cover" />
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              <Input
                placeholder="Title"
                value={moment.title}
                onChange={(e) => updateMoment(moment.id, { title: e.target.value })}
              />
              <Input
                placeholder="Caption (optional)"
                maxLength={STORY_LIMITS.CAPTION_MAX_LENGTH}
                value={moment.caption}
                onChange={(e) => updateMoment(moment.id, { caption: e.target.value })}
              />
            </div>
            <div className="flex flex-col justify-between">
              <button
                type="button"
                aria-label="Remove"
                onClick={() => removeMoment(moment.id)}
                className="flex size-6 items-center justify-center rounded-full bg-white/80"
              >
                <X className="size-3.5" />
              </button>
              <div className="flex gap-1">
                <button
                  type="button"
                  aria-label="Move earlier"
                  disabled={index === 0}
                  onClick={() => moveMoment(moment.id, -1)}
                  className="flex size-6 items-center justify-center rounded-full bg-white/80 disabled:opacity-30"
                >
                  <ArrowLeft className="size-3" />
                </button>
                <button
                  type="button"
                  aria-label="Move later"
                  disabled={index === data.moments.length - 1}
                  onClick={() => moveMoment(moment.id, 1)}
                  className="flex size-6 items-center justify-center rounded-full bg-white/80 disabled:opacity-30"
                >
                  <ArrowRight className="size-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ImagePlus, RefreshCw, X } from "lucide-react";
import { cn } from "@/lib/utils";

/** A photo staged locally before upload — not yet a Storage URL. Colocated
 *  here (rather than a feature-specific types file) since this component
 *  is reused across multiple Story Experience scene builders. */
export type PhotoDraft = {
  localId: string;
  file: File;
  previewUrl: string;
  title: string;
  caption: string;
};

type PhotoUploadProps = {
  memories: PhotoDraft[];
  onChange: (memories: PhotoDraft[]) => void;
  min: number;
  max: number;
  className?: string;
};

function filesToDrafts(files: FileList | File[]): PhotoDraft[] {
  return Array.from(files)
    .filter((file) => file.type.startsWith("image/"))
    .map((file) => ({
      localId: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
      title: "",
      caption: "",
    }));
}

export function PhotoUpload({ memories, onChange, min, max, className }: PhotoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const replaceTargetId = useRef<string | null>(null);

  const atMax = memories.length >= max;

  function addFiles(files: FileList | File[]) {
    const room = max - memories.length;
    if (room <= 0) return;
    const drafts = filesToDrafts(files).slice(0, room);
    onChange([...memories, ...drafts]);
  }

  function removePhoto(localId: string) {
    const target = memories.find((m) => m.localId === localId);
    if (target) URL.revokeObjectURL(target.previewUrl);
    onChange(memories.filter((m) => m.localId !== localId));
  }

  function movePhoto(localId: string, direction: -1 | 1) {
    const index = memories.findIndex((m) => m.localId === localId);
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= memories.length) return;

    const next = [...memories];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    onChange(next);
  }

  function requestReplace(localId: string) {
    replaceTargetId.current = localId;
    replaceInputRef.current?.click();
  }

  function handleReplaceFile(file: File | undefined) {
    if (!file || !replaceTargetId.current) return;
    const targetId = replaceTargetId.current;

    onChange(
      memories.map((m) => {
        if (m.localId !== targetId) return m;
        URL.revokeObjectURL(m.previewUrl);
        return { ...m, file, previewUrl: URL.createObjectURL(file) };
      }),
    );
    replaceTargetId.current = null;
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files) addFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <input
        ref={replaceInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          handleReplaceFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      {!atMax && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
          }}
          className={cn(
            "border-border bg-secondary/40 hover:border-primary/50 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors",
            isDragging && "border-primary bg-accent/40",
          )}
        >
          <span className="bg-moment-gradient flex size-11 items-center justify-center rounded-full text-white">
            <ImagePlus className="size-5" />
          </span>
          <span className="font-medium">Add your favorite photo{max === 1 ? "" : "s"}</span>
          <span className="text-muted-foreground text-xs">
            {memories.length}/{max} added
            {min > 0 ? ` · at least ${min} needed` : ""}
          </span>
        </button>
      )}

      {memories.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {memories.map((memory, index) => (
            <motion.div
              key={memory.localId}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-card group relative aspect-square overflow-hidden rounded-2xl shadow-soft"
            >
              <Image
                src={memory.previewUrl}
                alt={`Memory ${index + 1}`}
                fill
                unoptimized
                className="object-cover"
              />
              <div className="absolute inset-0 flex flex-col justify-between bg-black/0 p-2 opacity-0 transition-opacity group-hover:bg-black/35 group-hover:opacity-100 focus-within:opacity-100">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => removePhoto(memory.localId)}
                    aria-label="Remove photo"
                    className="flex size-7 items-center justify-center rounded-full bg-white/90 text-black"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => movePhoto(memory.localId, -1)}
                      disabled={index === 0}
                      aria-label="Move earlier"
                      className="flex size-7 items-center justify-center rounded-full bg-white/90 text-black disabled:opacity-40"
                    >
                      <ArrowLeft className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => movePhoto(memory.localId, 1)}
                      disabled={index === memories.length - 1}
                      aria-label="Move later"
                      className="flex size-7 items-center justify-center rounded-full bg-white/90 text-black disabled:opacity-40"
                    >
                      <ArrowRight className="size-3.5" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => requestReplace(memory.localId)}
                    aria-label="Replace photo"
                    className="flex size-7 items-center justify-center rounded-full bg-white/90 text-black"
                  >
                    <RefreshCw className="size-3.5" />
                  </button>
                </div>
              </div>
              <span className="absolute top-2 left-2 flex size-5 items-center justify-center rounded-full bg-black/60 text-[11px] font-medium text-white">
                {index + 1}
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

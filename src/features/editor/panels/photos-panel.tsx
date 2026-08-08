"use client";

import { useRef } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TemplateEditor } from "../use-template-editor";

export function PhotosPanel({ selectedElement, replaceImage, isUploadingImage, deleteElement }: TemplateEditor) {
  const inputRef = useRef<HTMLInputElement>(null);
  const imageElement = selectedElement?.type === "image" ? selectedElement : null;

  function handleFile(file: File) {
    replaceImage(imageElement?.id ?? null, file);
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

      {imageElement ? (
        <>
          <div className="relative aspect-square w-full max-w-[10rem] overflow-hidden rounded-2xl">
            <Image src={imageElement.src} alt="" fill sizes="160px" className="object-cover" unoptimized />
          </div>
          <div className="flex gap-2">
            <Button type="button" onClick={() => inputRef.current?.click()} disabled={isUploadingImage} className="flex-1 rounded-full">
              {isUploadingImage ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
              Replace Photo
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Delete photo"
              onClick={() => deleteElement(imageElement.id)}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive rounded-full"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploadingImage}
          className="border-border bg-secondary/40 hover:border-primary/50 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-8 disabled:opacity-60"
        >
          {isUploadingImage ? <Loader2 className="size-5 animate-spin" /> : <ImagePlus className="size-5" />}
          <span className="text-sm font-medium">Add a photo</span>
          <span className="text-muted-foreground text-xs">or tap any photo on the canvas to replace it</span>
        </button>
      )}
    </div>
  );
}

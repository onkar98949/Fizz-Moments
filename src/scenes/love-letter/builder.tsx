"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { uploadPhotoAction } from "@/actions/photo-actions";
import { cn } from "@/lib/utils";
import { LETTER_STYLE_OPTIONS, MESSAGE_MAX_LENGTH, RECIPIENT_MAX_LENGTH, SIGNATURE_MAX_LENGTH } from "./fields";
import type { LoveLetterData } from "./types";
import type { SceneBuilderProps } from "../types";

export function LoveLetterBuilder({ data, onChange }: SceneBuilderProps<LoveLetterData>) {
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
        <Label htmlFor="love-letter-recipient">Recipient name</Label>
        <Input
          id="love-letter-recipient"
          maxLength={RECIPIENT_MAX_LENGTH}
          value={data.recipientName}
          onChange={(e) => onChange({ ...data, recipientName: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="love-letter-message">Message</Label>
        <Textarea
          id="love-letter-message"
          rows={4}
          maxLength={MESSAGE_MAX_LENGTH}
          placeholder="Keep it short — this letter is meant to be felt in a few lines, not read like a page."
          value={data.message}
          onChange={(e) => onChange({ ...data, message: e.target.value })}
        />
        <span className="text-muted-foreground self-end text-xs">
          {data.message.length}/{MESSAGE_MAX_LENGTH}
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="love-letter-signature">Signature</Label>
        <Input
          id="love-letter-signature"
          maxLength={SIGNATURE_MAX_LENGTH}
          placeholder="Always,"
          value={data.signature}
          onChange={(e) => onChange({ ...data, signature: e.target.value })}
        />
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
          <button type="button" onClick={() => inputRef.current?.click()} className="relative aspect-square w-32 overflow-hidden rounded-xl">
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
        <Label>Letter style</Label>
        <div className="grid grid-cols-4 gap-2">
          {LETTER_STYLE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              disabled={!option.available}
              onClick={() => onChange({ ...data, letterStyle: option.value })}
              className={cn(
                "relative flex flex-col items-center gap-1 rounded-xl border-2 py-2.5 text-xs font-medium",
                !option.available && "cursor-not-allowed opacity-40",
                option.available && data.letterStyle === option.value ? "border-primary bg-accent" : "border-border",
              )}
            >
              {option.label}
              {!option.available ? <span className="text-muted-foreground text-[9px] font-normal">Soon</span> : null}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

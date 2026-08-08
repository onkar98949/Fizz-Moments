"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { uploadPhotoAction } from "@/actions/photo-actions";
import { cn } from "@/lib/utils";
import type { ChatSender, TextConversationData, Wallpaper } from "./config";
import type { SceneBuilderProps } from "../types";

const WALLPAPER_OPTIONS: { value: Wallpaper; label: string; swatch: string }[] = [
  { value: "default", label: "Default", swatch: "linear-gradient(135deg, #f4f5f7, #ffffff)" },
  { value: "love", label: "Blush", swatch: "linear-gradient(135deg, #ff8a65, #ffb199)" },
  { value: "dreamy", label: "Dreamy", swatch: "linear-gradient(135deg, #b79ced, #d7c8ff)" },
  { value: "sky", label: "Sky", swatch: "linear-gradient(135deg, #8fd3ff, #cdeeff)" },
];

export function TextConversationBuilder({ data, onChange }: SceneBuilderProps<TextConversationData>) {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const atMax = data.messages.length >= 8;

  function addMessage(from: ChatSender) {
    onChange({ ...data, messages: [...data.messages, { id: crypto.randomUUID(), from, text: "" }] });
  }

  function updateMessage(id: string, text: string) {
    onChange({ ...data, messages: data.messages.map((m) => (m.id === id ? { ...m, text } : m)) });
  }

  function toggleSender(id: string) {
    onChange({
      ...data,
      messages: data.messages.map((m) => (m.id === id ? { ...m, from: m.from === "sender" ? "receiver" : "sender" } : m)),
    });
  }

  function removeMessage(id: string) {
    onChange({ ...data, messages: data.messages.filter((m) => m.id !== id) });
  }

  async function handleFile(file: File) {
    setIsUploading(true);
    const formData = new FormData();
    formData.set("file", file);
    const result = await uploadPhotoAction(formData);
    setIsUploading(false);
    if (result.success) onChange({ ...data, finalImageUrl: result.url });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="chat-sender">Sender name</Label>
          <Input
            id="chat-sender"
            value={data.senderName}
            onChange={(e) => onChange({ ...data, senderName: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="chat-receiver">Receiver name</Label>
          <Input
            id="chat-receiver"
            value={data.receiverName}
            onChange={(e) => onChange({ ...data, receiverName: e.target.value })}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label>Messages</Label>
          <span className="text-muted-foreground text-xs">{data.messages.length}/8 · at least 4 needed</span>
        </div>
        <div className="flex flex-col gap-2">
          {data.messages.map((m) => (
            <div key={m.id} className="bg-secondary/40 flex items-center gap-2 rounded-2xl p-2">
              <button
                type="button"
                onClick={() => toggleSender(m.id)}
                className={cn(
                  "shrink-0 rounded-full px-2.5 py-1.5 text-xs font-medium",
                  m.from === "sender" ? "bg-primary text-primary-foreground" : "bg-white text-foreground",
                )}
              >
                {m.from === "sender" ? data.senderName || "Sender" : data.receiverName || "Receiver"}
              </button>
              <Input
                value={m.text}
                onChange={(e) => updateMessage(m.id, e.target.value)}
                placeholder="Type a message…"
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Remove message"
                onClick={() => removeMessage(m.id)}
                className="text-destructive shrink-0 rounded-full"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          ))}
        </div>
        {!atMax ? (
          <div className="flex gap-2">
            <Button type="button" variant="secondary" size="sm" className="flex-1 rounded-full" onClick={() => addMessage("sender")}>
              + Sender message
            </Button>
            <Button type="button" variant="secondary" size="sm" className="flex-1 rounded-full" onClick={() => addMessage("receiver")}>
              + Receiver message
            </Button>
          </div>
        ) : null}
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
        <Label>Final photo reveal</Label>
        {data.finalImageUrl ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="relative aspect-video w-full overflow-hidden rounded-2xl"
          >
            <Image src={data.finalImageUrl} alt="" fill className="object-cover" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="border-border bg-secondary/40 hover:border-primary/50 flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-8 disabled:opacity-60"
          >
            {isUploading ? <Loader2 className="size-5 animate-spin" /> : <ImagePlus className="size-5" />}
            <span className="text-sm font-medium">Add the reveal photo</span>
          </button>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Chat wallpaper</Label>
        <div className="flex gap-2">
          {WALLPAPER_OPTIONS.map((w) => (
            <button
              key={w.value}
              type="button"
              onClick={() => onChange({ ...data, wallpaper: w.value })}
              className={cn(
                "flex flex-1 flex-col items-center gap-1.5 rounded-xl border-2 py-2",
                data.wallpaper === w.value ? "border-primary" : "border-border",
              )}
            >
              <span className="size-6 rounded-full" style={{ backgroundImage: w.swatch }} />
              <span className="text-[11px]">{w.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUp, ImagePlus, Loader2, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { uploadPhotoAction } from "@/actions/photo-actions";
import type { BoardingLeg, BoardingTimelineData } from "./config";
import type { SceneBuilderProps } from "../types";

function LegCard({
  leg,
  index,
  total,
  onUpdate,
  onRemove,
  onMove,
}: {
  leg: BoardingLeg;
  index: number;
  total: number;
  onUpdate: (patch: Partial<BoardingLeg>) => void;
  onRemove: () => void;
  onMove: (direction: -1 | 1) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setIsUploading(true);
    const formData = new FormData();
    formData.set("file", file);
    const result = await uploadPhotoAction(formData);
    setIsUploading(false);
    if (result.success) onUpdate({ photoUrl: result.url });
  }

  return (
    <div className="bg-secondary/40 flex flex-col gap-2 rounded-2xl p-3">
      <div className="flex items-center gap-2">
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
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="bg-secondary relative size-14 shrink-0 overflow-hidden rounded-xl"
        >
          {leg.photoUrl ? (
            <Image src={leg.photoUrl} alt="" fill className="object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center">
              {isUploading ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
            </span>
          )}
        </button>
        <div className="grid flex-1 grid-cols-3 gap-1.5">
          <Input placeholder="From" value={leg.from} onChange={(e) => onUpdate({ from: e.target.value })} />
          <Input placeholder="To" value={leg.to} onChange={(e) => onUpdate({ to: e.target.value })} />
          <Input placeholder="Date" value={leg.date} onChange={(e) => onUpdate({ date: e.target.value })} />
        </div>
      </div>
      <div className="flex justify-end gap-1">
        <Button type="button" variant="ghost" size="icon-sm" aria-label="Move earlier" disabled={index === 0} onClick={() => onMove(-1)} className="rounded-full">
          <ArrowUp className="size-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Move later"
          disabled={index === total - 1}
          onClick={() => onMove(1)}
          className="rounded-full"
        >
          <ArrowDown className="size-3.5" />
        </Button>
        <Button type="button" variant="ghost" size="icon-sm" aria-label="Remove destination" onClick={onRemove} className="text-destructive rounded-full">
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}

export function BoardingTimelineBuilder({ data, onChange }: SceneBuilderProps<BoardingTimelineData>) {
  const atMax = data.legs.length >= 4;

  function addLeg() {
    onChange({ legs: [...data.legs, { id: crypto.randomUUID(), from: "", to: "", date: "", photoUrl: "" }] });
  }

  function updateLeg(id: string, patch: Partial<BoardingLeg>) {
    onChange({ legs: data.legs.map((l) => (l.id === id ? { ...l, ...patch } : l)) });
  }

  function removeLeg(id: string) {
    onChange({ legs: data.legs.filter((l) => l.id !== id) });
  }

  function moveLeg(id: string, direction: -1 | 1) {
    const index = data.legs.findIndex((l) => l.id === id);
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= data.legs.length) return;
    const next = [...data.legs];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    onChange({ legs: next });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Label>Destinations</Label>
        <span className="text-muted-foreground text-xs">{data.legs.length}/4 · at least 2 needed</span>
      </div>
      <div className="flex flex-col gap-2">
        {data.legs.map((leg, index) => (
          <LegCard
            key={leg.id}
            leg={leg}
            index={index}
            total={data.legs.length}
            onUpdate={(patch) => updateLeg(leg.id, patch)}
            onRemove={() => removeLeg(leg.id)}
            onMove={(direction) => moveLeg(leg.id, direction)}
          />
        ))}
      </div>
      {!atMax ? (
        <Button type="button" variant="secondary" className="rounded-full" onClick={addLeg}>
          + Add destination
        </Button>
      ) : null}
    </div>
  );
}

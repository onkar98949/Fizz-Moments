"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUp, ImagePlus, Loader2, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { uploadPhotoAction } from "@/actions/photo-actions";
import type { MapStop, MemoryMapData } from "./config";
import type { SceneBuilderProps } from "../types";

function StopCard({
  stop,
  index,
  total,
  onUpdate,
  onRemove,
  onMove,
}: {
  stop: MapStop;
  index: number;
  total: number;
  onUpdate: (patch: Partial<MapStop>) => void;
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
          {stop.photoUrl ? (
            <Image src={stop.photoUrl} alt="" fill className="object-cover" />
          ) : (
            <span className="flex h-full w-full items-center justify-center">
              {isUploading ? <Loader2 className="size-4 animate-spin" /> : <ImagePlus className="size-4" />}
            </span>
          )}
        </button>
        <div className="grid flex-1 grid-cols-2 gap-1.5">
          <Input placeholder="Place" value={stop.name} onChange={(e) => onUpdate({ name: e.target.value })} />
          <Input placeholder="Date (optional)" value={stop.date} onChange={(e) => onUpdate({ date: e.target.value })} />
        </div>
      </div>
      <Input placeholder="Caption (optional)" value={stop.caption} onChange={(e) => onUpdate({ caption: e.target.value })} />
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
        <Button type="button" variant="ghost" size="icon-sm" aria-label="Remove stop" onClick={onRemove} className="text-destructive rounded-full">
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}

export function MemoryMapBuilder({ data, onChange }: SceneBuilderProps<MemoryMapData>) {
  const atMax = data.stops.length >= 5;

  function addStop() {
    onChange({ stops: [...data.stops, { id: crypto.randomUUID(), name: "", date: "", photoUrl: "", caption: "" }] });
  }

  function updateStop(id: string, patch: Partial<MapStop>) {
    onChange({ stops: data.stops.map((s) => (s.id === id ? { ...s, ...patch } : s)) });
  }

  function removeStop(id: string) {
    onChange({ stops: data.stops.filter((s) => s.id !== id) });
  }

  function moveStop(id: string, direction: -1 | 1) {
    const index = data.stops.findIndex((s) => s.id === id);
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= data.stops.length) return;
    const next = [...data.stops];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    onChange({ stops: next });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Label>Stops</Label>
        <span className="text-muted-foreground text-xs">{data.stops.length}/5 · at least 2 needed</span>
      </div>
      <div className="flex flex-col gap-2">
        {data.stops.map((stop, index) => (
          <StopCard
            key={stop.id}
            stop={stop}
            index={index}
            total={data.stops.length}
            onUpdate={(patch) => updateStop(stop.id, patch)}
            onRemove={() => removeStop(stop.id)}
            onMove={(direction) => moveStop(stop.id, direction)}
          />
        ))}
      </div>
      {!atMax ? (
        <Button type="button" variant="secondary" className="rounded-full" onClick={addStop}>
          + Add stop
        </Button>
      ) : null}
    </div>
  );
}

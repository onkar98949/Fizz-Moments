"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { BoardingPassData } from "./config";
import type { SceneBuilderProps } from "../types";

export function BoardingPassBuilder({ data, onChange }: SceneBuilderProps<BoardingPassData>) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="pass-departure">Departure</Label>
          <Input id="pass-departure" value={data.departure} onChange={(e) => onChange({ ...data, departure: e.target.value })} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="pass-destination">Destination</Label>
          <Input id="pass-destination" value={data.destination} onChange={(e) => onChange({ ...data, destination: e.target.value })} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="pass-date">Date (optional)</Label>
          <Input id="pass-date" value={data.date} onChange={(e) => onChange({ ...data, date: e.target.value })} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="pass-flight">Flight number (optional)</Label>
          <Input id="pass-flight" value={data.flightNumber} onChange={(e) => onChange({ ...data, flightNumber: e.target.value })} />
        </div>
      </div>
    </div>
  );
}

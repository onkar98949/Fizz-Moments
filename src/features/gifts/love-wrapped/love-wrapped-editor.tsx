"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowDown, ArrowLeft, ArrowUp, ImagePlus, Loader2, Plus, Share2, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ShareLinks } from "@/features/story-editor/share-links";
import { useGatedShare } from "@/features/auth/use-gated-share";
import { LOVE_WRAPPED_LIMITS } from "@/types/gifts";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { useLoveWrappedEditor } from "./use-love-wrapped-editor";
import type { LoveWrappedData } from "@/types/gifts";

function requestPhoto(onFile: (file: File) => void) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = () => {
    const file = input.files?.[0];
    if (file) onFile(file);
  };
  input.click();
}

export function LoveWrappedEditor({ wrapped, isSignedIn }: { wrapped: LoveWrappedData; isSignedIn: boolean }) {
  const editor = useLoveWrappedEditor(wrapped);
  const share = useGatedShare(isSignedIn);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-5 py-6 sm:py-10">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon-sm" aria-label="Back to gifts" nativeButton={false} render={<Link href="/gifts" />}>
          <ArrowLeft className="size-4" />
        </Button>
        <Input
          value={editor.title}
          onChange={(e) => editor.setTitle(e.target.value)}
          maxLength={LOVE_WRAPPED_LIMITS.GIFT_TITLE_MAX_LENGTH}
          placeholder="Untitled Recap"
          className="ml-1 h-9 max-w-[220px] border-none bg-transparent px-2 font-medium shadow-none focus-visible:ring-0"
        />
        <div className="ml-auto flex items-center gap-1.5">
          <Button size="sm" variant="outline" onClick={share.requestShare}>
            <Share2 className="size-3.5" />
            Share
          </Button>
          <Button size="sm" onClick={editor.save} disabled={editor.isSaving}>
            {editor.isSaving ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 text-center">
        <span className="text-3xl">🎵</span>
        <p className="text-muted-foreground text-caption">A cinematic recap of your relationship.</p>
      </div>

      <div className="bg-card shadow-soft flex flex-col gap-2 rounded-xl p-5">
        <Label className="text-muted-foreground text-xs">Together since</Label>
        <input
          type="date"
          value={editor.startDate}
          onChange={(e) => editor.setStartDate(e.target.value)}
          max={new Date().toISOString().slice(0, 10)}
          className="border-input bg-secondary/70 h-11 rounded-md border border-transparent px-4 text-sm outline-none focus-visible:border-ring/60 focus-visible:bg-background focus-visible:ring-3 focus-visible:ring-ring/25"
        />
        <p className="text-muted-foreground text-meta">Days together are calculated automatically, so it&apos;s always accurate.</p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">Stats</h2>
          <span className="text-muted-foreground text-meta">
            {editor.stats.length}/{LOVE_WRAPPED_LIMITS.MAX_STATS}
          </span>
        </div>
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex flex-col gap-2">
          {editor.stats.map((stat) => (
            <motion.div key={stat.id} layout variants={staggerItem} className="bg-card shadow-soft flex items-center gap-2 rounded-xl p-3">
              <Input
                value={stat.emoji}
                onChange={(e) => editor.updateStat(stat.id, { emoji: e.target.value })}
                maxLength={8}
                className="h-9 w-14 text-center"
              />
              <Input
                value={stat.label}
                onChange={(e) => editor.updateStat(stat.id, { label: e.target.value })}
                placeholder="memories"
                maxLength={LOVE_WRAPPED_LIMITS.LABEL_MAX_LENGTH}
                className="h-9 flex-1"
              />
              <Input
                type="number"
                value={stat.value}
                onChange={(e) => editor.updateStat(stat.id, { value: Number(e.target.value) || 0 })}
                className="h-9 w-24"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Remove stat"
                onClick={() => editor.removeStat(stat.id)}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </motion.div>
          ))}
        </motion.div>
        <Button type="button" variant="outline" onClick={editor.addStat} disabled={editor.stats.length >= LOVE_WRAPPED_LIMITS.MAX_STATS}>
          <Plus className="size-4" />
          Add Stat
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">Moments</h2>
          <span className="text-muted-foreground text-meta">
            {editor.moments.length}/{LOVE_WRAPPED_LIMITS.MAX_MOMENTS}
          </span>
        </div>
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex flex-col gap-3">
          {editor.moments.map((moment, index) => (
            <motion.div key={moment.id} layout variants={staggerItem} className="bg-card shadow-soft flex flex-col gap-3 rounded-xl p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Input
                    value={moment.emoji}
                    onChange={(e) => editor.updateMoment(moment.id, { emoji: e.target.value })}
                    maxLength={8}
                    className="h-9 w-14 text-center"
                  />
                  <Input
                    value={moment.label}
                    onChange={(e) => editor.updateMoment(moment.id, { label: e.target.value })}
                    placeholder="Favorite place"
                    maxLength={LOVE_WRAPPED_LIMITS.LABEL_MAX_LENGTH}
                    className="h-9 w-44"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <Button type="button" variant="ghost" size="icon-sm" aria-label="Move up" disabled={index === 0} onClick={() => editor.moveMoment(moment.id, -1)}>
                    <ArrowUp className="size-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Move down"
                    disabled={index === editor.moments.length - 1}
                    onClick={() => editor.moveMoment(moment.id, 1)}
                  >
                    <ArrowDown className="size-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Remove moment"
                    onClick={() => editor.removeMoment(moment.id)}
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                {moment.photoUrl ? (
                  <div className="group relative size-16 shrink-0 overflow-hidden rounded-lg">
                    <Image src={moment.photoUrl} alt="" fill unoptimized className="object-cover" />
                    <button
                      type="button"
                      aria-label="Remove photo"
                      onClick={() => editor.updateMoment(moment.id, { photoUrl: null })}
                      className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition-opacity group-hover:bg-black/40 group-hover:opacity-100"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => requestPhoto((file) => editor.uploadMomentPhoto(moment.id, file))}
                    disabled={editor.uploadingId === moment.id}
                    className="bg-secondary hover:bg-secondary/70 flex size-16 shrink-0 items-center justify-center rounded-lg transition-colors"
                  >
                    {editor.uploadingId === moment.id ? (
                      <Loader2 className="text-muted-foreground size-4 animate-spin" />
                    ) : (
                      <ImagePlus className="text-muted-foreground size-4" />
                    )}
                  </button>
                )}
                <Textarea
                  value={moment.text}
                  onChange={(e) => editor.updateMoment(moment.id, { text: e.target.value })}
                  placeholder="A line or two about this one"
                  maxLength={LOVE_WRAPPED_LIMITS.TEXT_MAX_LENGTH}
                  className="min-h-16 flex-1 text-sm"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
        <Button type="button" variant="outline" onClick={editor.addMoment} disabled={editor.moments.length >= LOVE_WRAPPED_LIMITS.MAX_MOMENTS}>
          <Plus className="size-4" />
          Add Moment
        </Button>
      </div>

      <div className="bg-card shadow-soft flex flex-col gap-2 rounded-xl p-5">
        <Label className="text-muted-foreground text-xs">Closing message</Label>
        <Textarea
          value={editor.closingMessage}
          onChange={(e) => editor.setClosingMessage(e.target.value)}
          maxLength={LOVE_WRAPPED_LIMITS.CLOSING_MAX_LENGTH}
          className="min-h-16"
        />
      </div>

      <Dialog open={share.open} onOpenChange={share.setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Share this recap</DialogTitle>
            <DialogDescription>Anyone with the link can watch it. Only you have the edit link.</DialogDescription>
          </DialogHeader>
          <ShareLinks publicPath={`/gifts/love-wrapped/${editor.wrapped.id}`} editPath={`/gifts/love-wrapped/edit/${editor.wrapped.editToken}`} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

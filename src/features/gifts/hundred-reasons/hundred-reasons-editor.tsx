"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, ImagePlus, Loader2, Plus, Share2, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ShareLinks } from "@/features/story-editor/share-links";
import { useGatedShare } from "@/features/auth/use-gated-share";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { HUNDRED_REASONS_LIMITS } from "@/types/gifts";
import { useHundredReasonsEditor } from "./use-hundred-reasons-editor";
import type { HundredReasonsData } from "@/types/gifts";

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

export function HundredReasonsEditor({ gift, isSignedIn }: { gift: HundredReasonsData; isSignedIn: boolean }) {
  const editor = useHundredReasonsEditor(gift);
  const share = useGatedShare(isSignedIn, editor.save);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-5 py-6 sm:py-10">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon-sm" aria-label="Back to gifts" nativeButton={false} render={<Link href="/gifts" />}>
          <ArrowLeft className="size-4" />
        </Button>
        <Input
          value={editor.title}
          onChange={(e) => editor.setTitle(e.target.value)}
          maxLength={HUNDRED_REASONS_LIMITS.GIFT_TITLE_MAX_LENGTH}
          placeholder="100 Reasons"
          className="ml-1 h-9 max-w-[220px] border-none bg-transparent px-2 font-medium shadow-none focus-visible:ring-0"
        />
        <div className="ml-auto flex items-center gap-1.5">
          <Button size="sm" variant="outline" onClick={share.requestShare} disabled={share.isPreparing}>
            <Share2 className="size-3.5" />
            Share
          </Button>
          <Button size="sm" onClick={editor.save} disabled={editor.isSaving}>
            {editor.isSaving ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 text-center">
        <span className="text-3xl">💚</span>
        <p className="text-muted-foreground text-caption">
          {editor.reasons.length}/{HUNDRED_REASONS_LIMITS.MAX_REASONS} reasons · at least{" "}
          {HUNDRED_REASONS_LIMITS.MIN_REASONS} needed
        </p>
      </div>

      <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex flex-col gap-2.5">
        {editor.reasons.map((reason, index) => (
          <motion.div key={reason.id} layout variants={staggerItem} className="bg-card shadow-soft flex items-center gap-2.5 rounded-xl p-3">
            <span className="bg-secondary text-muted-foreground flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-medium">
              {index + 1}
            </span>

            {reason.photoUrl ? (
              <div className="group relative size-10 shrink-0 overflow-hidden rounded-lg">
                <Image src={reason.photoUrl} alt="" fill unoptimized className="object-cover" />
                <button
                  type="button"
                  aria-label="Remove photo"
                  onClick={() => editor.removeReasonPhoto(reason.id)}
                  className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition-opacity group-hover:bg-black/40 group-hover:opacity-100"
                >
                  <X className="size-3" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                aria-label="Add photo"
                onClick={() => requestPhoto((file) => editor.uploadReasonPhoto(reason.id, file))}
                disabled={editor.uploadingId === reason.id}
                className="bg-secondary hover:bg-secondary/70 flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors"
              >
                {editor.uploadingId === reason.id ? (
                  <Loader2 className="text-muted-foreground size-3.5 animate-spin" />
                ) : (
                  <ImagePlus className="text-muted-foreground size-3.5" />
                )}
              </button>
            )}

            <Input
              value={reason.text}
              onChange={(e) => editor.updateReason(reason.id, e.target.value)}
              placeholder="Your laugh."
              maxLength={HUNDRED_REASONS_LIMITS.REASON_MAX_LENGTH}
              className="h-9 flex-1"
            />

            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Remove reason"
              onClick={() => editor.removeReason(reason.id)}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </motion.div>
        ))}
      </motion.div>

      <Button
        type="button"
        variant="outline"
        onClick={editor.addReason}
        disabled={editor.reasons.length >= HUNDRED_REASONS_LIMITS.MAX_REASONS}
        className="w-full"
      >
        <Plus className="size-4" />
        Add Reason
      </Button>

      <div className="bg-card shadow-soft flex flex-col gap-2 rounded-xl p-6">
        <Label htmlFor="final-message">Closing message (optional)</Label>
        <Textarea
          id="final-message"
          value={editor.finalMessage}
          onChange={(e) => editor.setFinalMessage(e.target.value)}
          maxLength={HUNDRED_REASONS_LIMITS.FINAL_MESSAGE_MAX_LENGTH}
          placeholder="But if I had to choose one reason... You."
          className="min-h-16"
        />
      </div>

      <Dialog open={share.open} onOpenChange={share.setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Share this gift</DialogTitle>
            <DialogDescription>Anyone with the link can read through it. Only you have the edit link.</DialogDescription>
          </DialogHeader>
          <ShareLinks publicPath={`/gifts/100-reasons/${editor.gift.id}`} editPath={`/gifts/100-reasons/edit/${editor.gift.editToken}`} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

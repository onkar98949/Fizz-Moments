"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowDown, ArrowLeft, ArrowUp, ImagePlus, Loader2, Plus, Share2, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ShareLinks } from "@/features/story-editor/share-links";
import { useGatedShare } from "@/features/auth/use-gated-share";
import { SCRATCH_CARD_LIMITS } from "@/types/gifts";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { useScratchCardEditor } from "./use-scratch-card-editor";
import type { ScratchCardGiftData } from "@/types/gifts";

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

export function ScratchCardEditor({ gift, isSignedIn }: { gift: ScratchCardGiftData; isSignedIn: boolean }) {
  const editor = useScratchCardEditor(gift);
  const share = useGatedShare(isSignedIn, editor.save);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-5 py-6 sm:py-10">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Back to gifts"
          nativeButton={false}
          render={<Link href="/gifts" />}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <Input
          value={editor.title}
          onChange={(e) => editor.setTitle(e.target.value)}
          maxLength={SCRATCH_CARD_LIMITS.GIFT_TITLE_MAX_LENGTH}
          placeholder="Untitled Gift"
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
        <span className="text-3xl">🎟️</span>
        <p className="text-muted-foreground text-caption">
          {editor.cards.length}/{SCRATCH_CARD_LIMITS.MAX_CARDS} cards · at least {SCRATCH_CARD_LIMITS.MIN_CARDS} needed
        </p>
      </div>

      <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex flex-col gap-4">
        {editor.cards.map((card, index) => (
          <motion.div
            key={card.id}
            layout
            variants={staggerItem}
            className="bg-card shadow-soft flex flex-col gap-3 rounded-xl p-5"
          >
            <div className="flex items-center justify-between">
              <span className="bg-secondary text-muted-foreground flex size-6 items-center justify-center rounded-full text-xs font-medium">
                {index + 1}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Move up"
                  disabled={index === 0}
                  onClick={() => editor.moveCard(card.id, -1)}
                >
                  <ArrowUp className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Move down"
                  disabled={index === editor.cards.length - 1}
                  onClick={() => editor.moveCard(card.id, 1)}
                >
                  <ArrowDown className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Remove card"
                  onClick={() => editor.removeCard(card.id)}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="shrink-0">
                {card.photoUrl ? (
                  <div className="group relative size-16 overflow-hidden rounded-lg">
                    <Image src={card.photoUrl} alt="" fill unoptimized className="object-cover" />
                    <button
                      type="button"
                      aria-label="Remove photo"
                      onClick={() => editor.updateCard(card.id, { photoUrl: null })}
                      className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition-opacity group-hover:bg-black/40 group-hover:opacity-100"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => requestPhoto((file) => editor.uploadCardPhoto(card.id, file))}
                    disabled={editor.uploadingId === card.id}
                    aria-label="Add photo"
                    className="bg-secondary hover:bg-secondary/70 flex size-16 items-center justify-center rounded-lg transition-colors"
                  >
                    {editor.uploadingId === card.id ? (
                      <Loader2 className="text-muted-foreground size-4 animate-spin" />
                    ) : (
                      <ImagePlus className="text-muted-foreground size-4" />
                    )}
                  </button>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-2">
                <Input
                  value={card.title}
                  onChange={(e) => editor.updateCard(card.id, { title: e.target.value })}
                  placeholder="Card title (e.g. Card One)"
                  maxLength={SCRATCH_CARD_LIMITS.TITLE_MAX_LENGTH}
                  className="h-9"
                />
                <Textarea
                  value={card.reward}
                  onChange={(e) => editor.updateCard(card.id, { reward: e.target.value })}
                  placeholder="What's hidden underneath? (e.g. A love note just for you.)"
                  maxLength={SCRATCH_CARD_LIMITS.REWARD_MAX_LENGTH}
                  className="min-h-16 text-sm"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <Button
        type="button"
        variant="outline"
        onClick={editor.addCard}
        disabled={editor.cards.length >= SCRATCH_CARD_LIMITS.MAX_CARDS}
        className="w-full"
      >
        <Plus className="size-4" />
        Add Card
      </Button>

      <Dialog open={share.open} onOpenChange={share.setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Share this gift</DialogTitle>
            <DialogDescription>Anyone with the link can play it. Only you have the edit link.</DialogDescription>
          </DialogHeader>
          <ShareLinks
            publicPath={`/gifts/scratch-cards/${editor.gift.id}`}
            editPath={`/gifts/scratch-cards/edit/${editor.gift.editToken}`}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

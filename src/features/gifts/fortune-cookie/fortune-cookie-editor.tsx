"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Share2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ShareLinks } from "@/features/story-editor/share-links";
import { useGatedShare } from "@/features/auth/use-gated-share";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { FORTUNE_COOKIE_LIMITS } from "@/types/gifts";
import { useFortuneCookieEditor } from "./use-fortune-cookie-editor";
import type { FortuneCookieData } from "@/types/gifts";

export function FortuneCookieEditor({ cookie, isSignedIn }: { cookie: FortuneCookieData; isSignedIn: boolean }) {
  const editor = useFortuneCookieEditor(cookie);
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
          maxLength={FORTUNE_COOKIE_LIMITS.GIFT_TITLE_MAX_LENGTH}
          placeholder="Untitled Fortune"
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
        <span className="text-3xl">🥠</span>
        <p className="text-muted-foreground text-caption">A fortune cookie, ready to crack open.</p>
      </div>

      <div className="bg-card shadow-soft flex flex-col gap-2 rounded-xl p-6">
        <Label htmlFor="recipient-name">Who&apos;s this for?</Label>
        <Input
          id="recipient-name"
          value={editor.recipientName}
          onChange={(e) => editor.setRecipientName(e.target.value)}
          maxLength={FORTUNE_COOKIE_LIMITS.RECIPIENT_NAME_MAX_LENGTH}
          placeholder="Emma"
        />
      </div>

      <div className="flex flex-col gap-1.5 text-center">
        <p className="text-muted-foreground text-caption">
          {editor.fortunes.length}/{FORTUNE_COOKIE_LIMITS.MAX_FORTUNES} fortunes · at least {FORTUNE_COOKIE_LIMITS.MIN_FORTUNES}{" "}
          needed. Add more than one and they&apos;ll get a random one each time they crack it open.
        </p>
      </div>

      <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex flex-col gap-3">
        {editor.fortunes.map((fortune, index) => (
          <motion.div key={fortune.id} layout variants={staggerItem} className="bg-card shadow-soft flex items-start gap-3 rounded-xl p-4">
            <span className="bg-secondary text-muted-foreground mt-2 flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium">
              {index + 1}
            </span>
            <Textarea
              value={fortune.text}
              onChange={(e) => editor.updateFortune(fortune.id, e.target.value)}
              placeholder="You're going to fall in love with this person all over again this weekend."
              maxLength={FORTUNE_COOKIE_LIMITS.FORTUNE_MAX_LENGTH}
              className="min-h-16 flex-1 text-sm"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Remove fortune"
              onClick={() => editor.removeFortune(fortune.id)}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive mt-1 shrink-0"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </motion.div>
        ))}
      </motion.div>

      <Button
        type="button"
        variant="outline"
        onClick={editor.addFortune}
        disabled={editor.fortunes.length >= FORTUNE_COOKIE_LIMITS.MAX_FORTUNES}
        className="w-full"
      >
        <Plus className="size-4" />
        Add Fortune
      </Button>

      <Dialog open={share.open} onOpenChange={share.setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Share this fortune cookie</DialogTitle>
            <DialogDescription>Anyone with the link can crack it open. Only you have the edit link.</DialogDescription>
          </DialogHeader>
          <ShareLinks
            publicPath={`/gifts/fortune-cookie/${editor.cookie.id}`}
            editPath={`/gifts/fortune-cookie/edit/${editor.cookie.editToken}`}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

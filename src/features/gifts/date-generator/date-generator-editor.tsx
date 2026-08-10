"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Share2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ShareLinks } from "@/features/story-editor/share-links";
import { useGatedShare } from "@/features/auth/use-gated-share";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { DATE_BUDGETS, DATE_DIFFICULTIES, DATE_GENERATOR_LIMITS } from "@/types/gifts";
import { useDateGeneratorEditor } from "./use-date-generator-editor";
import type { DateGeneratorData } from "@/types/gifts";

export function DateGeneratorEditor({ generator, isSignedIn }: { generator: DateGeneratorData; isSignedIn: boolean }) {
  const editor = useDateGeneratorEditor(generator);
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
          maxLength={DATE_GENERATOR_LIMITS.GIFT_TITLE_MAX_LENGTH}
          placeholder="Untitled Generator"
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
        <span className="text-3xl">🎲</span>
        <p className="text-muted-foreground text-caption">
          {editor.ideas.length}/{DATE_GENERATOR_LIMITS.MAX_IDEAS} ideas · at least {DATE_GENERATOR_LIMITS.MIN_IDEAS} needed
        </p>
      </div>

      <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex flex-col gap-3">
        {editor.ideas.map((idea, index) => (
          <motion.div key={idea.id} layout variants={staggerItem} className="bg-card shadow-soft flex flex-col gap-3 rounded-xl p-4">
            <div className="flex items-center gap-2">
              <span className="bg-secondary text-muted-foreground flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                {index + 1}
              </span>
              <Input
                value={idea.text}
                onChange={(e) => editor.updateIdea(idea.id, { text: e.target.value })}
                maxLength={DATE_GENERATOR_LIMITS.TEXT_MAX_LENGTH}
                placeholder="Go for a midnight drive."
                className="h-9 flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Remove idea"
                onClick={() => editor.removeIdea(idea.id)}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-4 pl-9">
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground text-meta">Budget</span>
                <div className="flex gap-1">
                  {DATE_BUDGETS.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => editor.updateIdea(idea.id, { budget: b })}
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                        idea.budget === b ? "bg-accent text-primary-active" : "bg-secondary text-muted-foreground",
                      )}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground text-meta">Difficulty</span>
                <div className="flex gap-1">
                  {DATE_DIFFICULTIES.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => editor.updateIdea(idea.id, { difficulty: d })}
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                        idea.difficulty === d ? "bg-accent text-primary-active" : "bg-secondary text-muted-foreground",
                      )}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <Input
                value={idea.timeEstimate}
                onChange={(e) => editor.updateIdea(idea.id, { timeEstimate: e.target.value })}
                maxLength={DATE_GENERATOR_LIMITS.TIME_ESTIMATE_MAX_LENGTH}
                placeholder="~1 hour"
                className="h-8 w-24 text-xs"
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      <Button
        type="button"
        variant="outline"
        onClick={editor.addIdea}
        disabled={editor.ideas.length >= DATE_GENERATOR_LIMITS.MAX_IDEAS}
        className="w-full"
      >
        <Plus className="size-4" />
        Add Idea
      </Button>

      <Dialog open={share.open} onOpenChange={share.setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Share this generator</DialogTitle>
            <DialogDescription>Anyone with the link can spin for a date idea. Only you have the edit link.</DialogDescription>
          </DialogHeader>
          <ShareLinks
            publicPath={`/gifts/date-generator/${editor.generator.id}`}
            editPath={`/gifts/date-generator/edit/${editor.generator.editToken}`}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

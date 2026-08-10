"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Plus, Share2, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ShareLinks } from "@/features/story-editor/share-links";
import { useGatedShare } from "@/features/auth/use-gated-share";
import { MEMORY_QUIZ_LIMITS } from "@/types/gifts";
import { cn } from "@/lib/utils";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { useMemoryQuizEditor } from "./use-memory-quiz-editor";
import type { MemoryQuizData } from "@/types/gifts";

export function MemoryQuizEditor({ quiz, isSignedIn }: { quiz: MemoryQuizData; isSignedIn: boolean }) {
  const editor = useMemoryQuizEditor(quiz);
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
          maxLength={MEMORY_QUIZ_LIMITS.GIFT_TITLE_MAX_LENGTH}
          placeholder="Untitled Quiz"
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
        <span className="text-3xl">🧠</span>
        <p className="text-muted-foreground text-caption">
          {editor.questions.length}/{MEMORY_QUIZ_LIMITS.MAX_QUESTIONS} questions · at least{" "}
          {MEMORY_QUIZ_LIMITS.MIN_QUESTIONS} needed
        </p>
      </div>

      <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex flex-col gap-4">
        {editor.questions.map((question, qIndex) => (
          <motion.div key={question.id} layout variants={staggerItem} className="bg-card shadow-soft flex flex-col gap-3 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <span className="bg-secondary text-muted-foreground flex size-6 items-center justify-center rounded-full text-xs font-medium">
                {qIndex + 1}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Remove question"
                onClick={() => editor.removeQuestion(question.id)}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>

            <Textarea
              value={question.prompt}
              onChange={(e) => editor.updateQuestion(question.id, { prompt: e.target.value })}
              placeholder="Where did we have our first date?"
              maxLength={MEMORY_QUIZ_LIMITS.PROMPT_MAX_LENGTH}
              className="min-h-14 text-sm"
            />

            <div className="flex flex-col gap-2">
              <Label className="text-muted-foreground text-xs">
                Options — tap <Check className="inline size-3" /> to mark the correct one
              </Label>
              {question.options.map((option) => (
                <div key={option.id} className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="Mark as correct"
                    onClick={() => editor.updateQuestion(question.id, { correctOptionId: option.id })}
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-full transition-colors",
                      question.correctOptionId === option.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:bg-secondary/70",
                    )}
                  >
                    <Check className="size-4" />
                  </button>

                  <Input
                    value={option.label}
                    onChange={(e) => editor.updateOption(question.id, option.id, e.target.value)}
                    placeholder="Option text"
                    maxLength={MEMORY_QUIZ_LIMITS.OPTION_LABEL_MAX_LENGTH}
                    className="h-9 flex-1"
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Remove option"
                    onClick={() => editor.removeOption(question.id, option.id)}
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="size-3.5" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.addOption(question.id)}
                disabled={question.options.length >= MEMORY_QUIZ_LIMITS.MAX_OPTIONS}
                className="self-start"
              >
                <Plus className="size-3.5" />
                Add Option
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label className="text-muted-foreground text-xs">When they get it right</Label>
                <Input
                  value={question.correctReaction}
                  onChange={(e) => editor.updateQuestion(question.id, { correctReaction: e.target.value })}
                  placeholder="Okayyy you actually remember 😭❤️"
                  maxLength={MEMORY_QUIZ_LIMITS.REACTION_MAX_LENGTH}
                  className="h-9"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-muted-foreground text-xs">When they get it wrong</Label>
                <Input
                  value={question.wrongReaction}
                  onChange={(e) => editor.updateQuestion(question.id, { wrongReaction: e.target.value })}
                  placeholder="HOW do you not remember this?! 😂"
                  maxLength={MEMORY_QUIZ_LIMITS.REACTION_MAX_LENGTH}
                  className="h-9"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <Button
        type="button"
        variant="outline"
        onClick={editor.addQuestion}
        disabled={editor.questions.length >= MEMORY_QUIZ_LIMITS.MAX_QUESTIONS}
        className="w-full"
      >
        <Plus className="size-4" />
        Add Question
      </Button>

      <div className="flex flex-col gap-3">
        <h2 className="font-medium">Results</h2>
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex flex-col gap-3">
          {editor.resultTiers.map((tier) => (
            <motion.div key={tier.id} layout variants={staggerItem} className="bg-card shadow-soft flex flex-col gap-2 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    value={tier.minPercent}
                    onChange={(e) => editor.updateTier(tier.id, { minPercent: Math.max(0, Math.min(100, Number(e.target.value) || 0)) })}
                    className="h-9 w-16"
                  />
                  <span className="text-muted-foreground text-sm">%+</span>
                </div>
                <Input
                  value={tier.title}
                  onChange={(e) => editor.updateTier(tier.id, { title: e.target.value })}
                  placeholder="You know us so well"
                  maxLength={MEMORY_QUIZ_LIMITS.TIER_TITLE_MAX_LENGTH}
                  className="h-9 flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Remove result"
                  onClick={() => editor.removeTier(tier.id)}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
              <Textarea
                value={tier.message}
                onChange={(e) => editor.updateTier(tier.id, { message: e.target.value })}
                placeholder="You officially know us better than I expected."
                maxLength={MEMORY_QUIZ_LIMITS.TIER_MESSAGE_MAX_LENGTH}
                className="min-h-12 text-sm"
              />
            </motion.div>
          ))}
        </motion.div>
        <Button type="button" variant="outline" onClick={editor.addTier} disabled={editor.resultTiers.length >= MEMORY_QUIZ_LIMITS.MAX_TIERS}>
          <Plus className="size-4" />
          Add Result
        </Button>
      </div>

      <Dialog open={share.open} onOpenChange={share.setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Share this quiz</DialogTitle>
            <DialogDescription>Anyone with the link can take it. Only you have the edit link.</DialogDescription>
          </DialogHeader>
          <ShareLinks publicPath={`/gifts/memory-quiz/${editor.quiz.id}`} editPath={`/gifts/memory-quiz/edit/${editor.quiz.editToken}`} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

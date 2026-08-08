"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Check, ImagePlus, Loader2, Plus, Share2, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ShareLinks } from "@/features/story-editor/share-links";
import { useGatedShare } from "@/features/auth/use-gated-share";
import { QUIZ_LIMITS } from "@/types/gifts";
import { cn } from "@/lib/utils";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { useQuizEditor } from "./use-quiz-editor";
import type { RelationshipQuizData } from "@/types/gifts";

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

export function QuizEditor({ quiz, isSignedIn }: { quiz: RelationshipQuizData; isSignedIn: boolean }) {
  const editor = useQuizEditor(quiz);
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
          maxLength={QUIZ_LIMITS.GIFT_TITLE_MAX_LENGTH}
          placeholder="Untitled Quiz"
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
        <span className="text-3xl">❓</span>
        <p className="text-muted-foreground text-caption">
          {editor.questions.length}/{QUIZ_LIMITS.MAX_QUESTIONS} questions · at least {QUIZ_LIMITS.MIN_QUESTIONS} needed
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
              placeholder="What's my favorite dessert?"
              maxLength={QUIZ_LIMITS.PROMPT_MAX_LENGTH}
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

                  {option.photoUrl ? (
                    <div className="group relative size-9 shrink-0 overflow-hidden rounded-lg">
                      <Image src={option.photoUrl} alt="" fill unoptimized className="object-cover" />
                      <button
                        type="button"
                        aria-label="Remove photo"
                        onClick={() => editor.updateOption(question.id, option.id, { photoUrl: null })}
                        className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition-opacity group-hover:bg-black/40 group-hover:opacity-100"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      aria-label="Add photo"
                      onClick={() => requestPhoto((file) => editor.uploadOptionPhoto(question.id, option.id, file))}
                      disabled={editor.uploadingId === option.id}
                      className="bg-secondary hover:bg-secondary/70 flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors"
                    >
                      {editor.uploadingId === option.id ? (
                        <Loader2 className="text-muted-foreground size-3.5 animate-spin" />
                      ) : (
                        <ImagePlus className="text-muted-foreground size-3.5" />
                      )}
                    </button>
                  )}

                  <Input
                    value={option.label}
                    onChange={(e) => editor.updateOption(question.id, option.id, { label: e.target.value })}
                    placeholder="Option text"
                    maxLength={QUIZ_LIMITS.OPTION_LABEL_MAX_LENGTH}
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
                disabled={question.options.length >= QUIZ_LIMITS.MAX_OPTIONS}
                className="self-start"
              >
                <Plus className="size-3.5" />
                Add Option
              </Button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <Button type="button" variant="outline" onClick={editor.addQuestion} disabled={editor.questions.length >= QUIZ_LIMITS.MAX_QUESTIONS} className="w-full">
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
                  placeholder="You definitely know me ❤️"
                  maxLength={QUIZ_LIMITS.TIER_TITLE_MAX_LENGTH}
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
                placeholder="Okay, I'm impressed."
                maxLength={QUIZ_LIMITS.TIER_MESSAGE_MAX_LENGTH}
                className="min-h-12 text-sm"
              />
            </motion.div>
          ))}
        </motion.div>
        <Button type="button" variant="outline" onClick={editor.addTier} disabled={editor.resultTiers.length >= QUIZ_LIMITS.MAX_TIERS}>
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
          <ShareLinks publicPath={`/gifts/how-well-do-you-know-me/${editor.quiz.id}`} editPath={`/gifts/how-well-do-you-know-me/edit/${editor.quiz.editToken}`} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Sparkles, X } from "lucide-react";
import { ConfettiBurst } from "../confetti-burst";
import { CountUp } from "../count-up";
import type { QuizResultTier, RelationshipQuizData } from "@/types/gifts";

function bestTier(tiers: QuizResultTier[], percent: number): QuizResultTier | undefined {
  return [...tiers].sort((a, b) => b.minPercent - a.minPercent).find((t) => percent >= t.minPercent);
}

type Answered = { optionId: string; correct: boolean };

export function QuizPlayer({ quiz }: { quiz: RelationshipQuizData }) {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<Answered | null>(null);
  const [finished, setFinished] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);

  const question = quiz.questions[index];
  const isLast = index === quiz.questions.length - 1;
  const percent = Math.round((score / quiz.questions.length) * 100);
  const tier = finished ? bestTier(quiz.resultTiers, percent) : undefined;

  function choose(optionId: string) {
    if (answered) return;
    const correct = optionId === question.correctOptionId;
    setAnswered({ optionId, correct });
    if (correct) setScore((s) => s + 1);

    window.setTimeout(() => {
      if (isLast) {
        setFinished(true);
        setConfettiKey((k) => k + 1);
      } else {
        setIndex((i) => i + 1);
        setAnswered(null);
      }
    }, 900);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-5 py-16">
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="text-3xl">❓</span>
        <h1 className="font-display text-section text-balance">{quiz.title}</h1>
      </div>

      {!finished ? (
        <div className="bg-secondary h-1.5 w-full max-w-sm overflow-hidden rounded-full">
          <motion.div
            className="bg-primary h-full rounded-full"
            animate={{ width: `${(index / quiz.questions.length) * 100}%` }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      ) : null}

      <AnimatePresence mode="wait">
        {!finished ? (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="bg-card shadow-soft-xl flex w-full max-w-sm flex-col items-center gap-5 rounded-3xl p-8 text-center"
          >
            <span className="text-muted-foreground text-meta font-medium tracking-wide uppercase">
              Question {index + 1} of {quiz.questions.length}
            </span>
            <p className="font-display text-card-title text-balance">{question.prompt}</p>

            <div className="flex w-full flex-col gap-2.5">
              {question.options.map((option) => {
                const isChosen = answered?.optionId === option.id;
                const isCorrectOption = option.id === question.correctOptionId;
                const showCorrect = answered ? isCorrectOption : false;
                const showWrong = answered ? isChosen && !answered.correct : false;

                return (
                  <motion.button
                    key={option.id}
                    type="button"
                    onClick={() => choose(option.id)}
                    disabled={Boolean(answered)}
                    animate={showWrong ? { x: [0, -8, 8, -6, 6, 0] } : {}}
                    transition={{ duration: 0.4 }}
                    className={`flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-colors ${
                      showCorrect
                        ? "border-primary bg-accent"
                        : showWrong
                          ? "border-destructive bg-destructive/10"
                          : "border-transparent bg-secondary/60"
                    }`}
                  >
                    {option.photoUrl ? (
                      <div className="relative size-10 shrink-0 overflow-hidden rounded-lg">
                        <Image src={option.photoUrl} alt="" fill unoptimized className="object-cover" />
                      </div>
                    ) : null}
                    <span className="flex-1 text-sm font-medium">{option.label}</span>
                    {showCorrect ? <Check className="text-primary-active size-4 shrink-0" /> : null}
                    {showWrong ? <X className="text-destructive size-4 shrink-0" /> : null}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="bg-card shadow-soft-xl relative flex w-full max-w-sm flex-col items-center gap-4 overflow-hidden rounded-3xl p-8 text-center"
          >
            <ConfettiBurst triggerKey={confettiKey} />
            <p className="font-display flex items-baseline gap-1 text-5xl">
              <CountUp value={score} />
              <span className="text-muted-foreground text-2xl">/{quiz.questions.length}</span>
            </p>
            {tier ? (
              <>
                <p className="font-script text-primary-active text-3xl text-balance">{tier.title}</p>
                <p className="text-muted-foreground text-caption text-balance">{tier.message}</p>
              </>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-muted-foreground flex items-center gap-1.5 text-meta">
        <Sparkles className="size-3.5" />
        Made with FizzMoments
      </p>
    </div>
  );
}

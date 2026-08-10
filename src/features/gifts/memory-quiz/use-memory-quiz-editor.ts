"use client";

import { useState } from "react";
import { toast } from "sonner";
import { saveMemoryQuizAction } from "@/actions/gift-actions";
import { MEMORY_QUIZ_LIMITS } from "@/types/gifts";
import type { MemoryQuizData, MemoryQuizOption, MemoryQuizQuestion, MemoryQuizResultTier } from "@/types/gifts";

function blankOption(): MemoryQuizOption {
  return { id: crypto.randomUUID(), label: "" };
}

function blankQuestion(): MemoryQuizQuestion {
  const options = [blankOption(), blankOption()];
  return {
    id: crypto.randomUUID(),
    prompt: "",
    options,
    correctOptionId: options[0].id,
    correctReaction: "Okayyy you actually remember 😭❤️",
    wrongReaction: "HOW do you not remember this?! 😂",
  };
}

function blankTier(): MemoryQuizResultTier {
  return { id: crypto.randomUUID(), minPercent: 0, title: "", message: "" };
}

export function useMemoryQuizEditor(quiz: MemoryQuizData) {
  const [title, setTitle] = useState(quiz.title);
  const [questions, setQuestions] = useState<MemoryQuizQuestion[]>(quiz.questions);
  const [resultTiers, setResultTiers] = useState<MemoryQuizResultTier[]>(quiz.resultTiers);
  const [isSaving, setIsSaving] = useState(false);

  function addQuestion() {
    if (questions.length >= MEMORY_QUIZ_LIMITS.MAX_QUESTIONS) {
      toast.error(`You can add up to ${MEMORY_QUIZ_LIMITS.MAX_QUESTIONS} questions.`);
      return;
    }
    setQuestions((prev) => [...prev, blankQuestion()]);
  }

  function removeQuestion(id: string) {
    if (questions.length <= MEMORY_QUIZ_LIMITS.MIN_QUESTIONS) {
      toast.error(`Keep at least ${MEMORY_QUIZ_LIMITS.MIN_QUESTIONS} questions.`);
      return;
    }
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  }

  function updateQuestion(id: string, patch: Partial<Omit<MemoryQuizQuestion, "id" | "options">>) {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  }

  function addOption(questionId: string) {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== questionId) return q;
        if (q.options.length >= MEMORY_QUIZ_LIMITS.MAX_OPTIONS) {
          toast.error(`Keep it to ${MEMORY_QUIZ_LIMITS.MAX_OPTIONS} options per question.`);
          return q;
        }
        return { ...q, options: [...q.options, blankOption()] };
      }),
    );
  }

  function removeOption(questionId: string, optionId: string) {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== questionId) return q;
        if (q.options.length <= MEMORY_QUIZ_LIMITS.MIN_OPTIONS) {
          toast.error(`Each question needs at least ${MEMORY_QUIZ_LIMITS.MIN_OPTIONS} options.`);
          return q;
        }
        const options = q.options.filter((o) => o.id !== optionId);
        const correctOptionId = q.correctOptionId === optionId ? options[0].id : q.correctOptionId;
        return { ...q, options, correctOptionId };
      }),
    );
  }

  function updateOption(questionId: string, optionId: string, label: string) {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId ? { ...q, options: q.options.map((o) => (o.id === optionId ? { ...o, label } : o)) } : q,
      ),
    );
  }

  function addTier() {
    if (resultTiers.length >= MEMORY_QUIZ_LIMITS.MAX_TIERS) {
      toast.error(`You can add up to ${MEMORY_QUIZ_LIMITS.MAX_TIERS} results.`);
      return;
    }
    setResultTiers((prev) => [...prev, blankTier()]);
  }

  function removeTier(id: string) {
    if (resultTiers.length <= MEMORY_QUIZ_LIMITS.MIN_TIERS) {
      toast.error(`Keep at least ${MEMORY_QUIZ_LIMITS.MIN_TIERS} result.`);
      return;
    }
    setResultTiers((prev) => prev.filter((t) => t.id !== id));
  }

  function updateTier(id: string, patch: Partial<Omit<MemoryQuizResultTier, "id">>) {
    setResultTiers((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }

  async function save() {
    setIsSaving(true);
    const result = await saveMemoryQuizAction({ editToken: quiz.editToken, title, questions, resultTiers });
    setIsSaving(false);
    if (!result.success) {
      toast.error(result.error);
      return false;
    }
    toast.success("Saved!");
    return true;
  }

  return {
    quiz,
    title,
    setTitle,
    questions,
    addQuestion,
    removeQuestion,
    updateQuestion,
    addOption,
    removeOption,
    updateOption,
    resultTiers,
    addTier,
    removeTier,
    updateTier,
    isSaving,
    save,
  };
}

export type MemoryQuizEditor = ReturnType<typeof useMemoryQuizEditor>;

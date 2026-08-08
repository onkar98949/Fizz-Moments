"use client";

import { useState } from "react";
import { toast } from "sonner";
import { saveRelationshipQuizAction } from "@/actions/gift-actions";
import { uploadPhotoAction } from "@/actions/photo-actions";
import { QUIZ_LIMITS } from "@/types/gifts";
import type { QuizOption, QuizQuestion, QuizResultTier, RelationshipQuizData } from "@/types/gifts";

function blankOption(): QuizOption {
  return { id: crypto.randomUUID(), label: "", photoUrl: null };
}

function blankQuestion(): QuizQuestion {
  const options = [blankOption(), blankOption()];
  return { id: crypto.randomUUID(), prompt: "", options, correctOptionId: options[0].id };
}

function blankTier(): QuizResultTier {
  return { id: crypto.randomUUID(), minPercent: 0, title: "", message: "" };
}

export function useQuizEditor(quiz: RelationshipQuizData) {
  const [title, setTitle] = useState(quiz.title);
  const [questions, setQuestions] = useState<QuizQuestion[]>(quiz.questions);
  const [resultTiers, setResultTiers] = useState<QuizResultTier[]>(quiz.resultTiers);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  function addQuestion() {
    if (questions.length >= QUIZ_LIMITS.MAX_QUESTIONS) {
      toast.error(`You can add up to ${QUIZ_LIMITS.MAX_QUESTIONS} questions.`);
      return;
    }
    setQuestions((prev) => [...prev, blankQuestion()]);
  }

  function removeQuestion(id: string) {
    if (questions.length <= QUIZ_LIMITS.MIN_QUESTIONS) {
      toast.error(`Keep at least ${QUIZ_LIMITS.MIN_QUESTIONS} questions.`);
      return;
    }
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  }

  function updateQuestion(id: string, patch: Partial<Omit<QuizQuestion, "id" | "options">>) {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  }

  function addOption(questionId: string) {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== questionId) return q;
        if (q.options.length >= QUIZ_LIMITS.MAX_OPTIONS) {
          toast.error(`Keep it to ${QUIZ_LIMITS.MAX_OPTIONS} options per question.`);
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
        if (q.options.length <= QUIZ_LIMITS.MIN_OPTIONS) {
          toast.error(`Each question needs at least ${QUIZ_LIMITS.MIN_OPTIONS} options.`);
          return q;
        }
        const options = q.options.filter((o) => o.id !== optionId);
        const correctOptionId = q.correctOptionId === optionId ? options[0].id : q.correctOptionId;
        return { ...q, options, correctOptionId };
      }),
    );
  }

  function updateOption(questionId: string, optionId: string, patch: Partial<Omit<QuizOption, "id">>) {
    setQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, options: q.options.map((o) => (o.id === optionId ? { ...o, ...patch } : o)) } : q)),
    );
  }

  async function uploadOptionPhoto(questionId: string, optionId: string, file: File) {
    setUploadingId(optionId);
    const formData = new FormData();
    formData.append("file", file);
    const result = await uploadPhotoAction(formData);
    if (result.success) {
      updateOption(questionId, optionId, { photoUrl: result.url });
    } else {
      toast.error(result.error);
    }
    setUploadingId(null);
  }

  function addTier() {
    if (resultTiers.length >= QUIZ_LIMITS.MAX_TIERS) {
      toast.error(`You can add up to ${QUIZ_LIMITS.MAX_TIERS} results.`);
      return;
    }
    setResultTiers((prev) => [...prev, blankTier()]);
  }

  function removeTier(id: string) {
    if (resultTiers.length <= QUIZ_LIMITS.MIN_TIERS) {
      toast.error(`Keep at least ${QUIZ_LIMITS.MIN_TIERS} result.`);
      return;
    }
    setResultTiers((prev) => prev.filter((t) => t.id !== id));
  }

  function updateTier(id: string, patch: Partial<Omit<QuizResultTier, "id">>) {
    setResultTiers((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }

  async function save() {
    setIsSaving(true);
    const result = await saveRelationshipQuizAction({ editToken: quiz.editToken, title, questions, resultTiers });
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
    uploadOptionPhoto,
    uploadingId,
    resultTiers,
    addTier,
    removeTier,
    updateTier,
    isSaving,
    save,
  };
}

export type QuizEditor = ReturnType<typeof useQuizEditor>;

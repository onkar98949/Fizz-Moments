"use client";

import { useState } from "react";
import { toast } from "sonner";
import { saveDateGeneratorAction } from "@/actions/gift-actions";
import { DATE_GENERATOR_LIMITS } from "@/types/gifts";
import type { DateGeneratorData, DateIdea } from "@/types/gifts";

function blankIdea(): DateIdea {
  return { id: crypto.randomUUID(), text: "", budget: "Free", difficulty: "Easy", timeEstimate: "" };
}

export function useDateGeneratorEditor(generator: DateGeneratorData) {
  const [title, setTitle] = useState(generator.title);
  const [ideas, setIdeas] = useState<DateIdea[]>(generator.ideas);
  const [isSaving, setIsSaving] = useState(false);

  function addIdea() {
    if (ideas.length >= DATE_GENERATOR_LIMITS.MAX_IDEAS) {
      toast.error(`You can add up to ${DATE_GENERATOR_LIMITS.MAX_IDEAS} ideas.`);
      return;
    }
    setIdeas((prev) => [...prev, blankIdea()]);
  }

  function removeIdea(id: string) {
    if (ideas.length <= DATE_GENERATOR_LIMITS.MIN_IDEAS) {
      toast.error(`Keep at least ${DATE_GENERATOR_LIMITS.MIN_IDEAS} ideas.`);
      return;
    }
    setIdeas((prev) => prev.filter((i) => i.id !== id));
  }

  function updateIdea(id: string, patch: Partial<Omit<DateIdea, "id">>) {
    setIdeas((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }

  async function save() {
    setIsSaving(true);
    const result = await saveDateGeneratorAction({ editToken: generator.editToken, title, ideas });
    setIsSaving(false);
    if (!result.success) {
      toast.error(result.error);
      return false;
    }
    toast.success("Saved!");
    return true;
  }

  return { generator, title, setTitle, ideas, addIdea, removeIdea, updateIdea, isSaving, save };
}

export type DateGeneratorEditor = ReturnType<typeof useDateGeneratorEditor>;

"use client";

import { useState } from "react";
import { toast } from "sonner";
import { saveFortuneCookieAction } from "@/actions/gift-actions";
import { FORTUNE_COOKIE_LIMITS } from "@/types/gifts";
import type { Fortune, FortuneCookieData } from "@/types/gifts";

function blankFortune(): Fortune {
  return { id: crypto.randomUUID(), text: "" };
}

export function useFortuneCookieEditor(cookie: FortuneCookieData) {
  const [title, setTitle] = useState(cookie.title);
  const [recipientName, setRecipientName] = useState(cookie.recipientName);
  const [fortunes, setFortunes] = useState<Fortune[]>(cookie.fortunes);
  const [isSaving, setIsSaving] = useState(false);

  function addFortune() {
    if (fortunes.length >= FORTUNE_COOKIE_LIMITS.MAX_FORTUNES) {
      toast.error(`You can add up to ${FORTUNE_COOKIE_LIMITS.MAX_FORTUNES} fortunes.`);
      return;
    }
    setFortunes((prev) => [...prev, blankFortune()]);
  }

  function removeFortune(id: string) {
    if (fortunes.length <= FORTUNE_COOKIE_LIMITS.MIN_FORTUNES) {
      toast.error(`Keep at least ${FORTUNE_COOKIE_LIMITS.MIN_FORTUNES} fortune.`);
      return;
    }
    setFortunes((prev) => prev.filter((f) => f.id !== id));
  }

  function updateFortune(id: string, text: string) {
    setFortunes((prev) => prev.map((f) => (f.id === id ? { ...f, text } : f)));
  }

  async function save() {
    setIsSaving(true);
    const result = await saveFortuneCookieAction({ editToken: cookie.editToken, title, recipientName, fortunes });
    setIsSaving(false);
    if (!result.success) {
      toast.error(result.error);
      return false;
    }
    toast.success("Saved!");
    return true;
  }

  return {
    cookie,
    title,
    setTitle,
    recipientName,
    setRecipientName,
    fortunes,
    addFortune,
    removeFortune,
    updateFortune,
    isSaving,
    save,
  };
}

export type FortuneCookieEditor = ReturnType<typeof useFortuneCookieEditor>;

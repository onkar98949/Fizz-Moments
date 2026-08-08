"use client";

import { useState } from "react";
import { toast } from "sonner";
import { saveScratchCardGiftAction } from "@/actions/gift-actions";
import { uploadPhotoAction } from "@/actions/photo-actions";
import { SCRATCH_CARD_LIMITS } from "@/types/gifts";
import type { ScratchCard, ScratchCardGiftData } from "@/types/gifts";

function blankCard(): ScratchCard {
  return { id: crypto.randomUUID(), title: "", reward: "", photoUrl: null };
}

export function useScratchCardEditor(gift: ScratchCardGiftData) {
  const [title, setTitle] = useState(gift.title);
  const [cards, setCards] = useState<ScratchCard[]>(gift.cards);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  function addCard() {
    if (cards.length >= SCRATCH_CARD_LIMITS.MAX_CARDS) {
      toast.error(`You can add up to ${SCRATCH_CARD_LIMITS.MAX_CARDS} cards.`);
      return;
    }
    setCards((prev) => [...prev, blankCard()]);
  }

  function removeCard(id: string) {
    if (cards.length <= SCRATCH_CARD_LIMITS.MIN_CARDS) {
      toast.error(`Keep at least ${SCRATCH_CARD_LIMITS.MIN_CARDS} cards.`);
      return;
    }
    setCards((prev) => prev.filter((c) => c.id !== id));
  }

  function updateCard(id: string, patch: Partial<Omit<ScratchCard, "id">>) {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  function moveCard(id: string, direction: -1 | 1) {
    setCards((prev) => {
      const index = prev.findIndex((c) => c.id === id);
      const nextIndex = index + direction;
      if (index === -1 || nextIndex < 0 || nextIndex >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  }

  async function uploadCardPhoto(id: string, file: File) {
    setUploadingId(id);
    const formData = new FormData();
    formData.append("file", file);
    const result = await uploadPhotoAction(formData);
    if (result.success) {
      updateCard(id, { photoUrl: result.url });
    } else {
      toast.error(result.error);
    }
    setUploadingId(null);
  }

  async function save() {
    setIsSaving(true);
    const result = await saveScratchCardGiftAction({ editToken: gift.editToken, title, cards });
    setIsSaving(false);
    if (!result.success) {
      toast.error(result.error);
      return false;
    }
    toast.success("Saved!");
    return true;
  }

  return {
    gift,
    title,
    setTitle,
    cards,
    addCard,
    removeCard,
    updateCard,
    moveCard,
    uploadCardPhoto,
    uploadingId,
    isSaving,
    save,
  };
}

export type ScratchCardEditor = ReturnType<typeof useScratchCardEditor>;

"use client";

import { useState } from "react";
import { toast } from "sonner";
import { saveTreasureHuntAction } from "@/actions/gift-actions";
import { uploadPhotoAction } from "@/actions/photo-actions";
import { TREASURE_HUNT_LIMITS } from "@/types/gifts";
import type { TreasureHuntClue, TreasureHuntData } from "@/types/gifts";

function blankClue(): TreasureHuntClue {
  return { id: crypto.randomUUID(), text: "", hint: null, photoUrl: null, code: "" };
}

export function useTreasureHuntEditor(hunt: TreasureHuntData) {
  const [title, setTitle] = useState(hunt.title);
  const [clues, setClues] = useState<TreasureHuntClue[]>(hunt.clues);
  const [finalMessage, setFinalMessage] = useState(hunt.finalMessage);
  const [finalPhotoUrl, setFinalPhotoUrl] = useState<string | null>(hunt.finalPhotoUrl);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  function addClue() {
    if (clues.length >= TREASURE_HUNT_LIMITS.MAX_CLUES) {
      toast.error(`You can add up to ${TREASURE_HUNT_LIMITS.MAX_CLUES} clues.`);
      return;
    }
    setClues((prev) => [...prev, blankClue()]);
  }

  function removeClue(id: string) {
    if (clues.length <= TREASURE_HUNT_LIMITS.MIN_CLUES) {
      toast.error(`Keep at least ${TREASURE_HUNT_LIMITS.MIN_CLUES} clue.`);
      return;
    }
    setClues((prev) => prev.filter((c) => c.id !== id));
  }

  function updateClue(id: string, patch: Partial<Omit<TreasureHuntClue, "id">>) {
    setClues((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  function moveClue(id: string, direction: -1 | 1) {
    setClues((prev) => {
      const index = prev.findIndex((c) => c.id === id);
      const nextIndex = index + direction;
      if (index === -1 || nextIndex < 0 || nextIndex >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  }

  async function uploadCluePhoto(id: string, file: File) {
    setUploadingId(id);
    const formData = new FormData();
    formData.append("file", file);
    const result = await uploadPhotoAction(formData);
    if (result.success) {
      updateClue(id, { photoUrl: result.url });
    } else {
      toast.error(result.error);
    }
    setUploadingId(null);
  }

  async function uploadFinalPhoto(file: File) {
    setUploadingId("__final__");
    const formData = new FormData();
    formData.append("file", file);
    const result = await uploadPhotoAction(formData);
    if (result.success) {
      setFinalPhotoUrl(result.url);
    } else {
      toast.error(result.error);
    }
    setUploadingId(null);
  }

  async function save() {
    setIsSaving(true);
    const result = await saveTreasureHuntAction({
      editToken: hunt.editToken,
      title,
      clues,
      finalMessage,
      finalPhotoUrl,
    });
    setIsSaving(false);
    if (!result.success) {
      toast.error(result.error);
      return false;
    }
    toast.success("Saved!");
    return true;
  }

  return {
    hunt,
    title,
    setTitle,
    clues,
    addClue,
    removeClue,
    updateClue,
    moveClue,
    uploadCluePhoto,
    finalMessage,
    setFinalMessage,
    finalPhotoUrl,
    setFinalPhotoUrl,
    uploadFinalPhoto,
    uploadingId,
    isSaving,
    save,
  };
}

export type TreasureHuntEditor = ReturnType<typeof useTreasureHuntEditor>;

"use client";

import { useState } from "react";
import { toast } from "sonner";
import { saveOpenWhenCollectionAction } from "@/actions/gift-actions";
import { uploadPhotoAction } from "@/actions/photo-actions";
import { OPEN_WHEN_LIMITS } from "@/types/gifts";
import type { OpenWhenCollectionData, OpenWhenLetter } from "@/types/gifts";

function blankLetter(): OpenWhenLetter {
  return { id: crypto.randomUUID(), label: "", emoji: "💌", message: "", photoUrl: null, opened: false };
}

export function useOpenWhenEditor(collection: OpenWhenCollectionData) {
  const [title, setTitle] = useState(collection.title);
  const [letters, setLetters] = useState<OpenWhenLetter[]>(collection.letters);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  function addLetter() {
    if (letters.length >= OPEN_WHEN_LIMITS.MAX_LETTERS) {
      toast.error(`You can add up to ${OPEN_WHEN_LIMITS.MAX_LETTERS} letters.`);
      return;
    }
    setLetters((prev) => [...prev, blankLetter()]);
  }

  function removeLetter(id: string) {
    if (letters.length <= OPEN_WHEN_LIMITS.MIN_LETTERS) {
      toast.error(`Keep at least ${OPEN_WHEN_LIMITS.MIN_LETTERS} letters.`);
      return;
    }
    setLetters((prev) => prev.filter((l) => l.id !== id));
  }

  function updateLetter(id: string, patch: Partial<Omit<OpenWhenLetter, "id" | "opened">>) {
    setLetters((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }

  async function uploadLetterPhoto(id: string, file: File) {
    setUploadingId(id);
    const formData = new FormData();
    formData.append("file", file);
    const result = await uploadPhotoAction(formData);
    if (result.success) {
      updateLetter(id, { photoUrl: result.url });
    } else {
      toast.error(result.error);
    }
    setUploadingId(null);
  }

  async function save() {
    setIsSaving(true);
    const result = await saveOpenWhenCollectionAction({ editToken: collection.editToken, title, letters });
    setIsSaving(false);
    if (!result.success) {
      toast.error(result.error);
      return false;
    }
    toast.success("Saved!");
    return true;
  }

  return {
    collection,
    title,
    setTitle,
    letters,
    addLetter,
    removeLetter,
    updateLetter,
    uploadLetterPhoto,
    uploadingId,
    isSaving,
    save,
  };
}

export type OpenWhenEditor = ReturnType<typeof useOpenWhenEditor>;

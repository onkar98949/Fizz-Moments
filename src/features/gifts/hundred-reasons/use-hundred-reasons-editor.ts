"use client";

import { useState } from "react";
import { toast } from "sonner";
import { saveHundredReasonsAction } from "@/actions/gift-actions";
import { uploadPhotoAction } from "@/actions/photo-actions";
import { HUNDRED_REASONS_LIMITS } from "@/types/gifts";
import type { HundredReasonsData, LoveReason } from "@/types/gifts";

function blankReason(): LoveReason {
  return { id: crypto.randomUUID(), text: "", photoUrl: null };
}

export function useHundredReasonsEditor(gift: HundredReasonsData) {
  const [title, setTitle] = useState(gift.title);
  const [reasons, setReasons] = useState<LoveReason[]>(gift.reasons);
  const [finalMessage, setFinalMessage] = useState(gift.finalMessage ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  function addReason() {
    if (reasons.length >= HUNDRED_REASONS_LIMITS.MAX_REASONS) {
      toast.error(`You can add up to ${HUNDRED_REASONS_LIMITS.MAX_REASONS} reasons.`);
      return;
    }
    setReasons((prev) => [...prev, blankReason()]);
  }

  function removeReason(id: string) {
    if (reasons.length <= HUNDRED_REASONS_LIMITS.MIN_REASONS) {
      toast.error(`Keep at least ${HUNDRED_REASONS_LIMITS.MIN_REASONS} reasons.`);
      return;
    }
    setReasons((prev) => prev.filter((r) => r.id !== id));
  }

  function updateReason(id: string, text: string) {
    setReasons((prev) => prev.map((r) => (r.id === id ? { ...r, text } : r)));
  }

  async function uploadReasonPhoto(id: string, file: File) {
    setUploadingId(id);
    const formData = new FormData();
    formData.append("file", file);
    const result = await uploadPhotoAction(formData);
    if (result.success) {
      setReasons((prev) => prev.map((r) => (r.id === id ? { ...r, photoUrl: result.url } : r)));
    } else {
      toast.error(result.error);
    }
    setUploadingId(null);
  }

  function removeReasonPhoto(id: string) {
    setReasons((prev) => prev.map((r) => (r.id === id ? { ...r, photoUrl: null } : r)));
  }

  async function save() {
    setIsSaving(true);
    const result = await saveHundredReasonsAction({
      editToken: gift.editToken,
      title,
      reasons,
      finalMessage: finalMessage.trim() || null,
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
    gift,
    title,
    setTitle,
    reasons,
    addReason,
    removeReason,
    updateReason,
    uploadReasonPhoto,
    removeReasonPhoto,
    uploadingId,
    finalMessage,
    setFinalMessage,
    isSaving,
    save,
  };
}

export type HundredReasonsEditor = ReturnType<typeof useHundredReasonsEditor>;

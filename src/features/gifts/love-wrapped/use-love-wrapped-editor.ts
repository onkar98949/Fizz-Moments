"use client";

import { useState } from "react";
import { toast } from "sonner";
import { saveLoveWrappedAction } from "@/actions/gift-actions";
import { uploadPhotoAction } from "@/actions/photo-actions";
import { LOVE_WRAPPED_LIMITS } from "@/types/gifts";
import type { LoveWrappedData, WrappedMoment, WrappedStat } from "@/types/gifts";

function blankStat(): WrappedStat {
  return { id: crypto.randomUUID(), emoji: "✨", label: "", value: 0 };
}

function blankMoment(): WrappedMoment {
  return { id: crypto.randomUUID(), emoji: "❤️", label: "", text: "", photoUrl: null };
}

export function useLoveWrappedEditor(wrapped: LoveWrappedData) {
  const [title, setTitle] = useState(wrapped.title);
  const [startDate, setStartDate] = useState(wrapped.startDate.slice(0, 10));
  const [stats, setStats] = useState<WrappedStat[]>(wrapped.stats);
  const [moments, setMoments] = useState<WrappedMoment[]>(wrapped.moments);
  const [closingMessage, setClosingMessage] = useState(wrapped.closingMessage);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  function addStat() {
    if (stats.length >= LOVE_WRAPPED_LIMITS.MAX_STATS) {
      toast.error(`You can add up to ${LOVE_WRAPPED_LIMITS.MAX_STATS} stats.`);
      return;
    }
    setStats((prev) => [...prev, blankStat()]);
  }

  function removeStat(id: string) {
    if (stats.length <= LOVE_WRAPPED_LIMITS.MIN_STATS) {
      toast.error(`Keep at least ${LOVE_WRAPPED_LIMITS.MIN_STATS} stat.`);
      return;
    }
    setStats((prev) => prev.filter((s) => s.id !== id));
  }

  function updateStat(id: string, patch: Partial<Omit<WrappedStat, "id">>) {
    setStats((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  function addMoment() {
    if (moments.length >= LOVE_WRAPPED_LIMITS.MAX_MOMENTS) {
      toast.error(`You can add up to ${LOVE_WRAPPED_LIMITS.MAX_MOMENTS} moments.`);
      return;
    }
    setMoments((prev) => [...prev, blankMoment()]);
  }

  function removeMoment(id: string) {
    if (moments.length <= LOVE_WRAPPED_LIMITS.MIN_MOMENTS) {
      toast.error(`Keep at least ${LOVE_WRAPPED_LIMITS.MIN_MOMENTS} moment.`);
      return;
    }
    setMoments((prev) => prev.filter((m) => m.id !== id));
  }

  function updateMoment(id: string, patch: Partial<Omit<WrappedMoment, "id">>) {
    setMoments((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  }

  function moveMoment(id: string, direction: -1 | 1) {
    setMoments((prev) => {
      const index = prev.findIndex((m) => m.id === id);
      const nextIndex = index + direction;
      if (index === -1 || nextIndex < 0 || nextIndex >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  }

  async function uploadMomentPhoto(id: string, file: File) {
    setUploadingId(id);
    const formData = new FormData();
    formData.append("file", file);
    const result = await uploadPhotoAction(formData);
    if (result.success) {
      updateMoment(id, { photoUrl: result.url });
    } else {
      toast.error(result.error);
    }
    setUploadingId(null);
  }

  async function save() {
    setIsSaving(true);
    const result = await saveLoveWrappedAction({
      editToken: wrapped.editToken,
      title,
      startDate: new Date(startDate).toISOString(),
      stats,
      moments,
      closingMessage,
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
    wrapped,
    title,
    setTitle,
    startDate,
    setStartDate,
    stats,
    addStat,
    removeStat,
    updateStat,
    moments,
    addMoment,
    removeMoment,
    updateMoment,
    moveMoment,
    uploadMomentPhoto,
    uploadingId,
    closingMessage,
    setClosingMessage,
    isSaving,
    save,
  };
}

export type LoveWrappedEditor = ReturnType<typeof useLoveWrappedEditor>;

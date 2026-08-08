"use client";

import { useState } from "react";
import { toast } from "sonner";
import { saveGiftBoxAction } from "@/actions/gift-actions";
import { uploadPhotoAction } from "@/actions/photo-actions";
import type { GiftBoxData } from "@/types/gifts";

export function useGiftBoxEditor(box: GiftBoxData) {
  const [title, setTitle] = useState(box.title);
  const [message, setMessage] = useState(box.message);
  const [photoUrl, setPhotoUrl] = useState<string | null>(box.photoUrl);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  async function uploadPhoto(file: File) {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const result = await uploadPhotoAction(formData);
    if (result.success) {
      setPhotoUrl(result.url);
    } else {
      toast.error(result.error);
    }
    setIsUploading(false);
  }

  async function save() {
    setIsSaving(true);
    const result = await saveGiftBoxAction({ editToken: box.editToken, title, message, photoUrl });
    setIsSaving(false);
    if (!result.success) {
      toast.error(result.error);
      return false;
    }
    toast.success("Saved!");
    return true;
  }

  return { box, title, setTitle, message, setMessage, photoUrl, setPhotoUrl, uploadPhoto, isUploading, isSaving, save };
}

export type GiftBoxEditor = ReturnType<typeof useGiftBoxEditor>;

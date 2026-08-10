"use client";

import { useState } from "react";
import { toast } from "sonner";
import { saveSecretEnvelopeAction } from "@/actions/gift-actions";
import { uploadPhotoAction } from "@/actions/photo-actions";
import type { EnvelopeStyle, SecretEnvelopeData } from "@/types/gifts";

export function useSecretEnvelopeEditor(envelope: SecretEnvelopeData) {
  const [title, setTitle] = useState(envelope.title);
  const [style, setStyle] = useState<EnvelopeStyle>(envelope.style);
  const [recipientName, setRecipientName] = useState(envelope.recipientName);
  const [letterTitle, setLetterTitle] = useState(envelope.letterTitle);
  const [message, setMessage] = useState(envelope.message);
  const [senderName, setSenderName] = useState(envelope.senderName);
  const [photoUrl, setPhotoUrl] = useState<string | null>(envelope.photoUrl);
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
    const result = await saveSecretEnvelopeAction({
      editToken: envelope.editToken,
      title,
      style,
      recipientName,
      letterTitle,
      message,
      senderName,
      photoUrl,
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
    envelope,
    title,
    setTitle,
    style,
    setStyle,
    recipientName,
    setRecipientName,
    letterTitle,
    setLetterTitle,
    message,
    setMessage,
    senderName,
    setSenderName,
    photoUrl,
    setPhotoUrl,
    uploadPhoto,
    isUploading,
    isSaving,
    save,
  };
}

export type SecretEnvelopeEditor = ReturnType<typeof useSecretEnvelopeEditor>;

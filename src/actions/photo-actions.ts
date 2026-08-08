"use server";

import { randomUUID } from "crypto";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/heic"]);

export type UploadPhotoResult = { success: true; url: string } | { success: false; error: string };

export async function uploadPhotoAction(formData: FormData): Promise<UploadPhotoResult> {
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return { success: false, error: "No photo was provided." };
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return { success: false, error: "Please upload a JPG, PNG, WEBP, or HEIC photo." };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { success: false, error: "Photos must be under 10MB." };
  }

  const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET;
  if (!bucket) {
    return { success: false, error: "Storage isn't configured yet." };
  }

  const extension = file.name.split(".").pop() ?? "jpg";
  const path = `${randomUUID()}.${extension}`;

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType: file.type,
    cacheControl: "31536000",
  });

  if (error) {
    return { success: false, error: "That upload didn't go through. Please try again." };
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);

  return { success: true, url: data.publicUrl };
}

/**
 * Generic helpers that work across all 30+ scene types without a per-type
 * switch — every scene's `data` is plain JSON, so any string field whose key
 * looks photo-related (`photoUrl`, `finalImageUrl`, `posterUrl`, ...) is
 * treated as a photo. This is what lets the header's photo count and each
 * scene card's thumbnail/photo-count work for a scene type that doesn't
 * exist yet, with zero changes here when it's added.
 */
const PHOTO_KEY_PATTERN = /photo|image|poster/i;

function walk(data: unknown, onPhoto: (url: string) => void): void {
  if (data == null) return;
  if (Array.isArray(data)) {
    for (const item of data) walk(item, onPhoto);
    return;
  }
  if (typeof data === "object") {
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      if (typeof value === "string" && value.length > 0 && PHOTO_KEY_PATTERN.test(key)) {
        onPhoto(value);
      } else {
        walk(value, onPhoto);
      }
    }
  }
}

export function countPhotos(data: unknown): number {
  let count = 0;
  walk(data, () => {
    count += 1;
  });
  return count;
}

export function firstPhotoUrl(data: unknown): string | null {
  let found: string | null = null;
  walk(data, (url) => {
    if (!found) found = url;
  });
  return found;
}

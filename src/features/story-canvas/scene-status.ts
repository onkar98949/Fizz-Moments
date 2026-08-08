import { getSceneDefinition } from "@/scenes/registry";
import type { SceneInstance } from "@/types/story";

export type SceneStatus = { kind: "complete" } | { kind: "empty" } | { kind: "incomplete"; message: string };

/**
 * Reuses each scene's own `dataSchema` — every required field across every
 * scene already has a human-written zod message ("Add a photo for this
 * scene.", "Write your letter.", ...), so validating and reporting what's
 * missing needs zero per-scene-type logic here. A scene whose data still
 * exactly matches `defaultData()` is reported as "empty" rather than
 * surfacing whichever field happens to fail first.
 */
export function getSceneStatus(scene: SceneInstance): SceneStatus {
  const definition = getSceneDefinition(scene.scene);
  if (!definition) return { kind: "incomplete", message: "Unknown scene type" };

  const parsed = definition.config.dataSchema.safeParse(scene.data);
  if (parsed.success) return { kind: "complete" };

  const isUntouched = JSON.stringify(scene.data) === JSON.stringify(definition.config.defaultData());
  if (isUntouched) return { kind: "empty" };

  return { kind: "incomplete", message: parsed.error.issues[0]?.message ?? "Needs attention" };
}

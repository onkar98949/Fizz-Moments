"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { saveStoryAction } from "@/actions/story-actions";
import { isNextRedirectError } from "@/lib/utils";
import { getSceneDefinition } from "@/scenes/registry";
import type { SceneInstance, StoryData } from "@/types/story";
import { useAutosave } from "./use-autosave";

export function useStoryCanvas(initialStory: StoryData) {
  const [story, setStory] = useState(initialStory);
  const [title, setTitle] = useState(initialStory.title);
  const [subtitle, setSubtitle] = useState(initialStory.subtitle ?? "");
  const [recipientName, setRecipientName] = useState(initialStory.recipientName);
  const [music, setMusic] = useState<string | null>(initialStory.music);
  const [scenes, setScenes] = useState<SceneInstance[]>(initialStory.scenes);
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const selectedScene = scenes.find((s) => s.id === selectedSceneId) ?? null;

  const liveStory: StoryData = {
    ...story,
    title,
    subtitle: subtitle || null,
    recipientName,
    music,
    scenes,
  };

  const addScene = useCallback((sceneId: string) => {
    const def = getSceneDefinition(sceneId);
    if (!def) return;
    const instance = {
      id: crypto.randomUUID(),
      scene: sceneId,
      variant: def.config.defaultVariant,
      data: def.config.defaultData(),
    } as SceneInstance;
    setScenes((prev) => [...prev, instance]);
    setSelectedSceneId(instance.id);
  }, []);

  const updateSceneData = useCallback((id: string, data: unknown) => {
    setScenes((prev) => prev.map((s) => (s.id === id ? ({ ...s, data } as SceneInstance) : s)));
  }, []);

  const duplicateScene = useCallback((id: string) => {
    setScenes((prev) => {
      const index = prev.findIndex((s) => s.id === id);
      if (index === -1) return prev;
      const clone = { ...prev[index], id: crypto.randomUUID() } as SceneInstance;
      const next = [...prev];
      next.splice(index + 1, 0, clone);
      return next;
    });
  }, []);

  const deleteScene = useCallback((id: string) => {
    setScenes((prev) => prev.filter((s) => s.id !== id));
    setSelectedSceneId((cur) => (cur === id ? null : cur));
  }, []);

  const reorderScene = useCallback((id: string, direction: -1 | 1) => {
    setScenes((prev) => {
      const index = prev.findIndex((s) => s.id === id);
      const nextIndex = index + direction;
      if (index === -1 || nextIndex < 0 || nextIndex >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  }, []);

  const moveSceneToIndex = useCallback((id: string, toIndex: number) => {
    setScenes((prev) => {
      const fromIndex = prev.findIndex((s) => s.id === id);
      if (fromIndex === -1) return prev;
      const clamped = Math.max(0, Math.min(toIndex, prev.length - 1));
      if (clamped === fromIndex) return prev;
      const next = [...prev];
      const [item] = next.splice(fromIndex, 1);
      next.splice(clamped, 0, item);
      return next;
    });
  }, []);

  const save = useCallback(
    async (options?: { silent?: boolean }) => {
      setIsSaving(true);
      try {
        const result = await saveStoryAction({
          editToken: story.editToken,
          title: title.trim() || "Untitled Story",
          subtitle: subtitle.trim(),
          recipientName: recipientName.trim(),
          music,
          scenes,
        });
        if (!result.success) {
          if (!options?.silent) toast.error(result.error);
          return false;
        }
        setStory(result.data);
        if (!options?.silent) toast.success("Your story has been saved.");
        return true;
      } catch (error) {
        if (isNextRedirectError(error)) throw error;
        if (!options?.silent) toast.error("Something went wrong while saving. Please try again.");
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [story.editToken, title, subtitle, recipientName, music, scenes],
  );

  const autosaveSave = useCallback(() => save({ silent: true }), [save]);
  const { status: autosaveStatus, lastSavedAt } = useAutosave(autosaveSave, { title, subtitle, recipientName, music, scenes });

  return {
    story,
    liveStory,
    title,
    setTitle,
    subtitle,
    setSubtitle,
    recipientName,
    setRecipientName,
    music,
    setMusic,
    scenes,
    selectedSceneId,
    setSelectedSceneId,
    selectedScene,
    isLibraryOpen,
    setIsLibraryOpen,
    isPreviewOpen,
    setIsPreviewOpen,
    addScene,
    updateSceneData,
    duplicateScene,
    deleteScene,
    reorderScene,
    moveSceneToIndex,
    isSaving,
    autosaveStatus,
    lastSavedAt,
    save,
  };
}

export type StoryCanvas = ReturnType<typeof useStoryCanvas>;

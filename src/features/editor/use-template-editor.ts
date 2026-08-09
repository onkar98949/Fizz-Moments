"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { saveTemplateProjectAction } from "@/actions/template-actions";
import { uploadPhotoAction } from "@/actions/photo-actions";
import { createBlankScene, createElementId, createStickerElement, createTextElement } from "@/lib/template-scene-factory";
import { SCENE_LIMITS } from "@/constants/template";
import { isNextRedirectError } from "@/lib/utils";
import type { Scene, SceneBackground, SceneElement, TemplateProjectData, TextElement } from "@/types/template";
import type { ElementBox } from "./canvas-math";
import type { THEME_PRESETS } from "@/constants/template";

function cloneScenes(scenes: Scene[]): Scene[] {
  return structuredClone(scenes);
}

export function useTemplateEditor(initialProject: TemplateProjectData) {
  const [project, setProject] = useState(initialProject);
  const [title, setTitle] = useState(initialProject.title);
  const [music, setMusic] = useState<string | null>(initialProject.music);
  const [scenes, setScenes] = useState<Scene[]>(initialProject.scenes);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [past, setPast] = useState<Scene[][]>([]);
  const [future, setFuture] = useState<Scene[][]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const activeScene = scenes[activeSceneIndex];
  const selectedElement = activeScene?.elements.find((el) => el.id === selectedElementId) ?? null;

  const commit = useCallback(
    (updater: (current: Scene[]) => Scene[]) => {
      setScenes((current) => {
        setPast((p) => [...p, cloneScenes(current)]);
        setFuture([]);
        return updater(current);
      });
    },
    [],
  );

  const undo = useCallback(() => {
    setPast((p) => {
      if (p.length === 0) return p;
      const previous = p[p.length - 1];
      setFuture((f) => [cloneScenes(scenes), ...f]);
      setScenes(previous);
      return p.slice(0, -1);
    });
  }, [scenes]);

  const redo = useCallback(() => {
    setFuture((f) => {
      if (f.length === 0) return f;
      const next = f[0];
      setPast((p) => [...p, cloneScenes(scenes)]);
      setScenes(next);
      return f.slice(1);
    });
  }, [scenes]);

  function updateActiveSceneElements(mutate: (elements: SceneElement[]) => SceneElement[]) {
    commit((current) =>
      current.map((scene, index) => (index === activeSceneIndex ? { ...scene, elements: mutate(scene.elements) } : scene)),
    );
  }

  const commitElementBox = useCallback(
    (elementId: string, patch: Partial<ElementBox>) => {
      updateActiveSceneElements((elements) =>
        elements.map((el) => (el.id === elementId ? ({ ...el, ...patch } as SceneElement) : el)),
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeSceneIndex],
  );

  const updateElementProps = useCallback(
    (elementId: string, patch: Partial<TextElement>) => {
      updateActiveSceneElements((elements) =>
        elements.map((el) => (el.id === elementId && el.type === "text" ? { ...el, ...patch } : el)),
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeSceneIndex],
  );

  const addTextElement = useCallback(() => {
    const element = createTextElement();
    updateActiveSceneElements((elements) => [...elements, element]);
    setSelectedElementId(element.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSceneIndex]);

  const addStickerElement = useCallback(
    (emoji: string) => {
      const element = createStickerElement(emoji);
      updateActiveSceneElements((elements) => [...elements, element]);
      setSelectedElementId(element.id);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeSceneIndex],
  );

  const replaceImage = useCallback(
    async (elementId: string | null, file: File) => {
      setIsUploadingImage(true);
      const formData = new FormData();
      formData.set("file", file);
      const result = await uploadPhotoAction(formData);
      setIsUploadingImage(false);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      if (elementId) {
        updateActiveSceneElements((elements) =>
          elements.map((el) => (el.id === elementId && el.type === "image" ? { ...el, src: result.url } : el)),
        );
      } else {
        const image = {
          id: createElementId(),
          type: "image" as const,
          src: result.url,
          x: 10,
          y: 20,
          width: 80,
          height: 50,
          rotation: 0,
        };
        updateActiveSceneElements((elements) => [...elements, image]);
        setSelectedElementId(image.id);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeSceneIndex],
  );

  const deleteElement = useCallback(
    (elementId: string) => {
      updateActiveSceneElements((elements) => elements.filter((el) => el.id !== elementId));
      setSelectedElementId((current) => (current === elementId ? null : current));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeSceneIndex],
  );

  const setBackground = useCallback(
    (background: SceneBackground) => {
      commit((current) =>
        current.map((scene, index) => (index === activeSceneIndex ? { ...scene, background } : scene)),
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeSceneIndex],
  );

  const setSceneDuration = useCallback(
    (durationMs: number) => {
      commit((current) =>
        current.map((scene, index) => (index === activeSceneIndex ? { ...scene, durationMs } : scene)),
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeSceneIndex],
  );

  /** Applies across every scene in one commit — a single undo step, not one
   *  per scene — since it's conceptually one action ("switch to Dreamy"),
   *  not N background changes the user happened to make in a row. */
  const applyTheme = useCallback((theme: (typeof THEME_PRESETS)[number]) => {
    commit((current) =>
      current.map((scene) => ({
        ...scene,
        background: theme.background,
        elements: scene.elements.map((el) =>
          el.type === "text" ? { ...el, color: theme.textColor, fontFamily: theme.fontFamily } : el,
        ),
      })),
    );
  }, [commit]);

  const addScene = useCallback(() => {
    if (scenes.length >= SCENE_LIMITS.MAX_SCENES) {
      toast.error(`You can have up to ${SCENE_LIMITS.MAX_SCENES} scenes.`);
      return;
    }
    const scene = createBlankScene();
    commit((current) => [...current, scene]);
    setActiveSceneIndex(scenes.length);
    setSelectedElementId(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenes.length]);

  const duplicateScene = useCallback(
    (sceneId: string) => {
      if (scenes.length >= SCENE_LIMITS.MAX_SCENES) {
        toast.error(`You can have up to ${SCENE_LIMITS.MAX_SCENES} scenes.`);
        return;
      }
      commit((current) => {
        const index = current.findIndex((s) => s.id === sceneId);
        if (index === -1) return current;
        const clone: Scene = {
          ...structuredClone(current[index]),
          id: createElementId(),
        };
        clone.elements = clone.elements.map((el) => ({ ...el, id: createElementId() }));
        const next = [...current];
        next.splice(index + 1, 0, clone);
        return next;
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scenes.length],
  );

  const deleteScene = useCallback(
    (sceneId: string) => {
      if (scenes.length <= SCENE_LIMITS.MIN_SCENES) {
        toast.error("Your project needs at least one scene.");
        return;
      }
      commit((current) => current.filter((s) => s.id !== sceneId));
      setActiveSceneIndex((i) => Math.max(0, Math.min(i, scenes.length - 2)));
      setSelectedElementId(null);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scenes.length],
  );

  const reorderScene = useCallback((sceneId: string, direction: -1 | 1) => {
    commit((current) => {
      const index = current.findIndex((s) => s.id === sceneId);
      const nextIndex = index + direction;
      if (index === -1 || nextIndex < 0 || nextIndex >= current.length) return current;
      const next = [...current];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      setActiveSceneIndex(nextIndex);
      return next;
    });
  }, [commit]);

  const save = useCallback(async () => {
    setIsSaving(true);
    try {
      const result = await saveTemplateProjectAction({
        editToken: project.editToken,
        title: title.trim() || "Untitled",
        music,
        scenes,
      });
      if (!result.success) {
        toast.error(result.error);
        setIsSaving(false);
        return false;
      }
      setProject(result.data);
      toast.success("Your project has been saved.");
      return true;
    } catch (error) {
      if (isNextRedirectError(error)) throw error;
      toast.error("Something went wrong while saving. Please try again.");
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [project.editToken, title, music, scenes]);

  return {
    project,
    title,
    setTitle,
    music,
    setMusic,
    scenes,
    activeSceneIndex,
    setActiveSceneIndex,
    activeScene,
    selectedElementId,
    setSelectedElementId,
    selectedElement,
    commitElementBox,
    updateElementProps,
    addTextElement,
    addStickerElement,
    replaceImage,
    isUploadingImage,
    deleteElement,
    setBackground,
    setSceneDuration,
    applyTheme,
    addScene,
    duplicateScene,
    deleteScene,
    reorderScene,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    undo,
    redo,
    isSaving,
    save,
  };
}

export type TemplateEditor = ReturnType<typeof useTemplateEditor>;

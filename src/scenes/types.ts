import type { ComponentType } from "react";
import type { z } from "zod";

/** Broad groupings used for Scene Library category filter chips. */
export type SceneCategory = "structure" | "memories" | "emotional" | "travel" | "moments" | "music" | "modern" | "love-story";

export type SceneVariantOption = { id: string; label: string };

/**
 * Everything a scene type declares about itself. Lives in that scene's own
 * `config.ts` — plain data + zod, no component imports, so it's safe for
 * server code (database/queries/stories.ts) to import via scenes/schema.ts
 * without pulling client components into that bundle.
 */
export type SceneConfig<TData> = {
  /** Stable id, also the zod discriminant value (matches the folder name). */
  id: string;
  label: string;
  description: string;
  category: SceneCategory;
  /** Search keywords — scene name/category alone isn't enough for the Scene Library search. */
  tags: string[];
  emoji: string;
  variants: SceneVariantOption[];
  defaultVariant: string;
  /** Input relaxed to `any` — zod schemas using `.optional().default(...)`
   *  have a wider input type than their parsed output (TData), and this
   *  config only needs to guarantee what comes OUT of `.parse()`. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- see comment above
  dataSchema: z.ZodType<TData, z.ZodTypeDef, any>;
  defaultData: () => TData;
  /** Filled-in sample content (not blank, unlike defaultData) used only by
   *  the Scene Library's live preview cards, so a scene can be *seen*
   *  animating before a user adds it to their story. */
  previewData: () => TData;
  /** Every scene's duration is a pure function of its data — the player
   *  owns all timing centrally so it can never drift from what ProgressDashes displays. */
  getDurationMs: (data: TData) => number;
  /** True only for `ending` — the player stops auto-advancing here. */
  isTerminal?: boolean;
  /** How the player hands off from the previous scene. Defaults to `"cut"`
   *  — a hard cut, like an edit between two shots — because every scene
   *  already choreographs its own entrance; a player-level crossfade on top
   *  of that reads as double-animated and mutes whatever the scene itself
   *  is doing in its first half-second. Opt into `"fade"` only for a scene
   *  that's deliberately meant to dissolve in (rare). */
  transitionIn?: "cut" | "fade";
};

export type SceneBuilderProps<TData> = {
  data: TData;
  onChange: (data: TData) => void;
};

/** Story-level fields a handful of scenes (Cover, Letter) reference —
 *  passed uniformly to every renderer rather than special-cased, so the
 *  contract stays one shape. Most scenes simply ignore it. */
export type StoryContext = {
  title: string;
  subtitle: string | null;
  recipientName: string;
};

export type SceneRendererProps<TData> = {
  data: TData;
  variant: string;
  story: StoryContext;
};

/**
 * A scene folder's full export. The registry aggregates these into a
 * heterogeneous array — `any` here is a deliberate, narrow type-safety
 * boundary (React has no existential types), not carelessness: each scene
 * folder's own config/builder/renderer stay strictly typed against their
 * concrete data shape internally, and the discriminated union in
 * scenes/schema.ts is where real type safety on stored data lives.
 */
export type SceneDefinition<TData = unknown> = {
  config: SceneConfig<TData>;
  Builder: ComponentType<SceneBuilderProps<TData>>;
  Renderer: ComponentType<SceneRendererProps<TData>>;
  /** Optional, cheaper stand-in the Scene Library card loops instead of the
   *  full `Renderer` — for a scene whose real choreography is too heavy to
   *  run repeatedly at thumbnail size (Love Letter's nine-phase sequence
   *  today). Most scenes don't need one; the card falls back to `Renderer`. */
  Thumbnail?: ComponentType<Record<string, never>>;
};

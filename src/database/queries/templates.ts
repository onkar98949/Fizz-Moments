import "server-only";
import { prisma } from "@/database/client";
import { scenesSchema } from "@/schemas/template";
import type { Scene, TemplateCatalogEntry, TemplateProjectData } from "@/types/template";
import { createBlankScene } from "@/lib/template-scene-factory";
import type { Template, TemplateProject } from "@prisma/client";

/** Parses and validates a Json `scenes` column once, here, so every
 *  consumer (gallery, editor, player) gets an already-trusted type instead
 *  of scattered `as Scene[]` casts. Throws on corrupt data — a project's
 *  scenes should never be malformed since writes are always zod-validated. */
function parseScenes(raw: unknown): Scene[] {
  return scenesSchema.parse(raw) as Scene[];
}

function toTemplateCatalogEntry(row: Template): TemplateCatalogEntry {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    description: row.description,
    seedScenes: parseScenes(row.seedScenes),
    createdAt: row.createdAt.toISOString(),
  };
}

function toTemplateProjectData(row: TemplateProject): TemplateProjectData {
  return {
    id: row.id,
    editToken: row.editToken,
    userId: row.userId,
    title: row.title,
    music: row.music,
    scenes: parseScenes(row.scenes),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function getTemplateCatalog(): Promise<TemplateCatalogEntry[]> {
  const rows = await prisma.template.findMany({ orderBy: { createdAt: "asc" } });
  return rows.map(toTemplateCatalogEntry);
}

export async function getTemplateById(id: string): Promise<TemplateCatalogEntry | null> {
  const row = await prisma.template.findUnique({ where: { id } });
  return row ? toTemplateCatalogEntry(row) : null;
}

export async function getTemplateProjectById(id: string): Promise<TemplateProjectData | null> {
  const row = await prisma.templateProject.findUnique({ where: { id } });
  return row ? toTemplateProjectData(row) : null;
}

export async function getTemplateProjectByEditToken(editToken: string): Promise<TemplateProjectData | null> {
  const row = await prisma.templateProject.findUnique({ where: { editToken } });
  return row ? toTemplateProjectData(row) : null;
}

export async function createBlankProject(userId: string | null = null): Promise<TemplateProjectData> {
  const row = await prisma.templateProject.create({
    data: {
      title: "Untitled",
      scenes: [createBlankScene()],
      userId,
    },
  });
  return toTemplateProjectData(row);
}

export async function createProjectFromTemplate(
  templateId: string,
  userId: string | null = null,
): Promise<TemplateProjectData | null> {
  const template = await prisma.template.findUnique({ where: { id: templateId } });
  if (!template) return null;

  const row = await prisma.templateProject.create({
    data: {
      title: template.name,
      scenes: parseScenes(template.seedScenes),
      userId,
    },
  });
  return toTemplateProjectData(row);
}

export async function updateTemplateProject(
  editToken: string,
  data: { title: string; music: string | null; scenes: Scene[] },
): Promise<TemplateProjectData> {
  const row = await prisma.templateProject.update({
    where: { editToken },
    data: {
      title: data.title,
      music: data.music,
      scenes: data.scenes,
    },
  });
  return toTemplateProjectData(row);
}

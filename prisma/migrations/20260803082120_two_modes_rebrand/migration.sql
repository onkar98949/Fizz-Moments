/*
  Warnings:

  - You are about to drop the column `final_message` on the `stories` table. All the data in the column will be lost.
  - You are about to drop the column `theme` on the `stories` table. All the data in the column will be lost.
  - Added the required column `closing_message` to the `stories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `experience` to the `stories` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Experience" AS ENUM ('TIMELINE_JOURNEY', 'LOVE_LETTER');

-- CreateEnum
CREATE TYPE "TemplateCategory" AS ENUM ('LOVE', 'BIRTHDAY', 'ANNIVERSARY', 'MINIMAL', 'SCRAPBOOK');

-- AlterTable
ALTER TABLE "stories" DROP COLUMN "final_message",
DROP COLUMN "theme",
ADD COLUMN     "closing_message" VARCHAR(600) NOT NULL,
ADD COLUMN     "experience" "Experience" NOT NULL,
ADD COLUMN     "opening_message" VARCHAR(600);

-- DropEnum
DROP TYPE "Theme";

-- CreateTable
CREATE TABLE "templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "TemplateCategory" NOT NULL,
    "description" TEXT NOT NULL,
    "seed_scenes" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "template_projects" (
    "id" TEXT NOT NULL,
    "edit_token" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "music" TEXT,
    "scenes" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "template_projects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "template_projects_edit_token_key" ON "template_projects"("edit_token");

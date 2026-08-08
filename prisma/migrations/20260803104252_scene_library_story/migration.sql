/*
  Warnings:

  - You are about to drop the column `closing_message` on the `stories` table. All the data in the column will be lost.
  - You are about to drop the column `experience` on the `stories` table. All the data in the column will be lost.
  - You are about to drop the column `occasion` on the `stories` table. All the data in the column will be lost.
  - You are about to drop the column `opening_message` on the `stories` table. All the data in the column will be lost.
  - You are about to drop the `memories` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `scenes` to the `stories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `stories` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StoryTemplateCategory" AS ENUM ('LOVE', 'TRAVEL', 'BIRTHDAY', 'ANNIVERSARY', 'FAMILY', 'GRADUATION', 'THANK_YOU');

-- DropForeignKey
ALTER TABLE "memories" DROP CONSTRAINT "memories_story_id_fkey";

-- AlterTable
ALTER TABLE "stories" DROP COLUMN "closing_message",
DROP COLUMN "experience",
DROP COLUMN "occasion",
DROP COLUMN "opening_message",
ADD COLUMN     "scenes" JSONB NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "music" DROP NOT NULL;

-- DropTable
DROP TABLE "memories";

-- DropEnum
DROP TYPE "Experience";

-- DropEnum
DROP TYPE "Occasion";

-- CreateTable
CREATE TABLE "story_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "StoryTemplateCategory" NOT NULL,
    "description" TEXT NOT NULL,
    "seed_scenes" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "story_templates_pkey" PRIMARY KEY ("id")
);

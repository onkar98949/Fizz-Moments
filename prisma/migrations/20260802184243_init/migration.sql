-- CreateEnum
CREATE TYPE "Occasion" AS ENUM ('LOVE_STORY', 'BIRTHDAY', 'THANK_YOU');

-- CreateEnum
CREATE TYPE "Theme" AS ENUM ('MINIMAL', 'ROMANTIC', 'SCRAPBOOK');

-- CreateEnum
CREATE TYPE "ReactionType" AS ENUM ('HEART', 'TEARY_EYES', 'SMILE');

-- CreateTable
CREATE TABLE "stories" (
    "id" TEXT NOT NULL,
    "edit_token" TEXT NOT NULL,
    "occasion" "Occasion" NOT NULL,
    "recipient_name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "theme" "Theme" NOT NULL,
    "music" TEXT NOT NULL,
    "final_message" VARCHAR(600) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "memories" (
    "id" TEXT NOT NULL,
    "story_id" TEXT NOT NULL,
    "order_index" INTEGER NOT NULL,
    "photo_url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "caption" VARCHAR(120),

    CONSTRAINT "memories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reactions" (
    "id" TEXT NOT NULL,
    "story_id" TEXT NOT NULL,
    "reaction" "ReactionType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stories_edit_token_key" ON "stories"("edit_token");

-- CreateIndex
CREATE INDEX "memories_story_id_idx" ON "memories"("story_id");

-- CreateIndex
CREATE INDEX "reactions_story_id_idx" ON "reactions"("story_id");

-- AddForeignKey
ALTER TABLE "memories" ADD CONSTRAINT "memories_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "stories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reactions" ADD CONSTRAINT "reactions_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "stories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

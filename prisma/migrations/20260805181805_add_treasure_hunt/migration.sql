-- CreateTable
CREATE TABLE "treasure_hunts" (
    "id" TEXT NOT NULL,
    "edit_token" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "clues" JSONB NOT NULL,
    "final_message" TEXT NOT NULL,
    "final_photo_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "treasure_hunts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "treasure_hunts_edit_token_key" ON "treasure_hunts"("edit_token");

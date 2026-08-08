-- CreateTable
CREATE TABLE "scratch_card_gifts" (
    "id" TEXT NOT NULL,
    "edit_token" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "cards" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scratch_card_gifts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "scratch_card_gifts_edit_token_key" ON "scratch_card_gifts"("edit_token");

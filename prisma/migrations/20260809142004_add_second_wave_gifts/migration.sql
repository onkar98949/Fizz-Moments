-- CreateTable
CREATE TABLE "secret_envelopes" (
    "id" TEXT NOT NULL,
    "edit_token" TEXT NOT NULL,
    "user_id" TEXT,
    "title" TEXT NOT NULL,
    "style" TEXT NOT NULL DEFAULT 'classic',
    "recipient_name" TEXT NOT NULL,
    "letter_title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "sender_name" TEXT NOT NULL,
    "photo_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "secret_envelopes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fortune_cookies" (
    "id" TEXT NOT NULL,
    "edit_token" TEXT NOT NULL,
    "user_id" TEXT,
    "title" TEXT NOT NULL,
    "recipient_name" TEXT NOT NULL,
    "fortunes" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fortune_cookies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "memory_quizzes" (
    "id" TEXT NOT NULL,
    "edit_token" TEXT NOT NULL,
    "user_id" TEXT,
    "title" TEXT NOT NULL,
    "questions" JSONB NOT NULL,
    "result_tiers" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "memory_quizzes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "open_when_collections" (
    "id" TEXT NOT NULL,
    "edit_token" TEXT NOT NULL,
    "user_id" TEXT,
    "title" TEXT NOT NULL,
    "letters" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "open_when_collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "date_generators" (
    "id" TEXT NOT NULL,
    "edit_token" TEXT NOT NULL,
    "user_id" TEXT,
    "title" TEXT NOT NULL,
    "ideas" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "date_generators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hundred_reasons" (
    "id" TEXT NOT NULL,
    "edit_token" TEXT NOT NULL,
    "user_id" TEXT,
    "title" TEXT NOT NULL,
    "reasons" JSONB NOT NULL,
    "final_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hundred_reasons_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "secret_envelopes_edit_token_key" ON "secret_envelopes"("edit_token");

-- CreateIndex
CREATE INDEX "secret_envelopes_user_id_idx" ON "secret_envelopes"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "fortune_cookies_edit_token_key" ON "fortune_cookies"("edit_token");

-- CreateIndex
CREATE INDEX "fortune_cookies_user_id_idx" ON "fortune_cookies"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "memory_quizzes_edit_token_key" ON "memory_quizzes"("edit_token");

-- CreateIndex
CREATE INDEX "memory_quizzes_user_id_idx" ON "memory_quizzes"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "open_when_collections_edit_token_key" ON "open_when_collections"("edit_token");

-- CreateIndex
CREATE INDEX "open_when_collections_user_id_idx" ON "open_when_collections"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "date_generators_edit_token_key" ON "date_generators"("edit_token");

-- CreateIndex
CREATE INDEX "date_generators_user_id_idx" ON "date_generators"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "hundred_reasons_edit_token_key" ON "hundred_reasons"("edit_token");

-- CreateIndex
CREATE INDEX "hundred_reasons_user_id_idx" ON "hundred_reasons"("user_id");

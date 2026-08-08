-- CreateTable
CREATE TABLE "love_wrapped" (
    "id" TEXT NOT NULL,
    "edit_token" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "stats" JSONB NOT NULL,
    "moments" JSONB NOT NULL,
    "closing_message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "love_wrapped_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coupon_books" (
    "id" TEXT NOT NULL,
    "edit_token" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "coupons" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "coupon_books_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "relationship_quizzes" (
    "id" TEXT NOT NULL,
    "edit_token" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "questions" JSONB NOT NULL,
    "result_tiers" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "relationship_quizzes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "love_wrapped_edit_token_key" ON "love_wrapped"("edit_token");

-- CreateIndex
CREATE UNIQUE INDEX "coupon_books_edit_token_key" ON "coupon_books"("edit_token");

-- CreateIndex
CREATE UNIQUE INDEX "relationship_quizzes_edit_token_key" ON "relationship_quizzes"("edit_token");

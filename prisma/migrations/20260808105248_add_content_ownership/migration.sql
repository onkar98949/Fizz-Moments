-- AlterTable
ALTER TABLE "coupon_books" ADD COLUMN     "user_id" TEXT;

-- AlterTable
ALTER TABLE "gift_boxes" ADD COLUMN     "user_id" TEXT;

-- AlterTable
ALTER TABLE "love_wrapped" ADD COLUMN     "user_id" TEXT;

-- AlterTable
ALTER TABLE "relationship_quizzes" ADD COLUMN     "user_id" TEXT;

-- AlterTable
ALTER TABLE "scratch_card_gifts" ADD COLUMN     "user_id" TEXT;

-- AlterTable
ALTER TABLE "stories" ADD COLUMN     "user_id" TEXT;

-- AlterTable
ALTER TABLE "template_projects" ADD COLUMN     "user_id" TEXT;

-- AlterTable
ALTER TABLE "treasure_hunts" ADD COLUMN     "user_id" TEXT;

-- CreateIndex
CREATE INDEX "coupon_books_user_id_idx" ON "coupon_books"("user_id");

-- CreateIndex
CREATE INDEX "gift_boxes_user_id_idx" ON "gift_boxes"("user_id");

-- CreateIndex
CREATE INDEX "love_wrapped_user_id_idx" ON "love_wrapped"("user_id");

-- CreateIndex
CREATE INDEX "relationship_quizzes_user_id_idx" ON "relationship_quizzes"("user_id");

-- CreateIndex
CREATE INDEX "scratch_card_gifts_user_id_idx" ON "scratch_card_gifts"("user_id");

-- CreateIndex
CREATE INDEX "stories_user_id_idx" ON "stories"("user_id");

-- CreateIndex
CREATE INDEX "template_projects_user_id_idx" ON "template_projects"("user_id");

-- CreateIndex
CREATE INDEX "treasure_hunts_user_id_idx" ON "treasure_hunts"("user_id");

import type { Metadata } from "next";
import { getCouponBookByEditToken } from "@/database/queries/gifts";
import { claimOwnershipIfUnowned } from "@/database/queries/ownership";
import { getCurrentUserId } from "@/lib/supabase/server";
import { InvalidLink } from "@/components/shared/invalid-link";
import { CouponBookEditor } from "@/features/gifts/coupon-book/coupon-book-editor";

type EditPageProps = {
  params: Promise<{ token: string }>;
};

export const metadata: Metadata = {
  title: "Edit your coupon book — FizzMoments",
};

export default async function CouponBookEditPage({ params }: EditPageProps) {
  const { token } = await params;
  const [book, userId] = await Promise.all([getCouponBookByEditToken(token), getCurrentUserId()]);

  if (!book) {
    return (
      <InvalidLink
        title="This edit link has expired"
        description="We couldn't find a coupon book for this link. It may have been mistyped."
      />
    );
  }

  if (userId && !book.userId) {
    await claimOwnershipIfUnowned("coupon-book", book.id, userId);
    book.userId = userId;
  }

  return <CouponBookEditor book={book} isSignedIn={!!userId} />;
}

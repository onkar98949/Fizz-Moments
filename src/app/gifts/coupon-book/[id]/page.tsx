import type { Metadata } from "next";
import { getCouponBookById } from "@/database/queries/gifts";
import { InvalidLink } from "@/components/shared/invalid-link";
import { CouponBookPlayer } from "@/features/gifts/coupon-book/coupon-book-player";

type BookPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
  const { id } = await params;
  const book = await getCouponBookById(id);
  return { title: book ? `${book.title} — FizzMoments` : "FizzMoments" };
}

export default async function CouponBookPage({ params }: BookPageProps) {
  const { id } = await params;
  const book = await getCouponBookById(id);

  if (!book) {
    return (
      <InvalidLink
        title="This coupon book couldn't be found"
        description="The link might be mistyped, or the gift may no longer exist."
      />
    );
  }

  return <CouponBookPlayer book={book} />;
}

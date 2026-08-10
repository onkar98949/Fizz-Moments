export type DashboardKind =
  | "story"
  | "template"
  | "scratch-cards"
  | "treasure-hunt"
  | "gift-box"
  | "love-wrapped"
  | "coupon-book"
  | "how-well"
  | "secret-envelope"
  | "fortune-cookie"
  | "memory-quiz"
  | "open-when"
  | "date-generator"
  | "100-reasons";

export type DashboardItem = {
  kind: DashboardKind;
  id: string;
  editToken: string;
  title: string;
  emoji: string;
  label: string;
  editHref: string;
  viewHref: string;
  updatedAt: string;
};

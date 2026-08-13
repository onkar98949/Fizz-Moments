import Link from "next/link";
import Image from "next/image";

const PRODUCT_LINKS = [
  { href: "/gifts", label: "Gifts" },
  { href: "/create", label: "Story Experience" },
  { href: "/templates", label: "Templates" },
];

const OCCASION_LINKS = [
  { href: "/gifts-for-friends", label: "For Best Friends" },
  { href: "/digital-birthday-gifts", label: "For Birthdays" },
  { href: "/long-distance-gifts", label: "For Long Distance" },
];

const COMPANY_LINKS = [
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
];

export function Footer() {
  return (
    <footer className="border-border mt-auto w-full border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-14 px-6 py-16 sm:px-10 sm:py-20">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div className="col-span-2 flex flex-col gap-4 sm:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/fizzmoments-mark.png" alt="" width={36} height={27} className="h-7 w-auto" />
              <span className="text-lg font-semibold tracking-tight">FizzMoments</span>
            </Link>
            <p className="text-muted-foreground text-caption max-w-[30ch]">
              Made for the people who mean the most to you.
            </p>
          </div>

          <div className="flex flex-col gap-3.5">
            <span className="text-muted-foreground text-eyebrow font-medium uppercase">Product</span>
            {PRODUCT_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground/80 hover:text-foreground text-sm font-medium transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-3.5">
            <span className="text-muted-foreground text-eyebrow font-medium uppercase">Occasions</span>
            {OCCASION_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground/80 hover:text-foreground text-sm font-medium transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-3.5">
            <span className="text-muted-foreground text-eyebrow font-medium uppercase">Company</span>
            {COMPANY_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground/80 hover:text-foreground text-sm font-medium transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="border-border flex flex-col gap-3 border-t pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted-foreground/70 text-meta">© 2026 FizzMoments. All rights reserved.</p>
          <p className="text-muted-foreground/70 text-meta">Made with FizzMoments</p>
        </div>
      </div>
    </footer>
  );
}

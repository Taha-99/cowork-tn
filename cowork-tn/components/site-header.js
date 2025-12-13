"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { LanguageSwitcherCompact } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader({ locale }) {
  const t = useTranslations("nav");

  const navLinks = [
    { href: `/${locale}#features`, label: t("features") },
    { href: `/${locale}#pricing`, label: t("pricing") },
    { href: `/${locale}#product`, label: t("product") },
  ];

  return (
    <header className="sticky top-4 z-30 mx-auto max-w-5xl">
      <div className="flex items-center justify-between rounded-2xl border border-border/40 bg-card/80 px-4 py-3 shadow-soft backdrop-blur-xl dark:border-border/30 dark:bg-card/60 dark:shadow-none">
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
            C
          </div>
          <span className="text-lg font-display font-semibold text-foreground">
            Cowork.tn
          </span>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitcherCompact locale={locale} />
          <ThemeToggle />
          <Button asChild size="sm" variant="ghost" className="hidden lg:inline-flex">
            <Link href={`/${locale}/login`}>{t("login")}</Link>
          </Button>
          <Button asChild size="sm">
            <Link href={`/${locale}/register`}>{t("start")}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

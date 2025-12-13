"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export function SiteFooter({ locale }) {
  const t = useTranslations("footer");
  const nav = [
    { label: t("legal"), href: `/${locale}/legal` },
    { label: t("privacy"), href: `/${locale}/privacy` },
    { label: t("support"), href: `/${locale}/support` },
  ];

  return (
    <footer className="mt-16 border-t border-border/50 pt-8 text-sm dark:border-border/30">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-bold">
            C
          </div>
          <p className="font-medium text-foreground">© {new Date().getFullYear()} Cowork.tn</p>
        </div>
        <div className="flex items-center gap-4">
          {nav.map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
      <p className="mt-4 max-w-2xl text-xs text-muted-foreground/70">
        {t("note")}
      </p>
    </footer>
  );
}

'use client';

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useMemo } from "react";
import { locales } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";

const localeLabels = {
  fr: "Français",
  ar: "العربية",
};

const localeShortLabels = {
  fr: "FR",
  ar: "AR",
};

export function LanguageSwitcher({ locale }) {
  const pathname = usePathname();

  const buildHref = useMemo(() => {
    return (targetLocale) => {
      if (!pathname) return `/${targetLocale}`;
      const segments = pathname.split("/").filter(Boolean);
      if (segments.length === 0) return `/${targetLocale}`;
      segments[0] = targetLocale;
      return `/${segments.join("/")}`;
    };
  }, [pathname]);

  const otherLocale = locale === "fr" ? "ar" : "fr";

  return (
    <Link
      href={buildHref(otherLocale)}
      prefetch={true}
      className={cn(
        "group flex items-center gap-2 rounded-xl border border-border/50 bg-secondary/50 px-3 py-2 text-sm font-medium transition-all duration-200",
        "hover:bg-secondary hover:border-border",
        "dark:border-border/30 dark:bg-secondary/30 dark:hover:bg-secondary/50"
      )}
    >
      <Globe className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
      <span className="text-muted-foreground transition-colors group-hover:text-foreground">
        {localeLabels[otherLocale]}
      </span>
    </Link>
  );
}

// Alternative: Compact toggle version
export function LanguageSwitcherCompact({ locale }) {
  const pathname = usePathname();

  const buildHref = useMemo(() => {
    return (targetLocale) => {
      if (!pathname) return `/${targetLocale}`;
      const segments = pathname.split("/").filter(Boolean);
      if (segments.length === 0) return `/${targetLocale}`;
      segments[0] = targetLocale;
      return `/${segments.join("/")}`;
    };
  }, [pathname]);

  return (
    <div className="flex items-center gap-0.5 rounded-xl border border-border/50 bg-secondary/50 p-1 dark:border-border/30 dark:bg-secondary/30">
      {locales.map((value) => (
        <Link
          key={value}
          href={buildHref(value)}
          prefetch={true}
          className={cn(
            "rounded-lg px-3 py-1.5 text-xs font-semibold uppercase transition-all duration-200",
            value === locale 
              ? "bg-background text-foreground shadow-sm dark:bg-card" 
              : "text-muted-foreground hover:text-foreground hover:bg-background/50"
          )}
        >
          {localeShortLabels[value]}
        </Link>
      ))}
    </div>
  );
}

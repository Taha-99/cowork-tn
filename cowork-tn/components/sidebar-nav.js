"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, CalendarCheck2, CreditCard } from "lucide-react";
import { useTranslations } from "next-intl";

const navItems = [
  { href: "app", icon: LayoutDashboard, labelKey: "dashboard" },
  { href: "app/members", icon: Users, labelKey: "members" },
  { href: "app/bookings", icon: CalendarCheck2, labelKey: "bookings" },
  { href: "app/billing", icon: CreditCard, labelKey: "billing" },
];

export function SidebarNav({ locale }) {
  const pathname = usePathname();
  const t = useTranslations("dashboardNav");

  return (
    <aside className="hidden w-64 flex-col gap-1.5 rounded-2xl border border-border/50 bg-card/80 p-3 backdrop-blur-sm dark:border-border/30 dark:bg-card/60 md:flex">
      {navItems.map((item) => {
        const Icon = item.icon;
        const href = `/${locale}/${item.href}`;
        const isActive = pathname === href;
        return (
          <Link
            key={item.href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
              isActive 
                ? "bg-primary text-primary-foreground shadow-md dark:shadow-primary/20" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {t(item.labelKey)}
          </Link>
        );
      })}
    </aside>
  );
}

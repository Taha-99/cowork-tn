"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, CalendarDays, CreditCard, User, LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcherCompact } from "@/components/language-switcher";
import { signOut } from "@/lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { href: "my", icon: Home, labelKey: "overview" },
  { href: "my/reservations", icon: CalendarDays, labelKey: "reservations" },
  { href: "my/invoices", icon: CreditCard, labelKey: "invoices" },
  { href: "my/profile", icon: User, labelKey: "profile" },
];

export function CoworkerShell({ children, locale, user }) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("coworkerNav");
  const tProfile = useTranslations("profileMenu");

  const initials = user?.full_name
    ? user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  async function handleSignOut() {
    await signOut();
    router.push(`/${locale}/login`);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-border/50 bg-card/80 backdrop-blur-xl dark:border-border/30 dark:bg-card/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          {/* Logo */}
          <Link href={`/${locale}/my`} className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              C
            </div>
            <span className="text-lg font-display font-semibold text-foreground">Cowork.tn</span>
            <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent dark:bg-accent/20">
              {t("memberBadge")}
            </span>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              const href = `/${locale}/${item.href}`;
              const isActive = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={item.href}
                  href={href}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200",
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
          </nav>

          {/* User menu */}
          <div className="flex items-center gap-2">
            <LanguageSwitcherCompact locale={locale} />
            <ThemeToggle />
            <div className="h-6 w-px bg-border/50 mx-1 hidden sm:block" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-xl p-0 hover:bg-muted">
                  <Avatar className="h-9 w-9 ring-2 ring-border/50">
                    <AvatarImage src={user?.avatar_url} alt={user?.full_name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl border-border/50 dark:bg-card">
                <DropdownMenuLabel>
                  <p className="text-sm font-medium text-foreground">{user?.full_name || tProfile("placeholder")}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem asChild>
                  <Link href={`/${locale}/my/profile`} className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {tProfile("profile")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/${locale}/my/invoices`} className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    {tProfile("billing")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {tProfile("logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Navigation - Mobile */}
        <nav className="flex items-center justify-around border-t border-border/50 bg-card/80 py-2 dark:border-border/30 dark:bg-card/60 md:hidden">
          {navItems.map((item) => {
            const Icon = item.icon;
            const href = `/${locale}/${item.href}`;
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={item.href}
                href={href}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-xs transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive && "text-primary")} />
                <span>{t(item.labelKey)}</span>
              </Link>
            );
          })}
        </nav>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6">{children}</main>
    </div>
  );
}

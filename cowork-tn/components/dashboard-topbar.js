"use client";

import React from "react";
import { LanguageSwitcherCompact } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { signOut, getCurrentUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Loader2, LogOut, Settings, CreditCard, User } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export function DashboardTopbar({ locale }) {
  const [user, setUser] = React.useState(null);
  const [profile, setProfile] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();
  const t = useTranslations("profileMenu");

  React.useEffect(() => {
    let active = true;
    async function fetchUser() {
      try {
        const currentUser = await getCurrentUser();
        if (active && currentUser) {
          setUser(currentUser);
          setProfile(currentUser.profile);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }
    fetchUser();
    return () => {
      active = false;
    };
  }, []);

  async function handleSignOut() {
    await signOut();
    router.push(`/${locale}/login`);
  }

  const initials = profile?.full_name 
    ? profile.full_name.split(" ").map(n => n[0]).join("").toUpperCase()
    : user?.email?.charAt(0).toUpperCase() || "?";

  return (
    <div className="rounded-2xl border border-border/50 bg-card/80 p-4 shadow-soft backdrop-blur-xl dark:border-border/30 dark:bg-card/60 dark:shadow-none">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Logo for dashboard */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold">
            C
          </div>
          <span className="text-lg font-display font-semibold text-foreground hidden sm:block">
            Cowork.tn
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <LanguageSwitcherCompact locale={locale} />
          <ThemeToggle />
          <div className="h-6 w-px bg-border/50 mx-1 hidden sm:block" />
          {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" aria-label="Loading profile" />}
          <DropdownMenu suppressHydrationWarning>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 rounded-xl px-2 hover:bg-muted"
              >
                <Avatar className="h-8 w-8 ring-2 ring-border/50">
                  {profile?.avatar_url && (
                    <AvatarImage src={profile.avatar_url} alt="Avatar" />
                  )}
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">{initials}</AvatarFallback>
                </Avatar>
                <div className="hidden text-left text-sm sm:block">
                  <p className="font-medium leading-none text-foreground">{profile?.full_name || user?.email?.split('@')[0] || t("placeholder")}</p>
                  <p className="text-xs text-muted-foreground">{user?.email ?? "-"}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 rounded-xl border-border/50 dark:bg-card">
              <DropdownMenuLabel>
                <p className="text-xs text-muted-foreground">{t("signedInAs")}</p>
                <p className="text-sm font-medium text-foreground">{profile?.full_name || user?.email || t("placeholder")}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem asChild>
                <Link href={`/${locale}/app/settings`} className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {t("profile")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/${locale}/app/billing`} className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  {t("billing")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem onSelect={handleSignOut} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                <LogOut className="mr-2 h-4 w-4" />
                {t("logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

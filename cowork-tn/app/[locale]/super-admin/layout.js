"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { signOut, getCurrentUser, hasRole, ROLES, getRedirectPath } from "@/lib/auth";
import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  Shield,
  Menu,
  X,
  Bell,
} from "lucide-react";

export default function SuperAdminLayout({ children, params }) {
  const { locale } = React.use(params);
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const navItems = [
    { href: `/${locale}/super-admin`, label: "Dashboard", icon: LayoutDashboard },
    { href: `/${locale}/super-admin/spaces`, label: "Espaces", icon: Building2 },
    { href: `/${locale}/super-admin/users`, label: "Utilisateurs", icon: Users },
    { href: `/${locale}/super-admin/billing`, label: "Facturation", icon: CreditCard },
    { href: `/${locale}/super-admin/analytics`, label: "Analytiques", icon: BarChart3 },
    { href: `/${locale}/super-admin/settings`, label: "Paramètres", icon: Settings },
  ];

  React.useEffect(() => {
    async function checkAuth() {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          router.push(`/${locale}/login`);
          return;
        }
        
        // Check if user is super admin
        const userRole = currentUser.profile?.role || ROLES.COWORKER;
        if (userRole !== ROLES.SUPER_ADMIN && userRole !== "super_admin") {
          // Redirect to appropriate dashboard based on role
          const redirectPath = getRedirectPath(userRole, locale);
          router.push(redirectPath);
          return;
        }
        
        setUser(currentUser);
      } catch (err) {
        console.error("Auth error:", err);
        router.push(`/${locale}/login`);
      } finally {
        setIsLoading(false);
      }
    }
    checkAuth();
  }, [locale, router]);

  async function handleSignOut() {
    await signOut();
    router.push(`/${locale}/login`);
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Top Header */}
      <header className="sticky top-0 z-50 h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-full items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            
            {/* Logo */}
            <Link href={`/${locale}/super-admin`} className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600 text-white font-bold">
                <Shield className="h-5 w-5" />
              </div>
              <div className="hidden sm:block">
                <span className="font-semibold text-foreground">CoWork</span>
                <span className="ml-1 text-xs font-medium text-red-500">SUPER ADMIN</span>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                3
              </span>
            </Button>
            
            <ThemeToggle />
            
            <DropdownMenu suppressHydrationWarning>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profile?.avatar_url} />
                    <AvatarFallback className="bg-red-500 text-white">
                      {user?.profile?.full_name?.[0]?.toUpperCase() || "SA"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block text-sm font-medium">
                    {user?.profile?.full_name || "Super Admin"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{user?.profile?.full_name}</span>
                    <span className="text-xs text-muted-foreground font-normal">{user?.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/${locale}/super-admin/settings`}>
                    <Settings className="mr-2 h-4 w-4" />
                    Paramètres
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-64 transform bg-background border-r border-border pt-16 transition-transform duration-300 lg:translate-x-0 lg:static lg:pt-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <nav className="flex flex-col gap-1 p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || 
                (item.href !== `/${locale}/super-admin` && pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-red-500/10 text-red-600 dark:text-red-400"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}

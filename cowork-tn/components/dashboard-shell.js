import { SidebarNav } from "@/components/sidebar-nav";
import { DashboardTopbar } from "@/components/dashboard-topbar";

export function DashboardShell({ children, locale }) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardTopbar locale={locale} />
      <div className="grid gap-6 lg:grid-cols-[280px_1fr] px-6 py-6">
        <SidebarNav locale={locale} />
        <main className="space-y-6">{children}</main>
      </div>
    </div>
  );
}

import { SidebarNav } from "@/components/sidebar-nav";
import { DashboardTopbar } from "@/components/dashboard-topbar";

export function DashboardShell({ children, locale }) {
  return (
    <div className="space-y-6">
      <DashboardTopbar locale={locale} />
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <SidebarNav locale={locale} />
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
}

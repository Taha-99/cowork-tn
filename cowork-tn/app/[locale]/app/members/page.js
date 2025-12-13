import { DashboardShell } from "@/components/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getTranslations } from "next-intl/server";
import { getSpaceContext } from "@/lib/dashboard-data";
import { getSupabaseServiceRole } from "@/lib/supabase-server";
import { Search, QrCode, UserPlus } from "lucide-react";

export default async function MembersPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "membersPage" });
  const supabase = getSupabaseServiceRole();
  const space = await getSpaceContext();

  let members = [];
  let loadError = null;
  try {
    const { data, error } = await supabase
      .from("members")
      .select("id,full_name,email,subscription_plan,is_active,credits,company")
      .eq("space_id", space.id)
      .order("full_name", { ascending: true });

    if (error) throw error;
    members = data || [];
  } catch (error) {
    loadError = error;
    console.error("[members] Failed to load list", error);
  }

  const statusLabels = {
    active: t("statusLabels.active"),
    inactive: t("statusLabels.inactive"),
    suspended: t("statusLabels.suspended"),
  };

  const planLabels = {
    unlimited: t("plans.unlimited"),
    "10_days": t("plans.10_days"),
    day_pass: t("plans.day_pass"),
    none: t("plans.none"),
  };

  const getStatusKey = (member) => {
    if (!member.is_active) return "inactive";
    if (member.subscription_plan !== "unlimited" && (member.credits || 0) === 0) {
      return "suspended";
    }
    return "active";
  };

  const formatInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="mx-auto w-full max-w-[2000px] space-y-6 px-6 py-10 sm:px-10 lg:px-16 2xl:px-24">
      <div>
        <h1 className="text-3xl font-display font-semibold">{t("title")}</h1>
        <p className="text-muted">{t("subtitle")}</p>
      </div>
      <DashboardShell locale={locale}>
        <section className="rounded-[32px] border border-border/70 bg-card/80 p-6 shadow-xl shadow-black/5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[220px] max-w-lg">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                className="h-12 w-full rounded-full border border-border/60 bg-background pl-11 pr-4 text-sm text-foreground placeholder:text-muted"
                placeholder={t("searchPlaceholder")}
                disabled
              />
            </div>
            <Button className="rounded-2xl px-4" disabled>
              <UserPlus className="mr-2 h-4 w-4" />
              {t("addMember")}
            </Button>
          </div>
          <div className="mt-6 overflow-hidden rounded-3xl border border-border/60 bg-background">
            <div className="grid grid-cols-[minmax(220px,2fr)_2fr_1fr_1fr_auto] gap-4 border-b border-border/60 px-6 py-4 text-xs font-semibold uppercase tracking-widest text-muted">
              <span>{t("columns.member")}</span>
              <span>{t("columns.email")}</span>
              <span>{t("columns.status")}</span>
              <span>{t("columns.plan")}</span>
              <span className="text-right">{t("columns.actions")}</span>
            </div>
            {members.map((member) => {
              const statusKey = getStatusKey(member);
              return (
                <div
                  key={member.id}
                  className="grid grid-cols-[minmax(220px,2fr)_2fr_1fr_1fr_auto] items-center gap-4 px-6 py-4 text-sm"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{formatInitials(member.full_name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">{member.full_name}</p>
                      <p className="text-xs text-muted">{member.company || "—"}</p>
                    </div>
                  </div>
                  <p className="text-muted">{member.email}</p>
                  <Badge
                    variant={statusKey === "active" ? "accent" : "outline"}
                    className={statusKey === "suspended" ? "bg-red-100 text-red-600" : undefined}
                  >
                    {statusLabels[statusKey]}
                  </Badge>
                  <Badge variant="outline">{planLabels[member.subscription_plan] || planLabels.none}</Badge>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full border border-border px-3 text-xs"
                      disabled
                    >
                      <QrCode className="mr-1 h-3.5 w-3.5" />
                      QR
                    </Button>
                    <Button variant="outline" size="sm" className="rounded-full px-4" disabled>
                      {t("actions.viewProfile")}
                    </Button>
                  </div>
                </div>
              );
            })}
            {members.length === 0 && (
              <div className="space-y-2 px-6 py-8 text-center text-sm text-muted">
                <p>{loadError ? t("error") : t("empty")}</p>
                {loadError && <p className="text-xs text-muted">{t("retryHint")}</p>}
              </div>
            )}
          </div>
        </section>
      </DashboardShell>
    </div>
  );
}

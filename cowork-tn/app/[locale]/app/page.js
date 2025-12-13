import { DashboardShell } from "@/components/dashboard-shell";
import { PlanCanvas } from "@/components/plan-canvas";
import { StatsGrid } from "@/components/stats-grid";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { getDashboardSnapshot } from "@/lib/dashboard-data";
import { getTranslations } from "next-intl/server";

export default async function AppDashboard({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "dashboard" });
  const tStats = await getTranslations({ locale, namespace: "stats" });

  let snapshot;
  try {
    snapshot = await getDashboardSnapshot();
  } catch (error) {
    console.error("[dashboard] Failed to load stats", error);
    snapshot = {
      spaceName: "Cowork.tn HQ",
      city: "Tunis",
      occupancyRate: 0,
      membersTotal: 0,
      membersActive: 0,
      upcomingBookings: 0,
      projectedMRR: 0,
      recentActivity: [],
    };
  }

  const statsItems = [
    { key: "occupancy", label: tStats("occupancy.label"), value: `${snapshot.occupancyRate}%`, meta: tStats("occupancy.meta") },
    {
      key: "members",
      label: tStats("members.label"),
      value: String(snapshot.membersActive),
      meta: `${snapshot.membersTotal} ${t("membersTotalLabel")}`,
    },
    { key: "bookings", label: tStats("bookings.label"), value: String(snapshot.upcomingBookings), meta: tStats("bookings.meta") },
    { key: "revenue", label: tStats("revenue.label"), value: formatCurrency(snapshot.projectedMRR || 0), meta: tStats("revenue.meta") },
  ];

  const activityFormatter = new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" });

  return (
    <div className="mx-auto w-full max-w-[2000px] space-y-6 px-6 py-10 sm:px-10 lg:px-16 2xl:px-24">
      <DashboardShell locale={locale}>
        <        section className="space-y-6">
          <div className="rounded-2xl border border-border/60 bg-card/80 p-6 shadow-lg dark:bg-card/40">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase text-muted-foreground tracking-widest">
                  {t("spaceMeta", { space: snapshot.spaceName, city: snapshot.city })}
                </p>
                <h2 className="mt-2 text-2xl font-display font-semibold text-foreground">{t("plan")}</h2>
              </div>
              <Badge variant="secondary">{snapshot.city}</Badge>
            </div>
            <div className="mt-6">
              <PlanCanvas />
            </div>
          </div>
          <StatsGrid stats={statsItems} />
        </section>
        <section className="space-y-4">
          <Card className="rounded-2xl border border-border/60 bg-card/90 shadow-lg dark:bg-card/50">
            <CardHeader>
              <CardTitle className="text-foreground">{t("activity")}</CardTitle>
              <CardDescription>{t("activityDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {snapshot.recentActivity.length ? (
                snapshot.recentActivity.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/50 bg-muted/30 p-4 dark:bg-secondary/20"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {activityFormatter.format(new Date(item.timestamp))}
                      </p>
                    </div>
                    <Badge variant={item.type === "invoice" ? "secondary" : "outline"}>{item.detail}</Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">{t("activityEmpty")}</p>
              )}
            </CardContent>
          </Card>
        </section>
      </DashboardShell>
    </div>
  );
}

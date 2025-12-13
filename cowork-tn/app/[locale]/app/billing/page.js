import { DashboardShell } from "@/components/dashboard-shell";
import { DataTable } from "@/components/data-table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BillingBarChart } from "@/components/billing-chart";
import { getBillingOverview, BILLING_STATUS_KEYS } from "@/lib/billing-data";
import { getTranslations } from "next-intl/server";
import { cn, formatCurrency } from "@/lib/utils";

const STATUS_BADGES = {
  paid: "bg-emerald-100 text-emerald-700",
  sent: "bg-blue-100 text-blue-700",
  draft: "bg-slate-100 text-slate-600",
  overdue: "bg-rose-100 text-rose-700",
};

const buildFallbackOverview = () => ({
  invoices: [],
  totals: { collected: 0, outstanding: 0, overdueCount: 0, collectionRate: 0 },
  statusTotals: BILLING_STATUS_KEYS.reduce((acc, key) => {
    acc[key] = { amount: 0, count: 0 };
    return acc;
  }, {}),
  monthlyTotals: [],
});

export default async function BillingPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "billingPage" });
  const dateFormatter = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });

  let overview;
  try {
    overview = await getBillingOverview();
  } catch (error) {
    console.error("[billing] Failed to fetch invoices", error);
    overview = buildFallbackOverview();
  }

  const columns = [
    { key: "invoice", label: t("columns.invoice"), className: "col-span-3 font-medium" },
    { key: "member", label: t("columns.member"), className: "col-span-3" },
    { key: "amount", label: t("columns.amount"), className: "col-span-3" },
    { key: "status", label: t("columns.status"), className: "col-span-3" },
  ];

  const rows = overview.invoices.map((invoice) => {
    const normalizedStatus = invoice.status || "draft";
    return {
    id: invoice.id,
    invoice: (
      <div>
        <p className="font-semibold">{invoice.invoice_number}</p>
        <p className="text-xs text-muted">{dateFormatter.format(new Date(invoice.created_at))}</p>
      </div>
    ),
    member: invoice.member?.full_name || "—",
    amount: formatCurrency(invoice.amount_tnd, locale),
    status: (
      <Badge
        variant="secondary"
          className={cn(
            "rounded-full border border-transparent px-3 py-1 text-xs font-semibold",
            STATUS_BADGES[normalizedStatus] || "bg-muted text-foreground"
          )}
      >
          {t(`statusLabels.${normalizedStatus}`)}
      </Badge>
      ),
    };
  });

  const summaryCards = [
    {
      key: "collected",
      label: t("overview.collected.label"),
      helper: t("overview.collected.helper"),
      value: formatCurrency(overview.totals.collected, locale),
    },
    {
      key: "outstanding",
      label: t("overview.outstanding.label"),
      helper: t("overview.outstanding.helper"),
      value: formatCurrency(overview.totals.outstanding, locale),
    },
    {
      key: "overdue",
      label: t("overview.overdue.label"),
      helper: t("overview.overdue.helper"),
      value: overview.totals.overdueCount,
    },
    {
      key: "collectionRate",
      label: t("overview.collectionRate.label"),
      helper: t("overview.collectionRate.helper"),
      value: `${overview.totals.collectionRate}%`,
    },
  ];

  const statusBreakdown = BILLING_STATUS_KEYS.map((status) => ({
    status,
    count: overview.statusTotals[status]?.count || 0,
    amount: overview.statusTotals[status]?.amount || 0,
  }));

  return (
    <div className="mx-auto w-full max-w-[2000px] space-y-6 px-6 py-10 sm:px-10 lg:px-16 2xl:px-24">
      <DashboardShell locale={locale}>
        <Tabs defaultValue="invoices" className="w-full">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-display font-semibold">{t("title")}</h1>
              <p className="text-muted">{t("subtitle")}</p>
            </div>
            <TabsList>
              <TabsTrigger value="invoices">{t("tabs.invoices")}</TabsTrigger>
              <TabsTrigger value="analytics">{t("tabs.analytics")}</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="invoices">
            <DataTable columns={columns} rows={rows} emptyMessage={t("tableEmpty")} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {summaryCards.map((card) => (
                <Card key={card.key} className="rounded-[28px] border border-border/70 bg-card/90 shadow-lg shadow-black/5">
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-sm font-semibold text-muted">{card.label}</CardTitle>
                    <CardDescription className="text-3xl font-display text-foreground">{card.value}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted">{card.helper}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <Card className="rounded-[32px] border border-border/70 bg-card/90 shadow-xl shadow-black/5">
                <CardHeader>
                  <CardTitle>{t("chart.title")}</CardTitle>
                  <CardDescription>{t("chart.subtitle")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <BillingBarChart
                    data={overview.monthlyTotals}
                    locale={locale}
                    labels={{
                      paid: t("chart.legendPaid"),
                      pending: t("chart.legendPending"),
                      empty: t("chart.empty"),
                    }}
                  />
                </CardContent>
              </Card>

              <Card className="rounded-[32px] border border-border/70 bg-card/90 shadow-xl shadow-black/5">
                <CardHeader>
                  <CardTitle>{t("statusBreakdown.title")}</CardTitle>
                  <CardDescription>{t("statusBreakdown.subtitle")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {statusBreakdown.map((item) => (
                    <div key={item.status} className="flex items-center justify-between rounded-2xl border border-border/60 p-4">
                      <div>
                        <p className="text-sm font-semibold">{t(`statusLabels.${item.status}`)}</p>
                        <p className="text-xs text-muted">{t("statusBreakdown.count", { count: item.count })}</p>
                      </div>
                      <p className="text-sm font-semibold">{formatCurrency(item.amount, locale)}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DashboardShell>
    </div>
  );
}

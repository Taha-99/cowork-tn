import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getTranslations } from "next-intl/server";
import { CreditCard, Download, ExternalLink, CheckCircle2, AlertCircle, Clock, FileText } from "lucide-react";

export default async function MyInvoicesPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations("coworkerInvoices");

  // Mock data (will be replaced with Supabase queries)
  const invoices = [
    {
      id: "INV-2025-018",
      date: "2025-01-15",
      dueDate: "2025-01-25",
      amount: 180,
      status: "sent",
      description: "Abonnement Pack 10 jours - Janvier 2025",
    },
    {
      id: "INV-2025-012",
      date: "2025-01-01",
      dueDate: "2025-01-10",
      amount: 180,
      status: "paid",
      description: "Abonnement Pack 10 jours - Décembre 2024",
    },
    {
      id: "INV-2024-089",
      date: "2024-12-01",
      dueDate: "2024-12-10",
      amount: 180,
      status: "paid",
      description: "Abonnement Pack 10 jours - Novembre 2024",
    },
    {
      id: "INV-2024-067",
      date: "2024-11-01",
      dueDate: "2024-11-10",
      amount: 50,
      status: "paid",
      description: "Réservation Salle Alpha - 3h",
    },
  ];

  const subscription = {
    plan: "Pack 10 jours",
    price: 180,
    billingCycle: "Mensuel",
    nextBilling: "2025-02-01",
    paymentMethod: "**** 4242",
  };

  const statusConfig = {
    draft: { icon: FileText, color: "bg-gray-500/10 text-gray-600 border-gray-500/20" },
    sent: { icon: Clock, color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
    paid: { icon: CheckCircle2, color: "bg-accent/10 text-accent border-accent/20" },
    overdue: { icon: AlertCircle, color: "bg-red-500/10 text-red-600 border-red-500/20" },
  };

  const pendingInvoices = invoices.filter((inv) => inv.status === "sent" || inv.status === "overdue");
  const totalPending = pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">{t("title")}</h1>
        <p className="text-muted-foreground mt-1">{t("subtitle")}</p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Pending payment */}
        <Card className={pendingInvoices.length > 0 ? "border-yellow-500/30 bg-yellow-500/5" : ""}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                  pendingInvoices.length > 0 ? "bg-yellow-500/20" : "bg-accent/20"
                }`}
              >
                {pendingInvoices.length > 0 ? (
                  <Clock className="h-6 w-6 text-yellow-600" />
                ) : (
                  <CheckCircle2 className="h-6 w-6 text-accent" />
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("summary.pending")}</p>
                {pendingInvoices.length > 0 ? (
                  <>
                    <p className="text-2xl font-bold">{totalPending} TND</p>
                    <p className="text-xs text-muted-foreground">
                      {pendingInvoices.length} {t("summary.invoices")}
                    </p>
                  </>
                ) : (
                  <p className="text-lg font-semibold text-accent">{t("summary.allPaid")}</p>
                )}
              </div>
            </div>
            {pendingInvoices.length > 0 && (
              <Button className="mt-4 w-full" size="lg">
                <CreditCard className="mr-2 h-4 w-4" />
                {t("actions.payNow")}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Current subscription */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("subscription.current")}</p>
                <p className="text-lg font-semibold">{subscription.plan}</p>
                <p className="text-sm text-muted-foreground">
                  {subscription.price} TND / {subscription.billingCycle.toLowerCase()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next billing */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10">
                <FileText className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("subscription.nextBilling")}</p>
                <p className="text-lg font-semibold">{subscription.nextBilling}</p>
                <p className="text-sm text-muted-foreground">{subscription.paymentMethod}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoices list */}
      <Card>
        <CardHeader>
          <CardTitle>{t("list.title")}</CardTitle>
          <CardDescription>{t("list.subtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left text-sm text-muted-foreground">
                  <th className="pb-3 font-medium">{t("columns.invoice")}</th>
                  <th className="pb-3 font-medium">{t("columns.description")}</th>
                  <th className="pb-3 font-medium">{t("columns.date")}</th>
                  <th className="pb-3 font-medium">{t("columns.amount")}</th>
                  <th className="pb-3 font-medium">{t("columns.status")}</th>
                  <th className="pb-3 font-medium text-right">{t("columns.actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {invoices.map((invoice) => {
                  const StatusIcon = statusConfig[invoice.status].icon;
                  return (
                    <tr key={invoice.id} className="group">
                      <td className="py-4">
                        <span className="font-mono text-sm font-medium">{invoice.id}</span>
                      </td>
                      <td className="py-4">
                        <span className="text-sm">{invoice.description}</span>
                      </td>
                      <td className="py-4">
                        <span className="text-sm text-muted-foreground">{invoice.date}</span>
                      </td>
                      <td className="py-4">
                        <span className="font-semibold">{invoice.amount} TND</span>
                      </td>
                      <td className="py-4">
                        <Badge className={`gap-1 ${statusConfig[invoice.status].color}`}>
                          <StatusIcon className="h-3 w-3" />
                          {t(`status.${invoice.status}`)}
                        </Badge>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          {(invoice.status === "sent" || invoice.status === "overdue") && (
                            <Button size="sm">{t("actions.pay")}</Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Payment method */}
      <Card>
        <CardHeader>
          <CardTitle>{t("paymentMethod.title")}</CardTitle>
          <CardDescription>{t("paymentMethod.subtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-2xl border border-border p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-800">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-medium">Visa {subscription.paymentMethod}</p>
                <p className="text-sm text-muted-foreground">{t("paymentMethod.expires")} 12/2027</p>
              </div>
            </div>
            <Button variant="outline">
              <ExternalLink className="mr-2 h-4 w-4" />
              {t("paymentMethod.manage")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { cn, formatCurrency } from "@/lib/utils";

export function BillingBarChart({ data = [], locale = "fr", labels = {} }) {
  const formatter = new Intl.DateTimeFormat(locale, { month: "short" });
  const maxValue = Math.max(...data.map((item) => item.paid + item.outstanding), 0);

  if (!data.length || maxValue === 0) {
    return <p className="text-sm text-muted">{labels.empty || "Pas encore de données."}</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex h-56 items-end gap-4">
        {data.map((item) => {
          const paidHeight = (item.paid / maxValue) * 100;
          const pendingHeight = (item.outstanding / maxValue) * 100;

          return (
            <div key={item.monthStart} className="flex w-full flex-col items-center gap-2">
              <div className="flex h-48 w-full flex-col justify-end rounded-full bg-border/40 p-1">
                <div
                  className={cn("rounded-t-full bg-amber-200/80", pendingHeight === 0 && "hidden")}
                  style={{ height: `${Math.max(pendingHeight, 4)}%` }}
                />
                <div
                  className={cn("rounded-b-full bg-primary/70", paidHeight === 0 && "hidden")}
                  style={{ height: `${Math.max(paidHeight, 4)}%` }}
                />
              </div>
              <span className="text-xs font-medium text-muted">{formatter.format(new Date(item.monthStart))}</span>
              <div className="text-center text-[11px] text-muted/80">
                <p>
                  {labels.paid ?? "Payé"}: {formatCurrency(item.paid, locale)}
                </p>
                <p>
                  {labels.pending ?? "En attente"}: {formatCurrency(item.outstanding, locale)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-4 text-xs text-muted">
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary/70" />
          {labels.paid ?? "Payé"}
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-amber-200/80" />
          {labels.pending ?? "En attente"}
        </span>
      </div>
    </div>
  );
}

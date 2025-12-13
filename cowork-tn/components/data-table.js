import { Card } from "@/components/ui/card";

export function DataTable({ columns = [], rows = [], emptyMessage = "" }) {
  return (
    <Card className="overflow-hidden">
      <div className="grid grid-cols-12 border-b border-border/80 bg-surface px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted">
        {columns.map((column) => (
          <div key={column.key} className={column.className || "col-span-3"}>
            {column.label}
          </div>
        ))}
      </div>
      <div className="divide-y divide-border/70">
        {rows.map((row) => (
          <div key={row.id} className="grid grid-cols-12 px-4 py-3 text-sm">
            {columns.map((column) => (
              <div key={column.key} className={column.className || "col-span-3"}>
                {row[column.key] || "—"}
              </div>
            ))}
          </div>
        ))}
        {rows.length === 0 && (
          <div className="px-4 py-6 text-center text-sm text-muted">
            {emptyMessage || "Aucune donnée disponible pour le moment."}
          </div>
        )}
      </div>
    </Card>
  );
}

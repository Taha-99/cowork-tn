import "server-only";

import { startOfMonth, subMonths } from "date-fns";
import { getSupabaseServiceRole } from "@/lib/supabase-server";
import { getDefaultSpaceSlug, getSpaceContext } from "@/lib/dashboard-data";

const MONTH_WINDOW = 6;
export const BILLING_STATUS_KEYS = ["paid", "sent", "draft", "overdue"];

const toNumber = (value) => Number(value) || 0;

export async function getBillingOverview(spaceSlug = getDefaultSpaceSlug()) {
  const space = await getSpaceContext(spaceSlug);
  const supabase = getSupabaseServiceRole();
  const rangeStart = startOfMonth(subMonths(new Date(), MONTH_WINDOW - 1));

  const { data, error } = await supabase
    .from("invoices")
    .select("id,invoice_number,amount_tnd,status,created_at,due_date,member:member_id(full_name)")
    .eq("space_id", space.id)
    .gte("created_at", rangeStart.toISOString())
    .order("created_at", { ascending: false })
    .limit(60);

  if (error) {
    throw error;
  }

  const invoices = data || [];

  const statusTotals = BILLING_STATUS_KEYS.reduce((acc, key) => {
    acc[key] = { amount: 0, count: 0 };
    return acc;
  }, {});

  let collected = 0;
  let outstanding = 0;
  let overdueCount = 0;

  for (const invoice of invoices) {
    const status = invoice.status || "draft";
    const amount = toNumber(invoice.amount_tnd);

    if (statusTotals[status]) {
      statusTotals[status].amount += amount;
      statusTotals[status].count += 1;
    }

    if (status === "paid") {
      collected += amount;
    } else {
      outstanding += amount;
      if (status === "overdue") {
        overdueCount += 1;
      }
    }
  }

  const totalInvoiced = collected + outstanding;
  const collectionRate = totalInvoiced ? Math.round((collected / totalInvoiced) * 100) : 0;

  const monthBuckets = new Map();
  const now = new Date();
  for (let i = MONTH_WINDOW - 1; i >= 0; i -= 1) {
    const monthDate = startOfMonth(subMonths(now, i));
    const key = monthDate.toISOString();
    monthBuckets.set(key, { monthStart: key, paid: 0, outstanding: 0 });
  }

  for (const invoice of invoices) {
    const monthKey = startOfMonth(new Date(invoice.created_at)).toISOString();
    if (!monthBuckets.has(monthKey)) continue;
    const bucket = monthBuckets.get(monthKey);
    const amount = toNumber(invoice.amount_tnd);
    if (invoice.status === "paid") {
      bucket.paid += amount;
    } else {
      bucket.outstanding += amount;
    }
  }

  return {
    invoices,
    totals: {
      collected,
      outstanding,
      overdueCount,
      collectionRate,
    },
    statusTotals,
    monthlyTotals: Array.from(monthBuckets.values()),
  };
}

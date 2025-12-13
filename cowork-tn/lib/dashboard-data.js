import "server-only";
import { getSupabaseServiceRole } from "@/lib/supabase-server";

const DEFAULT_SPACE_SLUG = "cowork-tn-hq";

function getSupabase() {
  return getSupabaseServiceRole();
}

async function fetchSpace(supabase, spaceSlug) {
  const { data, error } = await supabase
    .from("spaces")
    .select("id,name,city,slug")
    .eq("slug", spaceSlug)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export function getDefaultSpaceSlug() {
  return DEFAULT_SPACE_SLUG;
}

export async function getSpaceContext(spaceSlug = DEFAULT_SPACE_SLUG) {
  const supabase = getSupabase();
  return fetchSpace(supabase, spaceSlug);
}

export async function getDashboardSnapshot(spaceSlug = DEFAULT_SPACE_SLUG) {
  const supabase = getSupabase();
  const space = await fetchSpace(supabase, spaceSlug);

  const spaceId = space.id;
  const nowIso = new Date().toISOString();

  const [membersTotalRes, membersActiveRes, bookingsUpcomingRes, resourcesRes, invoicesRes, recentBookingsRes, recentInvoicesRes] =
    await Promise.all([
      supabase.from("members").select("*", { count: "exact", head: true }).eq("space_id", spaceId),
      supabase
        .from("members")
        .select("*", { count: "exact", head: true })
        .eq("space_id", spaceId)
        .eq("is_active", true),
      supabase
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .eq("space_id", spaceId)
        .gte("start_time", nowIso),
      supabase.from("resources").select("capacity").eq("space_id", spaceId),
      supabase.from("invoices").select("amount_tnd,status,created_at").eq("space_id", spaceId),
      supabase
        .from("bookings")
        .select("id,start_time,status,member:member_id(full_name)")
        .eq("space_id", spaceId)
        .order("start_time", { ascending: false })
        .limit(3),
      supabase
        .from("invoices")
        .select("id,created_at,amount_tnd,status,member:member_id(full_name)")
        .eq("space_id", spaceId)
        .order("created_at", { ascending: false })
        .limit(3),
    ]);

  if (membersTotalRes.error) throw membersTotalRes.error;
  if (membersActiveRes.error) throw membersActiveRes.error;
  if (bookingsUpcomingRes.error) throw bookingsUpcomingRes.error;
  if (resourcesRes.error) throw resourcesRes.error;
  if (invoicesRes.error) throw invoicesRes.error;
  if (recentBookingsRes.error) throw recentBookingsRes.error;
  if (recentInvoicesRes.error) throw recentInvoicesRes.error;

  const totalCapacity = (resourcesRes.data || []).reduce((sum, resource) => sum + (resource.capacity || 0), 0);
  const occupancyRate = totalCapacity > 0 ? Math.min(100, Math.round(((bookingsUpcomingRes.count || 0) / totalCapacity) * 100)) : 0;
  const projectedMRR = (invoicesRes.data || []).reduce((sum, invoice) => sum + Number(invoice.amount_tnd || 0), 0);

  const activity = [
    ...(recentBookingsRes.data || []).map((booking) => ({
      id: `booking-${booking.id}`,
      type: "booking",
      title: booking.member?.full_name || "Réservation",
      detail: booking.status,
      timestamp: booking.start_time,
    })),
    ...(recentInvoicesRes.data || []).map((invoice) => ({
      id: `invoice-${invoice.id}`,
      type: "invoice",
      title: invoice.member?.full_name || "Facture",
      detail: `${Number(invoice.amount_tnd || 0).toFixed(3)} TND - ${invoice.status}`,
      timestamp: invoice.created_at,
    })),
  ]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5);

  return {
    spaceName: space.name,
    city: space.city,
    occupancyRate,
    membersTotal: membersTotalRes.count || 0,
    membersActive: membersActiveRes.count || 0,
    upcomingBookings: bookingsUpcomingRes.count || 0,
    projectedMRR,
    recentActivity: activity,
  };
}

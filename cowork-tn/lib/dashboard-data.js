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
    // If space not found, try to get the first space or return a default
    if (error.code === 'PGRST116') { // "The result contains 0 rows"
      console.warn(`Space with slug "${spaceSlug}" not found, trying first space`);
      
      const { data: firstSpace } = await supabase
        .from("spaces")
        .select("id,name,city,slug")
        .limit(1)
        .single();
      
      if (firstSpace) {
        return firstSpace;
      }
      
      // If no spaces exist, return a default
      return {
        id: '00000000-0000-0000-0000-000000000000',
        name: 'Espace par défaut',
        city: 'Tunis',
        slug: 'default-space'
      };
    }
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
  try {
    const supabase = getSupabase();
    const space = await fetchSpace(supabase, spaceSlug);

    const spaceId = space.id;
    const nowIso = new Date().toISOString();

  const [membersTotalRes, bookingsUpcomingRes, resourcesRes, invoicesRes, recentBookingsRes, recentInvoicesRes] =
    await Promise.all([
      // Use profiles table instead of members table
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("space_id", spaceId),
      supabase
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .eq("space_id", spaceId)
        .gte("start_time", nowIso),
      supabase.from("resources").select("capacity").eq("space_id", spaceId),
      supabase.from("invoices").select("amount_tnd,status,created_at").eq("space_id", spaceId),
      supabase
        .from("bookings")
        .select("id,start_time,status,user:user_id(full_name)")
        .eq("space_id", spaceId)
        .order("start_time", { ascending: false })
        .limit(3),
      supabase
        .from("invoices")
        .select("id,created_at,amount_tnd,status,user:user_id(full_name)")
        .eq("space_id", spaceId)
        .order("created_at", { ascending: false })
        .limit(3),
    ]);

  // Handle errors
  const errors = [
    membersTotalRes.error,
    bookingsUpcomingRes.error,
    resourcesRes.error,
    invoicesRes.error,
    recentBookingsRes.error,
    recentInvoicesRes.error
  ].filter(error => error);
  
  if (errors.length > 0) {
    console.error("Errors in getDashboardSnapshot:", errors);
    throw errors[0];
  }

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
    membersActive: membersTotalRes.count || 0, // All profiles are active
    upcomingBookings: bookingsUpcomingRes.count || 0,
    projectedMRR,
    recentActivity: activity,
  };
  } catch (error) {
    console.error("Error in getDashboardSnapshot:", error);
    // Return default data
    return {
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
}

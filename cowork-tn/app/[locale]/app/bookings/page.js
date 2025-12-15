import { DashboardShell } from "@/components/dashboard-shell";
import { getTranslations } from "next-intl/server";
import { getSpaceContext } from "@/lib/dashboard-data";
import { getSupabaseServiceRole } from "@/lib/supabase-server";
import { InteractiveBookingsCalendar } from "@/components/interactive-bookings-calendar";

export default async function BookingsPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "bookingsPage" });
  const supabase = getSupabaseServiceRole();
  const space = await getSpaceContext();

  let resources = [];
  let bookings = [];
  let members = [];
  let loadError = null;

  try {
    const [resourcesRes, bookingsRes, membersRes] = await Promise.all([
      supabase
        .from("resources")
        .select("id,name")
        .eq("space_id", space.id)
        .order("name", { ascending: true }),
      supabase
        .from("bookings")
        .select(`
          id,
          start_time,
          end_time,
          status,
          resource_id,
          member_id,
          resource:resource_id(name),
          member:member_id(full_name,email)
        `)
        .eq("space_id", space.id),
      supabase
        .from("members")
        .select("id,full_name,email")
        .eq("space_id", space.id)
        .order("full_name", { ascending: true }),
    ]);

    if (resourcesRes.error) throw resourcesRes.error;
    if (bookingsRes.error) throw bookingsRes.error;
    if (membersRes.error) throw membersRes.error;

    resources = resourcesRes.data || [];
    bookings = bookingsRes.data || [];
    members = membersRes.data || [];
  } catch (error) {
    loadError = error;
    console.error("[bookings] Failed to load data", error);
  }

  return (
    <DashboardShell locale={locale}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-display font-semibold text-foreground">{t("title")}</h1>
            <p className="text-muted-foreground">{t("subtitle")}</p>
          </div>
        </div>

        {loadError && (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
            <p className="text-sm text-destructive">{t("error")}: {loadError.message}</p>
          </div>
        )}

        <InteractiveBookingsCalendar
          initialResources={resources}
          initialBookings={bookings}
          initialMembers={members}
          spaceId={space.id}
          locale={locale}
          loadError={loadError}
        />
      </div>
    </DashboardShell>
  );
}

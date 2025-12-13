import { DashboardShell } from "@/components/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getTranslations } from "next-intl/server";
import { getSpaceContext } from "@/lib/dashboard-data";
import { getSupabaseServiceRole } from "@/lib/supabase-server";
import { addDays, startOfWeek, getISOWeek, isSameDay, isSameMonth } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Plus } from "lucide-react";

const HOURS = Array.from({ length: 10 }, (_, index) => 9 + index); // 9h -> 18h
const HOUR_HEIGHT = 56;

export default async function BookingsPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "bookingsPage" });
  const supabase = getSupabaseServiceRole();
  const space = await getSpaceContext();

  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekEnd = addDays(weekStart, 7);
  const weekLabel = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(weekStart);
  const weekNumber = getISOWeek(weekStart);
  const timeFormatter = new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit" });
  const weekdayFormatter = new Intl.DateTimeFormat(locale, { weekday: "short" });

  let resources = [];
  let bookings = [];
  let loadError = null;
  try {
    const [resourcesRes, bookingsRes] = await Promise.all([
      supabase
        .from("resources")
        .select("id,name")
        .eq("space_id", space.id)
        .order("name", { ascending: true }),
      supabase
        .from("bookings")
        .select("id,start_time,end_time,status,resource_id,resource:resource_id(name),member:member_id(full_name)")
        .eq("space_id", space.id)
        .gte("start_time", weekStart.toISOString())
        .lt("start_time", weekEnd.toISOString()),
    ]);

    if (resourcesRes.error) throw resourcesRes.error;
    if (bookingsRes.error) throw bookingsRes.error;

    resources = resourcesRes.data || [];
    bookings = bookingsRes.data || [];
  } catch (error) {
    loadError = error;
    console.error("[bookings] Failed to load calendar", error);
  }

  const bookingsByResource = (resources || []).map((resource) => ({
    resource,
    bookings: (bookings || []).filter((booking) => booking.resource_id === resource.id),
  }));

  const upcoming = [...(bookings || [])]
    .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
    .slice(0, 3);

  const calendarStart = startOfWeek(new Date(today.getFullYear(), today.getMonth(), 1), { weekStartsOn: 1 });
  const calendarDays = Array.from({ length: 35 }, (_, index) => addDays(calendarStart, index));
  const weekdayLabels = Array.from({ length: 7 }, (_, index) => weekdayFormatter.format(addDays(weekStart, index)));

  const resourceStatus = (resourceId) => {
    const now = new Date();
    return (bookings || []).some((booking) => {
      if (booking.resource_id !== resourceId) return false;
      const start = new Date(booking.start_time);
      const end = new Date(booking.end_time);
      return start <= now && end > now;
    });
  };

  const bookingPosition = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const startHours = start.getHours() + start.getMinutes() / 60;
    const endHours = end.getHours() + end.getMinutes() / 60;
    const top = Math.max(0, (startHours - HOURS[0]) * HOUR_HEIGHT);
    const height = Math.max(48, (endHours - startHours) * HOUR_HEIGHT);
    return { top, height };
  };

  const statusLabels = {
    pending: t("statusLabels.pending"),
    confirmed: t("statusLabels.confirmed"),
    cancelled: t("statusLabels.cancelled"),
    checked_in: t("statusLabels.checked_in"),
  };

  return (
    <div className="mx-auto w-full max-w-[2000px] space-y-6 px-6 py-10 sm:px-10 lg:px-16 2xl:px-24">
      <div>
        <h1 className="text-3xl font-display font-semibold">{t("title")}</h1>
        <p className="text-muted">{t("subtitle")}</p>
      </div>
      <DashboardShell locale={locale}>
        <section className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[360px_minmax(0,1fr)] 2xl:grid-cols-[400px_minmax(0,1fr)]">
          <aside className="space-y-6 rounded-[32px] border border-border/70 bg-card/80 p-6 shadow-xl shadow-black/5">
            <Button className="w-full rounded-2xl" disabled>
              <Plus className="mr-2 h-4 w-4" />
              {t("newBooking")}
            </Button>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted">{t("miniCalendar")}</p>
              <div className="mt-3 rounded-3xl border border-border/60 bg-background p-4">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span>{new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(today)}</span>
                  <CalendarIcon className="h-4 w-4 text-muted" />
                </div>
                <div className="mt-3 grid grid-cols-7 gap-2 text-center text-xs text-muted">
                  {weekdayLabels.map((label, idx) => (
                    <span key={`${label}-${idx}`} className="font-semibold">
                      {label}
                    </span>
                  ))}
                </div>
                <div className="mt-2 grid grid-cols-7 gap-2 text-center text-sm">
                  {calendarDays.map((day) => {
                    const isToday = isSameDay(day, today);
                    const inMonth = isSameMonth(day, today);
                    return (
                      <span
                        key={day.toISOString()}
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ${
                          isToday
                            ? "bg-primary text-primary-foreground"
                            : inMonth
                              ? "text-foreground"
                              : "text-muted"
                        }`}
                      >
                        {day.getDate()}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted">{t("resources.title")}</p>
              <div className="mt-3 space-y-3">
                {(resources || []).map((resource) => {
                  const busy = resourceStatus(resource.id);
                  return (
                    <div key={resource.id} className="flex items-center justify-between rounded-2xl border border-border/60 px-4 py-2">
                      <span>{resource.name}</span>
                      <Badge variant={busy ? "default" : "accent"} className={busy ? "bg-amber-100 text-amber-700" : undefined}>
                        {busy ? t("resources.busy") : t("resources.available")}
                      </Badge>
                    </div>
                  );
                })}
                {resources?.length === 0 && (
                  <p className="text-sm text-muted">{loadError ? t("error") : t("resources.empty")}</p>
                )}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted">{t("upcoming")}</p>
              <div className="mt-3 space-y-3">
                {upcoming.length ? (
                  upcoming.map((booking) => (
                    <div key={booking.id} className="rounded-2xl border border-border/60 p-4">
                      <p className="text-sm font-medium">{booking.member?.full_name || "—"}</p>
                      <p className="text-xs text-muted">{booking.resource?.name || t("unknownResource")}</p>
                      <div className="mt-2 flex items-center gap-2 text-xs text-muted">
                        <Clock className="h-3.5 w-3.5" />
                        <span>
                          {timeFormatter.format(new Date(booking.start_time))} – {timeFormatter.format(new Date(booking.end_time))}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted">{loadError ? t("error") : t("empty")}</p>
                )}
              </div>
            </div>
          </aside>
          <section className="space-y-4 rounded-[32px] border border-border/70 bg-card/90 p-6 shadow-xl shadow-black/5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase text-muted tracking-widest">
                  {weekLabel} • {t("weekNumber", { week: weekNumber })}
                </p>
                <h2 className="text-2xl font-display font-semibold">{t("calendarTitle")}</h2>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="rounded-2xl border border-border" disabled>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-2xl border border-border" disabled>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <div className="rounded-full border border-border/70 p-1">
                  <Button variant="ghost" size="sm" className="rounded-full px-4" disabled>
                    {t("viewModes.day")}
                  </Button>
                  <Button variant="default" size="sm" className="rounded-full px-4" disabled>
                    {t("viewModes.week")}
                  </Button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <div
                className="grid min-w-[720px] gap-4"
                style={{ gridTemplateColumns: `80px repeat(${Math.max(resources?.length || 1, 1)}, minmax(180px, 1fr))` }}
              >
                <div className="space-y-4 pr-2 text-xs text-muted">
                  {HOURS.map((hour) => (
                    <div key={hour} className="h-14">
                      {hour}:00
                    </div>
                  ))}
                </div>
                {(resources && resources.length ? resources : [{ id: "placeholder", name: t(loadError ? "error" : "unknownResource") }]).map((resource) => (
                  <div key={resource.id} className="relative rounded-3xl border border-border/60 bg-background" style={{ height: HOURS.length * HOUR_HEIGHT }}>
                    <div className="sticky top-0 border-b border-border/60 bg-card/80 p-3 text-center text-sm font-medium">
                      {resource.name}
                    </div>
                    <div className="absolute inset-x-0 top-12 bottom-0">
                      {HOURS.map((hour, index) => (
                        <div key={`${resource.id}-${hour}`} className="border-b border-dashed border-border/40" style={{ height: HOUR_HEIGHT }} />
                      ))}
                    </div>
                    {(bookingsByResource.find((entry) => entry.resource.id === resource.id)?.bookings || []).map((booking) => {
                      const { top, height } = bookingPosition(booking.start_time, booking.end_time);
                      return (
                        <div
                          key={booking.id}
                          className="absolute left-4 right-4 rounded-3xl border border-primary/30 bg-primary/10 p-3"
                          style={{ top: top + 16, height }}
                        >
                          <p className="text-sm font-semibold">{booking.member?.full_name || t("unknownMember")}</p>
                          <p className="text-xs text-muted">
                            {timeFormatter.format(new Date(booking.start_time))} – {timeFormatter.format(new Date(booking.end_time))}
                          </p>
                          <Badge variant="outline" className="mt-2 text-[10px] uppercase">
                            {statusLabels[booking.status] || booking.status}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </section>
      </DashboardShell>
    </div>
  );
}

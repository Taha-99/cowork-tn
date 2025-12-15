import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getTranslations } from "next-intl/server";
import { Calendar, Clock, MapPin, Plus, ArrowRight } from "lucide-react";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { CoworkerShell } from "@/components/coworker-shell";

export default async function MyReservationsPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations("coworkerReservations");

  // Create Supabase client for server component
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();

  let reservations = { upcoming: [], past: [] };
  let availableResources = [];
  let loadError = null;

  if (user) {
    try {
      const now = new Date().toISOString();

      // Fetch upcoming bookings
      const { data: upcomingBookings, error: upcomingError } = await supabase
        .from("bookings")
        .select(`
          id,
          start_time,
          end_time,
          status,
          resource:resource_id(id, name, type),
          member:member_id(full_name)
        `)
        .eq("user_id", user.id)
        .gte("start_time", now)
        .order("start_time", { ascending: true });

      if (upcomingError) throw upcomingError;

      // Fetch past bookings
      const { data: pastBookings, error: pastError } = await supabase
        .from("bookings")
        .select(`
          id,
          start_time,
          end_time,
          status,
          resource:resource_id(id, name, type),
          member:member_id(full_name)
        `)
        .eq("user_id", user.id)
        .lt("start_time", now)
        .order("start_time", { ascending: false })
        .limit(10);

      if (pastError) throw pastError;

      // Fetch available resources for quick booking
      const { data: resources, error: resourcesError } = await supabase
        .from("resources")
        .select("id, name, type")
        .eq("is_active", true)
        .order("name");

      if (resourcesError) throw resourcesError;

      // Process upcoming bookings
      reservations.upcoming = (upcomingBookings || []).map(booking => ({
        id: booking.id,
        date: new Date(booking.start_time).toLocaleDateString(locale),
        time: `${new Date(booking.start_time).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })} - ${new Date(booking.end_time).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}`,
        resource: booking.resource?.name || t("unknownResource"),
        resourceType: booking.resource?.type === 'desk' ? 'desk' : 'room',
        status: booking.status,
      }));

      // Process past bookings
      reservations.past = (pastBookings || []).map(booking => ({
        id: booking.id,
        date: new Date(booking.start_time).toLocaleDateString(locale),
        time: `${new Date(booking.start_time).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })} - ${new Date(booking.end_time).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}`,
        resource: booking.resource?.name || t("unknownResource"),
        resourceType: booking.resource?.type === 'desk' ? 'desk' : 'room',
        status: booking.status,
      }));

      // Process available resources (simplified - in real app would check availability)
      availableResources = (resources || []).slice(0, 5).map(resource => ({
        id: resource.id,
        name: resource.name,
        type: resource.type === 'desk' ? 'desk' : 'room',
        available: Math.random() > 0.3, // Simplified availability check
      }));

    } catch (error) {
      loadError = error;
      console.error("Error fetching reservations:", error);
    }
  }

  const statusColors = {
    pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20 dark:bg-yellow-900/20 dark:text-yellow-400",
    confirmed: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:bg-blue-900/20 dark:text-blue-400",
    checked_in: "bg-green-500/10 text-green-600 border-green-500/20 dark:bg-green-900/20 dark:text-green-400",
    cancelled: "bg-red-500/10 text-red-600 border-red-500/20 dark:bg-red-900/20 dark:text-red-400",
  };

  return (
    <CoworkerShell locale={locale}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">{t("title")}</h1>
            <p className="text-muted-foreground mt-1">{t("subtitle")}</p>
          </div>
          <Button size="lg" className="gap-2">
            <Plus className="h-4 w-4" />
            {t("newBooking")}
          </Button>
        </div>

        {loadError && (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
            <p className="text-sm text-destructive">{t("error")}: {loadError.message}</p>
          </div>
        )}

        {/* Quick book resources */}
        <Card>
          <CardHeader>
            <CardTitle>{t("quickBook.title")}</CardTitle>
            <CardDescription>{t("quickBook.subtitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {availableResources.map((resource) => (
                <button
                  key={resource.id}
                  disabled={!resource.available}
                  className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition ${
                    resource.available
                      ? "border-border hover:border-primary hover:bg-primary/5 cursor-pointer"
                      : "border-border/50 bg-muted/30 opacity-50 cursor-not-allowed"
                  }`}
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                      resource.type === "desk" ? "bg-blue-500/10" : "bg-purple-500/10"
                    }`}
                  >
                    {resource.type === "desk" ? (
                      <MapPin className={`h-6 w-6 ${resource.type === "desk" ? "text-blue-500" : "text-purple-500"}`} />
                    ) : (
                      <Calendar className="h-6 w-6 text-purple-500" />
                    )}
                  </div>
                  <p className="text-sm font-medium">{resource.name}</p>
                  <Badge variant={resource.available ? "secondary" : "outline"} className="text-xs">
                    {resource.available ? t("quickBook.available") : t("quickBook.busy")}
                  </Badge>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming reservations */}
        <Card>
          <CardHeader>
            <CardTitle>{t("upcoming.title")}</CardTitle>
            <CardDescription>{t("upcoming.subtitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            {reservations.upcoming.length > 0 ? (
              <div className="space-y-4">
                {reservations.upcoming.map((res) => (
                  <div
                    key={res.id}
                    className="flex items-center justify-between rounded-2xl border border-border bg-card p-5"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                          res.resourceType === "desk" ? "bg-blue-500/10" : "bg-purple-500/10"
                        }`}
                      >
                        {res.resourceType === "desk" ? (
                          <MapPin className="h-7 w-7 text-blue-500" />
                        ) : (
                          <Calendar className="h-7 w-7 text-purple-500" />
                        )}
                      </div>
                      <div>
                        <p className="text-lg font-semibold">{res.resource}</p>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {res.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {res.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={statusColors[res.status]}>{t(`status.${res.status}`)}</Badge>
                      <Button variant="ghost" size="sm">
                        {t("actions.details")}
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-4 text-muted-foreground">{loadError ? t("error") : t("upcoming.empty")}</p>
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  {t("newBooking")}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Past reservations */}
        <Card>
          <CardHeader>
            <CardTitle>{t("past.title")}</CardTitle>
            <CardDescription>{t("past.subtitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            {reservations.past.length > 0 ? (
              <div className="space-y-3">
                {reservations.past.map((res) => (
                  <div
                    key={res.id}
                    className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/30 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                          res.resourceType === "desk" ? "bg-blue-500/10" : "bg-purple-500/10"
                        }`}
                      >
                        {res.resourceType === "desk" ? (
                          <MapPin className="h-5 w-5 text-blue-500" />
                        ) : (
                          <Calendar className="h-5 w-5 text-purple-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{res.resource}</p>
                        <p className="text-sm text-muted-foreground">
                          {res.date} • {res.time}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-muted-foreground">
                      {t(`status.${res.status}`)}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-8 text-center text-muted-foreground">{loadError ? t("error") : t("past.empty")}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </CoworkerShell>
  );
}

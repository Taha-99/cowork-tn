import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getTranslations } from "next-intl/server";
import { Calendar, Clock, MapPin, Plus, ArrowRight } from "lucide-react";

export default async function MyReservationsPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations("coworkerReservations");

  // Mock data (will be replaced with Supabase queries)
  const reservations = {
    upcoming: [
      {
        id: "res-1",
        date: "2025-01-20",
        time: "09:00 - 12:00",
        resource: "Poste A3",
        resourceType: "desk",
        status: "confirmed",
      },
      {
        id: "res-2",
        date: "2025-01-22",
        time: "14:00 - 18:00",
        resource: "Salle Alpha",
        resourceType: "room",
        status: "pending",
      },
    ],
    past: [
      {
        id: "res-3",
        date: "2025-01-15",
        time: "09:00 - 17:00",
        resource: "Poste A3",
        resourceType: "desk",
        status: "checked_in",
      },
      {
        id: "res-4",
        date: "2025-01-10",
        time: "10:00 - 12:00",
        resource: "Salle Beta",
        resourceType: "room",
        status: "checked_in",
      },
    ],
  };

  const availableResources = [
    { id: "desk-1", name: "Poste A1", type: "desk", available: true },
    { id: "desk-2", name: "Poste A2", type: "desk", available: true },
    { id: "desk-3", name: "Poste A3", type: "desk", available: false },
    { id: "room-1", name: "Salle Alpha", type: "room", available: true },
    { id: "room-2", name: "Salle Beta", type: "room", available: false },
  ];

  const statusColors = {
    pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    confirmed: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    checked_in: "bg-accent/10 text-accent border-accent/20",
    cancelled: "bg-red-500/10 text-red-600 border-red-500/20",
  };

  return (
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
              <p className="mt-4 text-muted-foreground">{t("upcoming.empty")}</p>
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
            <p className="py-8 text-center text-muted-foreground">{t("past.empty")}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

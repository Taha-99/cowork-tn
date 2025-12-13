import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getTranslations } from "next-intl/server";
import { User, Mail, Phone, MapPin, Calendar, Shield, Edit, Camera, Bell, Moon, Globe } from "lucide-react";

export default async function MyProfilePage({ params }) {
  const { locale } = await params;
  const t = await getTranslations("coworkerProfile");

  // Mock data (will be replaced with Supabase queries)
  const profile = {
    full_name: "Ahmed Ben Ali",
    email: "ahmed@example.com",
    phone: "+216 50 123 456",
    avatar_url: null,
    memberSince: "2024-06-15",
    space: {
      name: "Cogite Lac 2",
      address: "Rue du Lac Léman, Tunis",
    },
    subscription: {
      plan: "Pack 10 jours",
      status: "active",
      renewsAt: "2025-02-01",
    },
  };

  const preferences = {
    notifications: true,
    darkMode: false,
    language: locale,
  };

  const initials = profile.full_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">{t("title")}</h1>
        <p className="text-muted-foreground mt-1">{t("subtitle")}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile card */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition hover:bg-primary/90">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <h2 className="mt-4 text-xl font-semibold">{profile.full_name}</h2>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
              <Badge className="mt-2 bg-accent/10 text-accent border-accent/20">
                {profile.subscription.plan}
              </Badge>
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {t("memberSince")} {profile.memberSince}
              </div>
            </div>

            <div className="mt-6 border-t border-border pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{profile.space.name}</p>
                    <p className="text-xs text-muted-foreground">{profile.space.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{t("accountStatus")}</p>
                    <Badge variant="secondary" className="text-xs">
                      {t("statusLabels.active")}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details */}
        <div className="space-y-6 lg:col-span-2">
          {/* Personal info */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{t("personalInfo.title")}</CardTitle>
                <CardDescription>{t("personalInfo.subtitle")}</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Edit className="mr-2 h-4 w-4" />
                {t("actions.edit")}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">{t("fields.fullName")}</label>
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <span>{profile.full_name}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">{t("fields.email")}</label>
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <span>{profile.email}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">{t("fields.phone")}</label>
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <span>{profile.phone}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">{t("fields.space")}</label>
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <span>{profile.space.name}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription */}
          <Card>
            <CardHeader>
              <CardTitle>{t("subscription.title")}</CardTitle>
              <CardDescription>{t("subscription.subtitle")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between rounded-2xl border border-border bg-gradient-to-r from-primary/5 to-accent/5 p-6">
                <div>
                  <p className="text-lg font-semibold">{profile.subscription.plan}</p>
                  <p className="text-sm text-muted-foreground">
                    {t("subscription.renewsAt")} {profile.subscription.renewsAt}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">{t("actions.changePlan")}</Button>
                  <Button>{t("actions.renewNow")}</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>{t("preferences.title")}</CardTitle>
              <CardDescription>{t("preferences.subtitle")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-xl border border-border p-4">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{t("preferences.notifications")}</p>
                      <p className="text-sm text-muted-foreground">{t("preferences.notificationsDesc")}</p>
                    </div>
                  </div>
                  <div
                    className={`h-6 w-11 rounded-full transition ${
                      preferences.notifications ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <div
                      className={`h-5 w-5 translate-y-0.5 rounded-full bg-white shadow transition ${
                        preferences.notifications ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-border p-4">
                  <div className="flex items-center gap-3">
                    <Moon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{t("preferences.darkMode")}</p>
                      <p className="text-sm text-muted-foreground">{t("preferences.darkModeDesc")}</p>
                    </div>
                  </div>
                  <div
                    className={`h-6 w-11 rounded-full transition ${
                      preferences.darkMode ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <div
                      className={`h-5 w-5 translate-y-0.5 rounded-full bg-white shadow transition ${
                        preferences.darkMode ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-border p-4">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{t("preferences.language")}</p>
                      <p className="text-sm text-muted-foreground">{t("preferences.languageDesc")}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{locale === "fr" ? "Français" : "العربية"}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger zone */}
          <Card className="border-destructive/30">
            <CardHeader>
              <CardTitle className="text-destructive">{t("danger.title")}</CardTitle>
              <CardDescription>{t("danger.subtitle")}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive">{t("danger.deleteAccount")}</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

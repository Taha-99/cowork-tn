import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getTranslations } from "next-intl/server";
import { CalendarDays, CreditCard, Clock, Zap, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export default async function MySpacePage({ params }) {
  const { locale } = await params;
  const t = await getTranslations("coworkerDashboard");

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
  
  let memberData = {
    plan: "Pack 10 jours",
    creditsRemaining: 6,
    creditsTotal: 10,
    nextReservation: null,
    pendingInvoice: null,
    recentActivity: [],
  };

  if (user) {
    try {
      // Fetch user profile with space info
      const { data: profile } = await supabase
        .from("profiles")
        .select(`
          *,
          spaces!space_id (
            name,
            plan
          )
        `)
        .eq("id", user.id)
        .single();

      if (profile) {
        // Fetch upcoming bookings
        const today = new Date().toISOString().split('T')[0];
        const { data: upcomingBookings } = await supabase
          .from("bookings")
          .select("*")
          .eq("user_id", user.id)
          .gte("start_time", `${today}T00:00:00`)
          .order("start_time", { ascending: true })
          .limit(1);

        // Fetch pending invoices
        const { data: pendingInvoices } = await supabase
          .from("invoices")
          .select("*")
          .eq("user_id", user.id)
          .eq("status", "pending")
          .order("due_date", { ascending: true })
          .limit(1);

        // Fetch recent activity
        const { data: recentActivity } = await supabase
          .from("activity_log")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5);

        // Calculate credits (simplified)
        const planCredits = {
          'starter': 10,
          'pro': 20,
          'enterprise': 40,
          'flex': 15,
          'pack 10 jours': 10
        };
        
        const creditsTotal = planCredits[profile.spaces?.plan?.toLowerCase()] || 10;
        
        // Count used credits (bookings in current month)
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        const { count: usedCredits } = await supabase
          .from("bookings")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .gte("start_time", `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`)
          .lte("start_time", `${currentYear}-${currentMonth.toString().padStart(2, '0')}-31`);
        
        const creditsRemaining = Math.max(0, creditsTotal - (usedCredits || 0));

        // Format next reservation
        const nextReservation = upcomingBookings && upcomingBookings.length > 0 ? {
          date: new Date(upcomingBookings[0].start_time).toISOString().split('T')[0],
          time: `${new Date(upcomingBookings[0].start_time).toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })} - ${new Date(upcomingBookings[0].end_time).toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}`,
          resource: upcomingBookings[0].resource_name || "Ressource"
        } : null;

        // Format pending invoice
        const pendingInvoice = pendingInvoices && pendingInvoices.length > 0 ? {
          id: pendingInvoices[0].invoice_number || `INV-${pendingInvoices[0].id}`,
          amount: pendingInvoices[0].amount_tnd || 0,
          dueDate: pendingInvoices[0].due_date?.split('T')[0] || "Date inconnue"
        } : null;

        // Format recent activity
        const formattedRecentActivity = recentActivity?.map(activity => {
          const base = {
            date: activity.created_at?.split('T')[0] || "Date inconnue"
          };
          
          switch (activity.action_type) {
            case 'booking_created':
              return { ...base, type: "booking", resource: activity.entity_type || "Ressource" };
            case 'checkin':
              return { ...base, type: "checkin", resource: activity.entity_type || "Poste" };
            case 'payment':
              return { ...base, type: "payment", amount: activity.metadata?.amount || 0 };
            default:
              return { ...base, type: "info", resource: activity.action_description || "Activité" };
          }
        }) || [];

        memberData = {
          plan: profile.spaces?.plan || "Pack 10 jours",
          creditsRemaining,
          creditsTotal,
          nextReservation,
          pendingInvoice,
          recentActivity: formattedRecentActivity,
        };
      }
    } catch (err) {
      console.error("Error loading member data:", err);
      // Keep default mock data on error
    }
  }

  const usagePercent = (memberData.creditsRemaining / memberData.creditsTotal) * 100;

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">{t("welcomeTitle")}</h1>
        <p className="text-muted-foreground mt-1">{t("welcomeSubtitle")}</p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Current plan */}
        <Card className="relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("stats.plan")}</p>
                <p className="text-lg font-semibold">{memberData.plan}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Credits remaining */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10">
                <Clock className="h-6 w-6 text-accent" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">{t("stats.credits")}</p>
                <p className="text-lg font-semibold">
                  {memberData.creditsRemaining}/{memberData.creditsTotal} {t("stats.days")}
                </p>
              </div>
            </div>
            <div className="mt-3 h-2 rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-accent transition-all"
                style={{ width: `${usagePercent}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Next reservation */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10">
                <CalendarDays className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("stats.nextBooking")}</p>
                {memberData.nextReservation ? (
                  <>
                    <p className="text-sm font-semibold">{memberData.nextReservation.resource}</p>
                    <p className="text-xs text-muted-foreground">
                      {memberData.nextReservation.date} • {memberData.nextReservation.time}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">{t("stats.noBooking")}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending invoice */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10">
                <CreditCard className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t("stats.pendingPayment")}</p>
                {memberData.pendingInvoice ? (
                  <>
                    <p className="text-lg font-semibold">{memberData.pendingInvoice.amount} TND</p>
                    <p className="text-xs text-muted-foreground">
                      {t("stats.dueBy")} {memberData.pendingInvoice.dueDate}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-accent flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    {t("stats.allPaid")}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions & Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick actions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">{t("quickActions.title")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-between" size="lg">
              <Link href={`/${locale}/my/reservations`}>
                {t("quickActions.newBooking")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-between" size="lg">
              <Link href={`/${locale}/my/invoices`}>
                {t("quickActions.payInvoice")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-between" size="lg">
              <Link href={`/${locale}/my/profile`}>
                {t("quickActions.updateProfile")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">{t("activity.title")}</CardTitle>
            <CardDescription>{t("activity.subtitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {memberData.recentActivity.map((activity, i) => (
                <div key={i} className="flex items-center gap-4 rounded-xl bg-muted/50 p-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      activity.type === "checkin"
                        ? "bg-accent/20 text-accent"
                        : activity.type === "booking"
                        ? "bg-blue-500/20 text-blue-500"
                        : "bg-primary/20 text-primary"
                    }`}
                  >
                    {activity.type === "checkin" && <CheckCircle2 className="h-5 w-5" />}
                    {activity.type === "booking" && <CalendarDays className="h-5 w-5" />}
                    {activity.type === "payment" && <CreditCard className="h-5 w-5" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {activity.type === "checkin" && t("activity.types.checkin")}
                      {activity.type === "booking" && t("activity.types.booking")}
                      {activity.type === "payment" && t("activity.types.payment")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.resource && `${activity.resource} • `}
                      {activity.amount && `${activity.amount} TND • `}
                      {activity.date}
                    </p>
                  </div>
                  <Badge variant="secondary">{t(`activity.labels.${activity.type}`)}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Space info */}
      <Card className="border-dashed">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm text-muted-foreground">{t("spaceInfo.label")}</p>
            <p className="text-lg font-semibold">Cogite Lac 2</p>
            <p className="text-sm text-muted-foreground">Rue du Lac Léman, Tunis</p>
          </div>
          <Button variant="outline">{t("spaceInfo.contact")}</Button>
        </CardContent>
      </Card>
    </div>
  );
}

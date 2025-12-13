"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { getSupabaseClient } from "@/lib/supabase";
import Link from "next/link";
import {
  Building2,
  Users,
  CreditCard,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Activity,
  Globe,
  DollarSign,
  BarChart,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";

export default function SuperAdminDashboard({ params }) {
  const { locale } = React.use(params);
  const [stats, setStats] = React.useState({
    totalSpaces: 0,
    activeSpaces: 0,
    totalUsers: 0,
    monthlyRevenue: 0,
    growth: 12.5,
  });
  const [recentSpaces, setRecentSpaces] = React.useState([]);
  const [recentActivity, setRecentActivity] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      try {
        const supabase = getSupabaseClient();
        
        // Fetch spaces
        const { data: spaces, error: spacesError } = await supabase
          .from("spaces")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5);
        
        // Fetch users count
        const { count: usersCount } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true });
        
        // Fetch recent activity
        const { data: activity } = await supabase
          .from("activity_log")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(10);
        
        if (spaces) {
          setRecentSpaces(spaces);
          setStats(prev => ({
            ...prev,
            totalSpaces: spaces.length,
            activeSpaces: spaces.filter(s => s.status === "active").length,
          }));
        }
        
        if (usersCount) {
          setStats(prev => ({ ...prev, totalUsers: usersCount }));
        }
        
        if (activity) {
          setRecentActivity(activity);
        }
        
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadData();
  }, []);

  // Mock data for demo
  const mockStats = [
    {
      title: "Total Espaces",
      value: stats.totalSpaces || 24,
      change: "+3",
      trend: "up",
      icon: Building2,
      color: "bg-blue-500",
    },
    {
      title: "Utilisateurs",
      value: stats.totalUsers || 1842,
      change: "+127",
      trend: "up",
      icon: Users,
      color: "bg-green-500",
    },
    {
      title: "Revenus Mensuels",
      value: "45,230 TND",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "bg-amber-500",
    },
    {
      title: "Taux de Conversion",
      value: "24.8%",
      change: "+2.3%",
      trend: "up",
      icon: BarChart,
      color: "bg-purple-500",
    },
  ];

  const mockSpaces = recentSpaces.length > 0 ? recentSpaces : [
    { id: 1, name: "Hive Tunis", city: "Tunis", status: "active", members_count: 142, plan: "Pro" },
    { id: 2, name: "LaStation Sousse", city: "Sousse", status: "trial", members_count: 58, plan: "Starter" },
    { id: 3, name: "Tech Hub Sfax", city: "Sfax", status: "active", members_count: 89, plan: "Enterprise" },
    { id: 4, name: "CoWork Hammamet", city: "Hammamet", status: "pending", members_count: 0, plan: "Starter" },
    { id: 5, name: "Digital Lab Bizerte", city: "Bizerte", status: "active", members_count: 34, plan: "Pro" },
  ];

  const mockActivities = [
    { id: 1, action: "Nouveau espace créé", target: "Tech Hub Sfax", time: "Il y a 2h", type: "space" },
    { id: 2, action: "Paiement reçu", target: "Hive Tunis - 890 TND", time: "Il y a 4h", type: "payment" },
    { id: 3, action: "Nouvel utilisateur", target: "ahmed@example.com", time: "Il y a 5h", type: "user" },
    { id: 4, action: "Espace mis à niveau", target: "LaStation → Pro", time: "Il y a 8h", type: "upgrade" },
    { id: 5, action: "Support ticket", target: "#1234 - Problème facturation", time: "Il y a 12h", type: "support" },
  ];

  const getStatusBadge = (status) => {
    const styles = {
      active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      trial: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      suspended: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return styles[status] || styles.pending;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-semibold text-foreground">
            Dashboard Super Admin
          </h1>
          <p className="text-muted-foreground mt-1">
            Vue d'ensemble de la plateforme CoWork
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            Exporter les données
          </Button>
          <Button asChild>
            <Link href={`/${locale}/super-admin/spaces`}>
              <Building2 className="mr-2 h-4 w-4" />
              Gérer les espaces
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {mockStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-2">
                      {stat.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                      <span className={`text-sm font-medium ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                        {stat.change}
                      </span>
                      <span className="text-xs text-muted-foreground">ce mois</span>
                    </div>
                  </div>
                  <div className={`rounded-2xl ${stat.color} p-3`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Spaces */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Espaces Récents</CardTitle>
              <CardDescription>Les derniers espaces créés sur la plateforme</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/${locale}/super-admin/spaces`}>
                Voir tout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockSpaces.map((space) => (
                <div
                  key={space.id}
                  className="flex items-center justify-between rounded-xl border border-border p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-semibold">
                      {space.name[0]}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{space.name}</p>
                      <p className="text-sm text-muted-foreground">{space.city}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{space.members_count} membres</p>
                      <p className="text-xs text-muted-foreground">{space.plan}</p>
                    </div>
                    <Badge className={getStatusBadge(space.status)}>
                      {space.status === "active" && "Actif"}
                      {space.status === "trial" && "Essai"}
                      {space.status === "pending" && "En attente"}
                      {space.status === "suspended" && "Suspendu"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Activité Récente</CardTitle>
            <CardDescription>Les dernières actions sur la plateforme</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className={`mt-0.5 rounded-full p-1.5 ${
                    activity.type === "space" ? "bg-blue-100 text-blue-600" :
                    activity.type === "payment" ? "bg-green-100 text-green-600" :
                    activity.type === "user" ? "bg-purple-100 text-purple-600" :
                    activity.type === "upgrade" ? "bg-amber-100 text-amber-600" :
                    "bg-gray-100 text-gray-600"
                  }`}>
                    {activity.type === "space" && <Building2 className="h-3 w-3" />}
                    {activity.type === "payment" && <CreditCard className="h-3 w-3" />}
                    {activity.type === "user" && <Users className="h-3 w-3" />}
                    {activity.type === "upgrade" && <TrendingUp className="h-3 w-3" />}
                    {activity.type === "support" && <AlertCircle className="h-3 w-3" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground truncate">{activity.target}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" asChild>
              <Link href={`/${locale}/super-admin/spaces`}>
                <Building2 className="h-6 w-6 text-primary" />
                <span>Ajouter un espace</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" asChild>
              <Link href={`/${locale}/super-admin/users`}>
                <Users className="h-6 w-6 text-primary" />
                <span>Gérer les utilisateurs</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" asChild>
              <Link href={`/${locale}/super-admin/billing`}>
                <CreditCard className="h-6 w-6 text-primary" />
                <span>Voir les factures</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" asChild>
              <Link href={`/${locale}/super-admin/analytics`}>
                <BarChart className="h-6 w-6 text-primary" />
                <span>Voir les analytiques</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

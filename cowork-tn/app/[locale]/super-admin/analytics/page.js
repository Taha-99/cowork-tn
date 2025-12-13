"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  Calendar,
  DollarSign,
  Activity,
  ArrowRight,
  Globe,
  Zap,
} from "lucide-react";

export default function AnalyticsPage({ params }) {
  const { locale } = React.use(params);

  const stats = [
    { title: "Utilisateurs actifs", value: "1,842", change: "+127 cette semaine", trend: "up" },
    { title: "Réservations", value: "3,456", change: "+234 ce mois", trend: "up" },
    { title: "Taux d'occupation moyen", value: "78%", change: "+5% vs mois dernier", trend: "up" },
    { title: "Revenus projetés", value: "52,340 TND", change: "+18% vs mois dernier", trend: "up" },
  ];

  const topSpaces = [
    { name: "Hive Tunis", city: "Tunis", members: 142, revenue: 4500, growth: 12 },
    { name: "Tech Hub Sfax", city: "Sfax", members: 89, revenue: 8900, growth: 23 },
    { name: "LaStation Sousse", city: "Sousse", members: 58, revenue: 1200, growth: -5 },
    { name: "Digital Lab Bizerte", city: "Bizerte", members: 34, revenue: 2800, growth: 8 },
  ];

  const recentMetrics = [
    { label: "Nouveaux utilisateurs", value: 45, period: "7 derniers jours" },
    { label: "Réservations créées", value: 189, period: "7 derniers jours" },
    { label: "Factures payées", value: 23, period: "7 derniers jours" },
    { label: "Tickets support", value: 12, period: "7 derniers jours" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-semibold text-foreground">
            Analytiques
          </h1>
          <p className="text-muted-foreground mt-1">
            Vue d'ensemble des performances de la plateforme
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            Cette semaine
          </Button>
          <Button variant="outline">
            Ce mois
          </Button>
          <Button>
            Personnalisé
          </Button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col">
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-3xl font-bold text-foreground mt-2">{stat.value}</p>
                <div className="flex items-center gap-1 mt-3">
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-sm ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className="absolute right-4 top-4 opacity-10">
                {index === 0 && <Users className="h-16 w-16" />}
                {index === 1 && <Calendar className="h-16 w-16" />}
                {index === 2 && <Building2 className="h-16 w-16" />}
                {index === 3 && <DollarSign className="h-16 w-16" />}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts placeholder */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-primary" />
              Revenus mensuels
            </CardTitle>
            <CardDescription>Évolution des revenus sur les 6 derniers mois</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between h-48 gap-2">
              {[35, 45, 52, 48, 62, 78].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-gradient-to-t from-primary to-primary/60 rounded-t-lg transition-all hover:from-primary/90"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {["Oct", "Nov", "Déc", "Jan", "Fév", "Mar"][i]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Activité utilisateurs
            </CardTitle>
            <CardDescription>Connexions quotidiennes cette semaine</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between h-48 gap-2">
              {[42, 58, 65, 72, 68, 54, 80].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-gradient-to-t from-accent to-accent/60 rounded-t-lg transition-all hover:from-accent/90"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"][i]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Spaces & Metrics */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Top Espaces par Performance</CardTitle>
            <CardDescription>Classement basé sur les revenus et la croissance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSpaces.map((space, index) => (
                <div
                  key={space.name}
                  className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold text-white ${
                      index === 0 ? "bg-amber-500" :
                      index === 1 ? "bg-gray-400" :
                      index === 2 ? "bg-amber-700" :
                      "bg-primary"
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{space.name}</p>
                      <p className="text-sm text-muted-foreground">{space.city} • {space.members} membres</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">{space.revenue.toLocaleString()} TND</p>
                    <div className="flex items-center justify-end gap-1">
                      {space.growth >= 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500" />
                      )}
                      <span className={`text-xs ${space.growth >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {space.growth >= 0 ? "+" : ""}{space.growth}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Métriques rapides
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMetrics.map((metric) => (
                <div key={metric.label} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="text-sm font-medium text-foreground">{metric.label}</p>
                    <p className="text-xs text-muted-foreground">{metric.period}</p>
                  </div>
                  <span className="text-2xl font-bold text-primary">{metric.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Geographic Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Distribution géographique
          </CardTitle>
          <CardDescription>Répartition des espaces et utilisateurs par région</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { region: "Grand Tunis", spaces: 8, users: 856, percentage: 45 },
              { region: "Sahel", spaces: 6, users: 423, percentage: 25 },
              { region: "Cap Bon", spaces: 4, users: 234, percentage: 15 },
              { region: "Nord-Ouest", spaces: 3, users: 189, percentage: 15 },
            ].map((item) => (
              <div key={item.region} className="p-4 rounded-xl border border-border">
                <p className="font-medium text-foreground">{item.region}</p>
                <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.spaces} espaces</span>
                  <span className="font-medium text-foreground">{item.users} users</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

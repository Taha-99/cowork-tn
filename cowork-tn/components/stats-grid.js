"use client";

import { useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, Users, DollarSign, Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react";

const iconMap = {
  occupancy: TrendingUp,
  members: Users,
  revenue: DollarSign,
  bookings: Calendar,
};

const gradientMap = {
  occupancy: {
    bg: "from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20",
    icon: "bg-gradient-to-br from-blue-500 to-cyan-500",
    text: "text-blue-600 dark:text-blue-400",
  },
  members: {
    bg: "from-emerald-500/10 to-green-500/10 dark:from-emerald-500/20 dark:to-green-500/20",
    icon: "bg-gradient-to-br from-emerald-500 to-green-500",
    text: "text-emerald-600 dark:text-emerald-400",
  },
  revenue: {
    bg: "from-violet-500/10 to-purple-500/10 dark:from-violet-500/20 dark:to-purple-500/20",
    icon: "bg-gradient-to-br from-violet-500 to-purple-500",
    text: "text-violet-600 dark:text-violet-400",
  },
  bookings: {
    bg: "from-orange-500/10 to-amber-500/10 dark:from-orange-500/20 dark:to-amber-500/20",
    icon: "bg-gradient-to-br from-orange-500 to-amber-500",
    text: "text-orange-600 dark:text-orange-400",
  },
};

const trendData = {
  occupancy: { change: "+12%", positive: true },
  members: { change: "+34", positive: true },
  revenue: { change: "+18%", positive: true },
  bookings: { change: "+8", positive: true },
};

export function StatsGrid({ stats }) {
  const t = useTranslations("stats");

  const fallbackStats = [
    { key: "occupancy", label: t("occupancy.label"), value: "86%", meta: t("occupancy.meta") },
    { key: "members", label: t("members.label"), value: "312", meta: t("members.meta") },
    { key: "revenue", label: t("revenue.label"), value: formatCurrency(42000), meta: t("revenue.meta") },
  ];

  const items = stats && stats.length ? stats : fallbackStats;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((stat) => {
        const Icon = iconMap[stat.key] || TrendingUp;
        const colors = gradientMap[stat.key] || gradientMap.occupancy;
        const trend = trendData[stat.key];
        
        return (
          <div
            key={stat.key}
            className={`group relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br ${colors.bg} p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-border/60 dark:border-border/20 dark:hover:border-border/40`}
          >
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
              backgroundSize: '24px 24px'
            }} />
            
            <div className="relative flex items-start justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${colors.icon} text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="text-sm font-semibold text-foreground/80">{stat.label}</p>
                </div>
                
                <div>
                  <p className="text-3xl font-display font-bold tracking-tight text-foreground">{stat.value}</p>
                  
                  <div className="mt-2 flex items-center gap-2">
                    {trend && (
                      <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
                        trend.positive 
                          ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' 
                          : 'bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400'
                      }`}>
                        {trend.positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {trend.change}
                      </span>
                    )}
                    {stat.meta && (
                      <p className="text-xs text-muted-foreground">{stat.meta}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Monitor, DoorOpen, Coffee, Users, Wifi } from "lucide-react";

const mockDesks = [
  { id: 1, name: "A1", type: "desk", status: "available" },
  { id: 2, name: "A2", type: "desk", status: "occupied" },
  { id: 3, name: "A3", type: "desk", status: "available" },
  { id: 4, name: "B1", type: "desk", status: "occupied" },
  { id: 5, name: "B2", type: "desk", status: "available" },
  { id: 6, name: "B3", type: "desk", status: "occupied" },
  { id: 7, name: "Salle Alpha", type: "room", status: "available" },
  { id: 8, name: "Salle Beta", type: "room", status: "occupied" },
  { id: 9, name: "Lounge", type: "lounge", status: "available" },
];

const statusColors = {
  available: "border-accent/50 bg-accent/5 dark:bg-accent/10",
  occupied: "border-primary/50 bg-primary/5 dark:bg-primary/10",
};

const typeIcons = {
  desk: Monitor,
  room: DoorOpen,
  lounge: Coffee,
};

export function PlanCanvas({ className }) {
  const t = useTranslations("canvas");

  return (
    <div className={cn("rounded-2xl border border-border/50 bg-muted/30 p-6 dark:bg-secondary/20", className)}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-foreground">{t("hint")}</p>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-accent" />
            <span className="text-muted-foreground">Disponible</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-primary" />
            <span className="text-muted-foreground">Occupé</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {mockDesks.map((item) => {
          const Icon = typeIcons[item.type] || Monitor;
          return (
            <div
              key={item.id}
              className={cn(
                "group relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-4 transition-all duration-200 cursor-pointer",
                "hover:scale-[1.02] hover:shadow-md",
                statusColors[item.status]
              )}
            >
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                item.status === "available" 
                  ? "bg-accent/10 text-accent dark:bg-accent/20" 
                  : "bg-primary/10 text-primary dark:bg-primary/20"
              )}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-sm font-medium text-foreground">{item.name}</span>
              <span className={cn(
                "text-xs",
                item.status === "available" ? "text-accent" : "text-primary"
              )}>
                {item.status === "available" ? "Libre" : "Occupé"}
              </span>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        {t("todo")}
      </p>
    </div>
  );
}

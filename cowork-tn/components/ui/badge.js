'use client';

import { cn } from "@/lib/utils";

const badgeVariants = {
  default: "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary px-3 py-1",
  secondary: "bg-secondary text-secondary-foreground dark:bg-secondary/60 px-3 py-1",
  outline: "border border-border text-muted-foreground dark:border-border/60 px-3 py-1",
  accent: "bg-accent/15 text-accent dark:bg-accent/20 px-3 py-1",
  destructive: "bg-destructive/10 text-destructive dark:bg-destructive/20 px-3 py-1",
  success: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 px-3 py-1",
  warning: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 px-3 py-1",
};

export function Badge({ className, variant = "default", ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full text-xs font-medium tracking-wide transition-colors",
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  );
}

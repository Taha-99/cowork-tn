'use client';

import * as React from "react";
import { MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme = "light", setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-secondary" aria-hidden />
    );
  }

  const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
  const isDark = resolvedTheme === "dark";

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(nextTheme)}
      className={`
        relative inline-flex h-10 w-10 items-center justify-center rounded-xl
        border border-border/50 bg-secondary/50
        transition-all duration-300 ease-out
        hover:bg-secondary hover:scale-105 hover:shadow-lg
        active:scale-95
        ${isDark ? "hover:shadow-primary/20" : "hover:shadow-black/10"}
      `}
    >
      <span className="relative h-5 w-5">
        {/* Sun icon */}
        <SunMedium 
          className={`
            absolute inset-0 h-5 w-5 text-amber-500
            transition-all duration-300
            ${isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}
          `}
        />
        {/* Moon icon */}
        <MoonStar 
          className={`
            absolute inset-0 h-5 w-5 text-blue-400
            transition-all duration-300
            ${isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"}
          `}
        />
      </span>
    </button>
  );
}

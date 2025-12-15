'use client';

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { fr, ar } from 'date-fns/locale';
import { cn } from "@/lib/utils";
import "react-day-picker/dist/style.css";

function Calendar({ className, classNames, showOutsideDays = true, locale: localeProp, plain = false, ...props }) {
  // Map locale string to date-fns locale object when needed
  let localeObj = undefined;
  if (localeProp) {
    if (typeof localeProp === 'string') {
      if (localeProp.startsWith('fr')) localeObj = fr;
      else if (localeProp.startsWith('ar')) localeObj = ar;
      else localeObj = undefined;
    } else {
      localeObj = localeProp;
    }
  }

  const baseClass = plain
    ? cn("w-full", className)
    : cn("rounded-3xl border border-border bg-card p-4", className);

  return (
    <DayPicker
      locale={localeObj}
      showOutsideDays={showOutsideDays}
      className={baseClass}
      classNames={{
        months: "flex flex-col space-y-4",
        month: "space-y-4",
        caption: "flex justify-between px-2 text-sm font-semibold",
        nav: "flex items-center gap-2",
        table: "w-full border-collapse text-sm",
        head_row: "flex items-center",
        head_cell: "text-muted w-10 text-center font-medium",
        row: "flex w-full",
        cell: "relative h-10 w-10 text-center text-sm",
        day: cn(
          "h-10 w-10 rounded-full leading-10 transition hover:bg-surface",
          "rdp-day"
        ),
        day_selected: "bg-primary text-primary-foreground font-semibold",
        day_today: "border border-primary text-primary font-semibold",
        day_disabled: "text-muted opacity-50",
        day_outside: "text-muted opacity-60",
        ...classNames,
      }}
      {...props}
    />
  );
}

export { Calendar };

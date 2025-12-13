import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value, locale = "fr-TN") {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "TND",
      maximumFractionDigits: 0,
    }).format(value);
  } catch (error) {
    console.warn("Failed to format currency", error);
    return `${value} TND`;
  }
}

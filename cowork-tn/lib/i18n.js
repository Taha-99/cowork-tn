export const locales = ["fr", "ar"];
export const defaultLocale = "fr";

const rtlLocales = new Set(["ar"]);

export function isRTL(locale) {
  return rtlLocales.has(locale);
}

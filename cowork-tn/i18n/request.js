import { getRequestConfig } from "next-intl/server";

const FALLBACK_LOCALE = "fr";
const SUPPORTED_LOCALES = new Set(["fr", "ar"]);

export default getRequestConfig(async ({ requestLocale }) => {
  const detectedLocale = await requestLocale;
  const locale = detectedLocale && SUPPORTED_LOCALES.has(detectedLocale)
    ? detectedLocale
    : FALLBACK_LOCALE;

  const messages = (await import(`../messages/${locale}.json`)).default;

  return {
    locale,
    messages,
    timeZone: "Africa/Tunis",
  };
});

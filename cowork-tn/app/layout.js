import React from "react";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { defaultLocale, isRTL, locales } from "@/lib/i18n";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const generalSans = Space_Grotesk({ subsets: ["latin"], variable: "--font-general" });

export const metadata = {
  title: "Cowork.tn | Gestion d'espaces de coworking",
  description:
    "Plateforme SaaS multi-tenant pour gérer réservations, membres, factures et paiements des espaces de coworking tunisiens.",
  metadataBase: new URL("https://cowork.tn"),
};

async function getMessages(locale) {
  try {
    const messages = (await import(`@/messages/${locale}.json`)).default;
    return messages;
  } catch (error) {
    console.warn(`[i18n] Missing messages for ${locale}`, error);
    return {};
  }
}

export default function RootLayout({ children }) {
  const headerList = React.use(headers());
  const locale = headerList?.get("x-next-intl-locale") || defaultLocale;

  if (!locales.includes(locale)) {
    notFound();
  }

  const messages = React.use(getMessages(locale));

  return (
    <html lang={locale} dir={isRTL(locale) ? "rtl" : "ltr"} suppressHydrationWarning>
      <body className={`${inter.variable} ${generalSans.variable} bg-background font-sans`}>
        <NextIntlClientProvider locale={locale} messages={messages} timeZone="Africa/Tunis">
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export async function Hero({ locale }) {
  const t = await getTranslations({ locale, namespace: "hero" });

  return (
    <section className="relative overflow-hidden w-full border border-border/40 bg-gradient-to-br from-primary/5 via-background to-accent/5 p-8 md:p-12 dark:border-border/20 dark:from-primary/10 dark:via-background dark:to-accent/10">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl dark:bg-primary/20" />
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-60 w-60 rounded-full bg-accent/10 blur-3xl dark:bg-accent/20" />
      
      <div className="relative space-y-6">
        <Badge variant="accent" className="gap-1.5">
          <Sparkles className="h-3 w-3" />
          {t("tagline")}
        </Badge>
        <h1 className="text-4xl font-display font-bold leading-tight text-balance text-foreground md:text-5xl lg:text-6xl">
          {t("title")}
        </h1>
        <p className="w-full text-lg text-muted-foreground leading-relaxed">
          {t("subtitle")}
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Button asChild size="lg" className="gap-2">
            <Link href={`/${locale}/register`}>
              {t("ctaPrimary")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href={`/${locale}#pricing`}>{t("ctaSecondary")}</Link>
          </Button>
        </div>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium pt-2">
          {t("meta")}
        </p>
      </div>
    </section>
  );
}

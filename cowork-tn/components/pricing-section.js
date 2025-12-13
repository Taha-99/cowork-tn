import { plans } from "@/lib/plans";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Check, Sparkles } from "lucide-react";

export async function PricingSection({ locale }) {
  const t = await getTranslations({ locale, namespace: "pricing" });
  const tPlans = await getTranslations({ locale, namespace: "plans" });

  return (
    <section id="pricing" className="space-y-10">
      <div className="space-y-3 text-center">
        <Badge variant="accent" className="gap-1">
          <Sparkles className="h-3 w-3" />
          {t("tag")}
        </Badge>
        <h2 className="text-3xl font-display font-bold text-foreground md:text-4xl">{t("title")}</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">{t("subtitle")}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const isPopular = plan.slug === "pro";
          return (
            <Card 
              key={plan.slug} 
              className={`relative flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
                isPopular 
                  ? "border-primary/50 shadow-lg dark:border-primary/30 dark:shadow-primary/10" 
                  : "hover:border-border"
              }`}
            >
              {isPopular && (
                <div className="absolute top-0 right-0 -mt-1 -mr-1">
                  <div className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-bl-xl rounded-tr-xl">
                    {t("popular")}
                  </div>
                </div>
              )}
              <CardHeader className="pb-4">
                <div className="space-y-2">
                  <CardTitle className="text-xl font-display text-foreground">{tPlans(plan.titleKey)}</CardTitle>
                  <CardDescription className="text-muted-foreground">{tPlans(plan.descriptionKey)}</CardDescription>
                </div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-display font-bold text-foreground">
                    {formatCurrency(plan.price)}
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">{t("perMonth")}</span>
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col space-y-6">
                <ul className="flex-1 space-y-3">
                  {plan.perksKeys.map((perkKey) => (
                    <li key={perkKey} className="flex items-start gap-3 text-sm text-foreground">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent dark:bg-accent/20">
                        <Check className="h-3 w-3" />
                      </div>
                      {tPlans(perkKey)}
                    </li>
                  ))}
                </ul>
                <Button 
                  asChild 
                  variant={isPopular ? "default" : "outline"} 
                  className="w-full"
                  size="lg"
                >
                  <Link href={`/${locale}/register?plan=${plan.slug}`}>{t("cta")}</Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

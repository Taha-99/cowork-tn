import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Hero } from "@/components/hero";
import { PricingSection } from "@/components/pricing-section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Zap, Shield, Globe, CreditCard, Users, BarChart3, QrCode, Star, ArrowRight, Sparkles } from "lucide-react";

export default async function LandingPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "homepage" });

  const featureHighlights = [
    {
      tag: t("features.operations.tag"),
      title: t("features.operations.title"),
      description: t("features.operations.description"),
      icon: Shield,
    },
    {
      tag: t("features.billing.tag"),
      title: t("features.billing.title"),
      description: t("features.billing.description"),
      icon: CreditCard,
    },
    {
      tag: t("features.experience.tag"),
      title: t("features.experience.title"),
      description: t("features.experience.description"),
      icon: Users,
    },
  ];

  const additionalFeatures = [
    { icon: Zap, title: t("additional.performance.title"), description: t("additional.performance.description") },
    { icon: Globe, title: t("additional.multilingual.title"), description: t("additional.multilingual.description") },
    { icon: BarChart3, title: t("additional.analytics.title"), description: t("additional.analytics.description") },
    { icon: QrCode, title: t("additional.qrcode.title"), description: t("additional.qrcode.description") },
  ];

  const stats = [
    { value: "50+", label: t("stats.spaces") },
    { value: "2,500+", label: t("stats.members") },
    { value: "98%", label: t("stats.satisfaction") },
    { value: "24/7", label: t("stats.support") },
  ];

  const steps = [
    { step: "01", title: t("howItWorks.step1.title"), description: t("howItWorks.step1.description") },
    { step: "02", title: t("howItWorks.step2.title"), description: t("howItWorks.step2.description") },
    { step: "03", title: t("howItWorks.step3.title"), description: t("howItWorks.step3.description") },
  ];

  const testimonials = [
    {
      quote: t("testimonials.t1.quote"),
      author: t("testimonials.t1.author"),
      role: t("testimonials.t1.role"),
      avatar: "S",
    },
    {
      quote: t("testimonials.t2.quote"),
      author: t("testimonials.t2.author"),
      role: t("testimonials.t2.role"),
      avatar: "K",
    },
    {
      quote: t("testimonials.t3.quote"),
      author: t("testimonials.t3.author"),
      role: t("testimonials.t3.role"),
      avatar: "A",
    },
  ];

  return (
    <main className="relative flex min-h-screen w-full flex-col overflow-hidden bg-slate-50 dark:bg-background">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/10" />
        <div className="absolute left-1/2 top-10 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-primary/10 blur-[180px]" />
        <div className="absolute bottom-[-8rem] right-[-4rem] h-[26rem] w-[26rem] rounded-full bg-accent/10 blur-[160px]" />
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col gap-12 px-4 pb-12 pt-6 sm:px-6 lg:px-16">
          <SiteHeader locale={locale} />

          <div className="flex flex-1 flex-col gap-12">
            <Hero locale={locale} />

            {/* Social Proof Stats */}
            <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="group rounded-2xl border border-border/50 bg-card p-6 text-center shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 dark:bg-card/80 dark:border-border/30">
                  <p className="text-4xl font-display font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{stat.value}</p>
                  <p className="mt-2 text-sm font-medium text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </section>

            <section id="features" className="space-y-8">
              <div className="text-center max-w-3xl mx-auto">
                <p className="text-sm font-semibold text-accent">{t("features.eyebrow")}</p>
                <h2 className="mt-2 text-3xl font-display font-bold text-foreground">{t("features.title")}</h2>
                <p className="mt-4 text-muted-foreground">
                  {t("features.description")}
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {featureHighlights.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <Card
                      key={feature.title}
                      className="group flex h-full flex-col border-border/50 bg-card p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-card/90 dark:border-border/40"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 text-primary dark:from-primary/20 dark:to-accent/20">
                          <Icon className="h-6 w-6" />
                        </div>
                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">{feature.tag}</p>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-display font-semibold text-foreground">{feature.title}</h3>
                        <p className="mt-3 text-muted-foreground leading-relaxed">{feature.description}</p>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </section>

            {/* Additional Features Grid */}
            <section className="rounded-2xl border border-border/50 bg-card p-8 shadow-lg dark:bg-card/90 dark:border-border/40">
              <div className="text-center mb-8">
                <p className="text-sm font-semibold text-primary">{t("additional.eyebrow")}</p>
                <h3 className="mt-1 text-2xl font-display font-bold text-foreground">{t("additional.title")}</h3>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {additionalFeatures.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div key={feature.title} className="group text-center space-y-3">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 text-primary transition-transform duration-300 group-hover:scale-110 dark:from-primary/20 dark:to-accent/20">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h4 className="font-semibold text-foreground">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* How It Works */}
            <section className="space-y-10">
              <div className="text-center">
                <p className="text-sm font-semibold text-accent">{t("howItWorks.eyebrow")}</p>
                <h2 className="mt-2 text-3xl font-display font-bold text-foreground">{t("howItWorks.title")}</h2>
              </div>
              
              {/* Steps connector line (desktop only) */}
              <div className="relative">
                <div className="absolute top-10 left-0 right-0 hidden h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent md:block" style={{ left: '16.67%', right: '16.67%' }} />
                
                <div className="grid gap-8 md:grid-cols-3">
                  {steps.map((item) => (
                    <div key={item.step} className="flex flex-col items-center text-center">
                      {/* Step number bubble */}
                      <div className="relative z-10 mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-2xl font-bold text-white shadow-xl ring-4 ring-background dark:ring-card">
                        {item.step}
                      </div>
                      
                      {/* Card content */}
                      <div className="flex h-full w-full flex-col rounded-2xl border border-border/50 bg-card p-6 shadow-lg dark:bg-card/90 dark:border-border/40">
                        <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                        <p className="mt-3 flex-1 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <PricingSection locale={locale} />

            {/* Testimonials */}
            <section className="space-y-10">
              <div className="text-center">
                <p className="text-sm font-semibold text-accent">{t("testimonials.eyebrow")}</p>
                <h2 className="mt-2 text-3xl font-display font-bold text-foreground">{t("testimonials.title")}</h2>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                {testimonials.map((testimonial) => (
                  <Card key={testimonial.author} className="flex h-full flex-col border-border/50 bg-card p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-card/90 dark:border-border/40">
                    <div className="flex-1">
                      <div className="flex gap-1 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                      <p className="mt-4 text-muted-foreground leading-relaxed">"{testimonial.quote}"</p>
                    </div>
                    <div className="mt-6 flex items-center gap-3 pt-4 border-t border-border/50">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-bold text-white">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{testimonial.author}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* CTA Banner */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-primary/80 p-8 text-center text-white shadow-2xl md:p-12">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
              <div className="relative space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
                  <Sparkles className="h-4 w-4" />
                  {t("cta.badge")}
                </div>
                <h2 className="text-3xl font-display font-bold md:text-4xl">
                  {t("cta.title")}
                </h2>
                <p className="mx-auto max-w-2xl text-white/90">
                  {t("cta.description")}
                </p>
                <div className="flex flex-wrap justify-center gap-4 pt-4">
                  <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                    <Link href={`/${locale}/register`}>
                      {t("cta.primary")}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    <Link href={`/${locale}#pricing`}>{t("cta.secondary")}</Link>
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="px-4 pb-10 sm:px-6 lg:px-16">
          <SiteFooter locale={locale} />
        </div>
      </div>
    </main>
  );
}

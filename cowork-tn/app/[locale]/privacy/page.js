import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowLeft, Shield, Lock, Eye, Database, Bell, Users, Globe, CheckCircle } from "lucide-react";

export default async function PrivacyPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "footer" });

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-background to-slate-50 dark:to-background">
      {/* Full width header - no container constraints */}
      <div className="w-full bg-card/80 backdrop-blur-xl">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <SiteHeader locale={locale} />
        </div>
      </div>
      
      {/* Full width content - no max-width constraints */}
      <div className="w-full flex-1">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <Button asChild variant="ghost" className="mb-6">
              <Link href={`/${locale}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {locale === "ar" ? "العودة إلى الصفحة الرئيسية" : "Retour à l'accueil"}
              </Link>
            </Button>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold text-foreground">
                  {locale === "ar" ? "سياسة الخصوصية" : "Politique de confidentialité"}
                </h1>
                <p className="text-muted-foreground">
                  {locale === "ar" ? "آخر تحديث: 13 ديسمبر 2025" : "Dernière mise à jour : 13 décembre 2025"}
                </p>
              </div>
            </div>
            
            <div className="rounded-xl bg-primary/5 border border-primary/20 p-6 mt-6">
              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    {locale === "ar" ? "التزامنا تجاه خصوصيتك" : "Notre engagement envers votre vie privée"}
                  </h3>
                  <p className="text-muted-foreground">
                    {locale === "ar" 
                      ? "في Cowork.tn، نأخذ حماية بياناتك الشخصية على محمل الجد. توضح هذه السياسة كيفية جمعنا واستخدامنا وحماية معلوماتك."
                      : "Chez Cowork.tn, nous prenons la protection de vos données personnelles très au sérieux. Cette politique explique comment nous collectons, utilisons et protégeons vos informations."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-8">
            {/* Collecte des données */}
            <Card className="border-border/50 shadow-lg w-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Database className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl">Données que nous collectons</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-border/50 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="h-4 w-4 text-primary" />
                      <p className="font-semibold">Données d'identification</p>
                    </div>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                      <li>Nom et prénom</li>
                      <li>Adresse email</li>
                      <li>Numéro de téléphone</li>
                      <li>Photo de profil (optionnelle)</li>
                    </ul>
                  </div>
                  <div className="rounded-lg border border-border/50 p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Eye className="h-4 w-4 text-primary" />
                      <p className="font-semibold">Données d'utilisation</p>
                    </div>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                      <li>Historique des réservations</li>
                      <li>Préférences de l'espace</li>
                      <li>Logs d'activité</li>
                      <li>Informations sur le navigateur</li>
                    </ul>
                  </div>
                </div>
                
                <div className="rounded-lg bg-muted/30 p-4">
                  <p className="font-semibold mb-2">Données de paiement</p>
                  <p className="text-sm text-muted-foreground">
                    Les informations de paiement sont traitées directement par nos partenaires de paiement sécurisés (Stripe).
                    Nous ne stockons jamais vos numéros de carte bancaire sur nos serveurs.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Utilisation des données */}
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl">Comment nous utilisons vos données</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      1
                    </div>
                    <div>
                      <p className="font-semibold">Fournir et améliorer nos services</p>
                      <p className="text-sm text-muted-foreground">
                        Gestion des réservations, facturation, support client et amélioration continue de la plateforme.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      2
                    </div>
                    <div>
                      <p className="font-semibold">Communication</p>
                      <p className="text-sm text-muted-foreground">
                        Envoi de confirmations de réservation, rappels, mises à jour importantes et newsletters (avec consentement).
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      3
                    </div>
                    <div>
                      <p className="font-semibold">Sécurité et conformité</p>
                      <p className="text-sm text-muted-foreground">
                        Détection et prévention de la fraude, respect des obligations légales et protection de nos systèmes.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Partage des données */}
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl">Partage de vos données</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Nous ne vendons jamais vos données personnelles. Nous pouvons les partager avec :
                </p>
                <div className="grid gap-3">
                  <div className="flex items-center justify-between rounded-lg border border-border/50 p-4">
                    <div>
                      <p className="font-semibold">Prestataires de services</p>
                      <p className="text-sm text-muted-foreground">Hébergement, paiement, analyse, support</p>
                    </div>
                    <div className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                      Sous-traitants
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border/50 p-4">
                    <div>
                      <p className="font-semibold">Administrateurs d'espaces</p>
                      <p className="text-sm text-muted-foreground">Pour la gestion de votre espace de coworking</p>
                    </div>
                    <div className="text-xs font-medium px-2 py-1 rounded-full bg-accent/10 text-accent">
                      Nécessaire au service
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border/50 p-4">
                    <div>
                      <p className="font-semibold">Autorités légales</p>
                      <p className="text-sm text-muted-foreground">Lorsque requis par la loi</p>
                    </div>
                    <div className="text-xs font-medium px-2 py-1 rounded-full bg-muted text-muted-foreground">
                      Obligation légale
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Protection des données */}
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl">Comment nous protégeons vos données</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <p className="font-semibold">Chiffrement</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Toutes les données sont chiffrées en transit (TLS 1.3) et au repos (AES-256).
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <p className="font-semibold">Contrôle d'accès</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Accès strictement limité aux personnes autorisées avec authentification à deux facteurs.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <p className="font-semibold">Audits réguliers</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Tests de pénétration et audits de sécurité réalisés régulièrement.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <p className="font-semibold">Sauvegardes</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Sauvegardes quotidiennes avec rétention de 30 jours et réplication géographique.
                    </p>
                  </div>
                </div>
                
                <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 mt-4">
                  <p className="font-semibold text-primary mb-2">Certifications</p>
                  <p className="text-sm text-muted-foreground">
                    Nos infrastructures sont conformes aux standards de sécurité les plus stricts, incluant les bonnes pratiques
                    de l'ANSI et les recommandations de l'Instance Nationale de Protection des Données Personnelles (INPDP).
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Vos droits */}
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Vos droits en matière de protection des données</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-lg border border-border/50 p-4 hover:border-primary/50 transition-colors">
                    <p className="font-semibold mb-2">Droit d'accès</p>
                    <p className="text-sm text-muted-foreground">
                      Vous pouvez demander une copie de vos données personnelles.
                    </p>
                  </div>
                  <div className="rounded-lg border border-border/50 p-4 hover:border-primary/50 transition-colors">
                    <p className="font-semibold mb-2">Droit de rectification</p>
                    <p className="text-sm text-muted-foreground">
                      Vous pouvez corriger des données inexactes ou incomplètes.
                    </p>
                  </div>
                  <div className="rounded-lg border border-border/50 p-4 hover:border-primary/50 transition-colors">
                    <p className="font-semibold mb-2">Droit à l'effacement</p>
                    <p className="text-sm text-muted-foreground">
                      Vous pouvez demander la suppression de vos données dans certains cas.
                    </p>
                  </div>
                  <div className="rounded-lg border border-border/50 p-4 hover:border-primary/50 transition-colors">
                    <p className="font-semibold mb-2">Droit d'opposition</p>
                    <p className="text-sm text-muted-foreground">
                      Vous pouvez vous opposer au traitement de vos données.
                    </p>
                  </div>
                  <div className="rounded-lg border border-border/50 p-4 hover:border-primary/50 transition-colors">
                    <p className="font-semibold mb-2">Droit à la portabilité</p>
                    <p className="text-sm text-muted-foreground">
                      Vous pouvez recevoir vos données dans un format structuré.
                    </p>
                  </div>
                  <div className="rounded-lg border border-border/50 p-4 hover:border-primary/50 transition-colors">
                    <p className="font-semibold mb-2">Droit de limitation</p>
                    <p className="text-sm text-muted-foreground">
                      Vous pouvez demander la limitation du traitement de vos données.
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 rounded-xl bg-muted/30 p-6">
                  <p className="font-semibold mb-3">Comment exercer vos droits</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Pour exercer vos droits, contactez notre délégué à la protection des données :
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <span className="font-medium">Email :</span>{' '}
                      <a href="mailto:dpo@cowork.tn" className="text-primary hover:underline">dpo@cowork.tn</a>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Adresse :</span>{' '}
                      <span className="text-muted-foreground">DPO Cowork.tn, Centre Urbain Nord, 1082 Tunis</span>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Délai de réponse :</span>{' '}
                      <span className="text-muted-foreground">1 mois maximum</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cookies et tracking */}
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Cookies et technologies de suivi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Nous utilisons des cookies et technologies similaires pour améliorer votre expérience, analyser le trafic
                  et personnaliser le contenu.
                </p>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 font-semibold">Type de cookie</th>
                        <th className="text-left py-3 font-semibold">Objectif</th>
                        <th className="text-left py-3 font-semibold">Durée</th>
                        </tr>
                    </thead>
                  </table>
                </div>
                
                <div className="rounded-lg bg-muted/30 p-4">
                  <p className="font-semibold mb-2">Gestion des cookies</p>
                  <p className="text-sm text-muted-foreground">
                    Vous pouvez contrôler les cookies via les paramètres de votre navigateur. Notez que la désactivation
                    des cookies essentiels peut affecter le fonctionnement du site.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact et mise à jour */}
            <div className="rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-8 text-white">
              <div className="max-w-2xl mx-auto text-center">
                <div className="flex justify-center mb-4">
                  <Shield className="h-12 w-12" />
                </div>
                <h3 className="text-2xl font-display font-bold mb-4">Questions sur la confidentialité ?</h3>
                <p className="mb-6 text-white/90">
                  Notre équipe dédiée à la protection des données est à votre écoute pour toute question concernant
                  cette politique ou la manière dont nous traitons vos informations.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button asChild variant="secondary" className="bg-white text-primary hover:bg-white/90">
                    <a href="mailto:privacy@cowork.tn">
                      Contacter notre DPO
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    <Link href={`/${locale}/support`}>
                      Support technique
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Mise à jour */}
            <Card className="border-border/50 w-full">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Bell className="h-5 w-5 text-muted-foreground mt-1" />
                  <div>
                    <p className="font-semibold mb-2">Mise à jour de cette politique</p>
                    <p className="text-sm text-muted-foreground">
                      Nous pouvons mettre à jour cette politique de confidentialité périodiquement. Nous vous informerons
                      des changements importants par email ou via une notification sur notre site. La date de la dernière
                      mise à jour est indiquée en haut de cette page.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <div className="mt-auto">
        <SiteFooter locale={locale} />
      </div>
    </main>
  );
}

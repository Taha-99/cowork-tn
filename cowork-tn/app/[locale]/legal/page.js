import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowLeft, FileText, Shield, Lock, Building, Mail, Phone, MapPin } from "lucide-react";

export default async function LegalPage({ params }) {
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
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold text-foreground">
                  {locale === "ar" ? "الجوانب القانونية" : "Mentions légales"}
                </h1>
                <p className="text-muted-foreground">
                  {locale === "ar" ? "آخر تحديث: 13 ديسمبر 2025" : "Dernière mise à jour : 13 décembre 2025"}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-8">
            {/* Éditeur du site */}
            <Card className="border-border/50 shadow-lg w-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Building className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl">Éditeur du site</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-muted/30 p-4">
                  <p className="font-semibold">Cowork.tn</p>
                  <p className="text-muted-foreground">Plateforme SaaS de gestion d'espaces de coworking</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Adresse :</span>
                    </div>
                    <p className="text-muted-foreground pl-6">
                      Centre Urbain Nord<br />
                      1082 Tunis, Tunisie
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Email :</span>
                    </div>
                    <p className="text-muted-foreground pl-6">contact@cowork.tn</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Téléphone :</span>
                    </div>
                    <p className="text-muted-foreground pl-6">+216 70 000 000</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Forme juridique :</span>
                    </div>
                    <p className="text-muted-foreground pl-6">SARL au capital de 50 000 TND</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hébergement */}
            <Card className="border-border/50 shadow-lg w-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl">Hébergement</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-muted/30 p-4">
                  <p className="font-semibold">Vercel Inc.</p>
                  <p className="text-muted-foreground">340 S Lemon Ave #4133, Walnut, CA 91789, USA</p>
                </div>
                <p className="text-muted-foreground">
                  Le site est hébergé sur la plateforme Vercel, qui garantit une haute disponibilité et des performances optimales.
                  Les données sont stockées sur des serveurs sécurisés en Europe (région Frankfurt, Allemagne) via Supabase.
                </p>
              </CardContent>
            </Card>

            {/* Propriété intellectuelle */}
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl">Propriété intellectuelle</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  L'ensemble de ce site relève de la législation tunisienne et internationale sur le droit d'auteur et la propriété intellectuelle.
                  Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
                </p>
                <div className="rounded-lg border border-border/50 p-4">
                  <p className="font-semibold mb-2">Sont strictement interdits :</p>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    <li>La reproduction, distribution, modification ou adaptation du contenu sans autorisation</li>
                    <li>L'utilisation commerciale non autorisée des marques et logos</li>
                    <li>L'extraction systématique de données (scraping)</li>
                    <li>La création de liens profonds non autorisés</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Protection des données */}
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-primary" />
                  <CardTitle className="text-xl">Protection des données personnelles</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Conformément à la loi organique n°2004-63 du 27 juillet 2004 relative à la protection des données à caractère personnel,
                  vous disposez d'un droit d'accès, de rectification et de suppression des données vous concernant.
                </p>
                <div className="rounded-lg bg-primary/5 p-4 border border-primary/20">
                  <p className="font-semibold text-primary mb-2">Vos droits :</p>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    <li>Droit d'accès à vos données personnelles</li>
                    <li>Droit de rectification des données inexactes</li>
                    <li>Droit à l'effacement (droit à l'oubli)</li>
                    <li>Droit à la limitation du traitement</li>
                    <li>Droit à la portabilité des données</li>
                    <li>Droit d'opposition au traitement</li>
                  </ul>
                </div>
                <p className="text-muted-foreground">
                  Pour exercer ces droits, contactez notre délégué à la protection des données à l'adresse : <strong>dpo@cowork.tn</strong>
                </p>
              </CardContent>
            </Card>

            {/* Cookies */}
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Politique relative aux cookies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Ce site utilise des cookies pour améliorer l'expérience utilisateur. Les cookies sont de petits fichiers texte stockés sur votre appareil.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-border/50 p-4">
                    <p className="font-semibold mb-2">Cookies essentiels</p>
                    <p className="text-sm text-muted-foreground">
                      Nécessaires au fonctionnement du site (authentification, sécurité). Ne peuvent pas être désactivés.
                    </p>
                  </div>
                  <div className="rounded-lg border border-border/50 p-4">
                    <p className="font-semibold mb-2">Cookies analytiques</p>
                    <p className="text-sm text-muted-foreground">
                      Nous aident à comprendre comment les visiteurs interagissent avec le site. Vous pouvez les refuser.
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm">
                  Vous pouvez configurer vos préférences cookies via les paramètres de votre navigateur ou en utilisant notre outil de gestion des cookies.
                </p>
              </CardContent>
            </Card>

            {/* Responsabilité */}
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Limitation de responsabilité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Cowork.tn s'efforce d'assurer au mieux de ses possibilités l'exactitude et la mise à jour des informations diffusées sur son site.
                  Toutefois, nous ne pouvons garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition.
                </p>
                <div className="rounded-lg bg-muted/30 p-4">
                  <p className="font-semibold">Le site peut contenir :</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-muted-foreground">
                    <li>Des liens vers d'autres sites dont le contenu ne saurait engager notre responsabilité</li>
                    <li>Des informations techniques pouvant contenir des inexactitudes</li>
                    <li>Des services en version bêta pouvant présenter des dysfonctionnements</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Loi applicable */}
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Loi applicable et juridiction compétente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Les présentes mentions légales sont régies par le droit tunisien. En cas de litige, et à défaut de solution amiable,
                  les tribunaux de Tunis seront seuls compétents.
                </p>
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                  <p className="font-semibold text-primary">Règlement des litiges en ligne</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Conformément au Règlement (UE) n°524/2013, vous pouvez recourir à la plateforme de règlement en ligne des litiges (RLL)
                    accessible à l'adresse : <a href="https://ec.europa.eu/consumers/odr" className="text-primary hover:underline">https://ec.europa.eu/consumers/odr</a>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <div className="rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-8 text-white">
              <div className="max-w-2xl mx-auto text-center">
                <h3 className="text-2xl font-display font-bold mb-4">Questions légales ?</h3>
                <p className="mb-6 text-white/90">
                  Notre équipe juridique est à votre disposition pour répondre à toutes vos questions concernant nos mentions légales.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button asChild variant="secondary" className="bg-white text-primary hover:bg-white/90">
                    <Link href={`/${locale}/support`}>
                      Contacter le support
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    <a href="mailto:legal@cowork.tn">
                      Email juridique
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-auto">
        <SiteFooter locale={locale} />
      </div>
    </main>
  );
}

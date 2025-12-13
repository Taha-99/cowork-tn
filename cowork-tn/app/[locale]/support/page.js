import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowLeft, HelpCircle, MessageSquare, Phone, Mail, Clock, CheckCircle, Users, FileText, Zap, Globe } from "lucide-react";

export default async function SupportPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "footer" });

  const faqs = [
    {
      question: "Comment créer mon espace de coworking ?",
      answer: "Cliquez sur 'Créer mon espace' depuis la page d'accueil. Le processus d'onboarding vous guide en 5 étapes simples : informations personnelles, détails de l'espace, sélection du plan, paiement et confirmation.",
      category: "Onboarding"
    },
    {
      question: "Quels sont les modes de paiement acceptés ?",
      answer: "Nous acceptons les cartes bancaires (Visa, MasterCard) via Stripe, ainsi que les virements bancaires pour les entreprises. Les paiements sont sécurisés et chiffrés.",
      category: "Paiement"
    },
    {
      question: "Comment gérer les réservations de mes membres ?",
      answer: "Depuis le tableau de bord admin, accédez à la section 'Réservations'. Vous pouvez voir toutes les réservations à venir, les confirmer, les annuler ou créer des réservations pour vos membres.",
      category: "Réservations"
    },
    {
      question: "Puis-je changer de plan à tout moment ?",
      answer: "Oui ! Vous pouvez passer du plan Basic à Pro ou Premium à tout moment. La facturation sera ajustée au prorata. Le passage à un plan inférieur prend effet à la fin de votre cycle de facturation.",
      category: "Facturation"
    },
    {
      question: "Comment fonctionne le système de QR codes ?",
      answer: "Chaque membre reçoit un QR code unique dans son portail. Il peut l'utiliser pour check-in/check-out depuis l'application mobile ou les bornes de votre espace.",
      category: "Fonctionnalités"
    },
    {
      question: "Quel support technique proposez-vous ?",
      answer: "Nous offrons un support par email (réponse sous 24h), chat en direct (9h-18h) et assistance téléphonique pour les plans Pro et Premium. Des tutoriels vidéo sont également disponibles.",
      category: "Support"
    }
  ];

  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      description: "Réponse sous 24 heures",
      details: "support@cowork.tn",
      action: "Envoyer un email",
      href: "mailto:support@cowork.tn",
      color: "bg-blue-500/10 text-blue-600"
    },
    {
      icon: MessageSquare,
      title: "Chat en direct",
      description: "9h-18h, du lundi au vendredi",
      details: "Disponible sur le tableau de bord",
      action: "Ouvrir le chat",
      href: "#chat",
      color: "bg-green-500/10 text-green-600"
    },
    {
      icon: Phone,
      title: "Téléphone",
      description: "Plans Pro et Premium uniquement",
      details: "+216 70 000 001",
      action: "Appeler",
      href: "tel:+21670000001",
      color: "bg-purple-500/10 text-purple-600"
    },
    {
      icon: Users,
      title: "Communauté",
      description: "Échangez avec d'autres gestionnaires",
      details: "Forum et groupes d'entraide",
      action: "Rejoindre",
      href: "#community",
      color: "bg-orange-500/10 text-orange-600"
    }
  ];

  const resources = [
    {
      icon: FileText,
      title: "Documentation",
      description: "Guides complets et tutoriels",
      link: "#docs",
      count: "45+ articles"
    },
    {
      icon: Zap,
      title: "Centre d'aide",
      description: "Questions fréquentes et solutions",
      link: "#help",
      count: "120+ FAQs"
    },
    {
      icon: Globe,
      title: "Blog",
      description: "Actualités et bonnes pratiques",
      link: "#blog",
      count: "30+ articles"
    }
  ];

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
          <div className="mb-12">
            <Button asChild variant="ghost" className="mb-6">
              <Link href={`/${locale}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {locale === "ar" ? "العودة إلى الصفحة الرئيسية" : "Retour à l'accueil"}
              </Link>
            </Button>
            
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4">
                <HelpCircle className="h-8 w-8" />
              </div>
              <h1 className="text-4xl font-display font-bold text-foreground mb-4">
                {locale === "ar" ? "مركز الدعم" : "Centre de support"}
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {locale === "ar" 
                  ? "نحن هنا لمساعدتك في الاستفادة القصوى من Cowork.tn"
                  : "Nous sommes là pour vous aider à tirer le meilleur parti de Cowork.tn"}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              <div className="rounded-2xl border border-border/50 bg-card p-6 text-center">
                <p className="text-3xl font-display font-bold text-primary">24h</p>
                <p className="text-sm text-muted-foreground">Temps de réponse moyen</p>
              </div>
              <div className="rounded-2xl border border-border/50 bg-card p-6 text-center">
                <p className="text-3xl font-display font-bold text-primary">98%</p>
                <p className="text-sm text-muted-foreground">Satisfaction client</p>
              </div>
              <div className="rounded-2xl border border-border/50 bg-card p-6 text-center">
                <p className="text-3xl font-display font-bold text-primary">7j/7</p>
                <p className="text-sm text-muted-foreground">Support disponible</p>
              </div>
              <div className="rounded-2xl border border-border/50 bg-card p-6 text-center">
                <p className="text-3xl font-display font-bold text-primary">5min</p>
                <p className="text-sm text-muted-foreground">Premier contact</p>
              </div>
            </div>
          </div>

          <div className="grid gap-8">
            {/* Contact Methods */}
            <div>
              <h2 className="text-2xl font-display font-bold text-foreground mb-6">Comment nous contacter</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {contactMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <Card key={method.title} className="border-border/50 hover:border-primary/50 transition-colors w-full">
                      <CardContent className="p-6">
                        <div className={`inline-flex p-3 rounded-xl ${method.color} mb-4`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">{method.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{method.description}</p>
                        <p className="font-medium text-foreground mb-4">{method.details}</p>
                        <Button asChild variant="outline" className="w-full">
                          <a href={method.href}>{method.action}</a>
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* FAQ */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold text-foreground">Questions fréquentes</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Mis à jour récemment</span>
                </div>
              </div>
              
              <div className="grid gap-4">
                {faqs.map((faq, index) => (
                  <Card key={index} className="border-border/50 hover:border-primary/30 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                          ?
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-muted text-muted-foreground">
                              {faq.category}
                            </span>
                          </div>
                          <h3 className="font-semibold text-lg mb-3">{faq.question}</h3>
                          <p className="text-muted-foreground">{faq.answer}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <Card className="border-border/50 shadow-lg w-full">
              <CardHeader>
                <CardTitle className="text-2xl">Envoyez-nous un message</CardTitle>
                <CardDescription>
                  Remplissez ce formulaire et notre équipe vous répondra dans les plus brefs délais.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom complet</Label>
                      <Input id="name" placeholder="Votre nom" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="vous@example.com" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Sujet</Label>
                    <Input id="subject" placeholder="De quoi avez-vous besoin ?" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Catégorie</Label>
                    <select
                      id="category"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Sélectionnez une catégorie</option>
                      <option value="technical">Problème technique</option>
                      <option value="billing">Question de facturation</option>
                      <option value="feature">Demande de fonctionnalité</option>
                      <option value="account">Gestion de compte</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Décrivez votre problème ou votre question en détail..."
                      rows={5}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priorité</Label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input type="radio" name="priority" value="low" className="h-4 w-4" />
                        <span>Basse (réponse sous 48h)</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="priority" value="normal" className="h-4 w-4" defaultChecked />
                        <span>Normale (réponse sous 24h)</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="priority" value="high" className="h-4 w-4" />
                        <span>Haute (réponse sous 4h)</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Button type="submit" className="flex-1">
                      Envoyer le message
                    </Button>
                    <Button type="button" variant="outline">
                      Joindre un fichier
                    </Button>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    En envoyant ce formulaire, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
                  </p>
                </form>
              </CardContent>
            </Card>

            {/* Resources */}
            <div>
              <h2 className="text-2xl font-display font-bold text-foreground mb-6">Ressources utiles</h2>
              <div className="grid gap-6 sm:grid-cols-3">
                {resources.map((resource) => {
                  const Icon = resource.icon;
                  return (
                    <Card key={resource.title} className="border-border/50 hover:border-primary/30 transition-colors w-full">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Icon className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-primary">{resource.count}</p>
                          </div>
                        </div>
                        <h3 className="font-semibold text-lg mb-2">{resource.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>
                        <Button asChild variant="ghost" className="w-full">
                          <a href={resource.link}>Explorer</a>
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Status */}
            <Card className="border-border/50 bg-gradient-to-r from-primary/5 to-accent/5 w-full">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 text-green-600">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">Tous les systèmes sont opérationnels</h3>
                    <p className="text-sm text-muted-foreground">
                      Aucune interruption de service signalée. Dernière vérification : il y a 5 minutes.
                    </p>
                  </div>
                  <Button variant="outline">Voir l'état des services</Button>
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <div className="rounded-3xl bg-gradient-to-r from-primary to-primary/80 p-8 text-white text-center">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-2xl font-display font-bold mb-4">Besoin d'aide immédiate ?</h3>
                <p className="mb-6 text-white/90">
                  Notre équipe de support est disponible 7j/7 pour vous accompagner dans la gestion de votre espace de coworking.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                    <a href="mailto:urgent@cowork.tn">
                      <Mail className="mr-2 h-4 w-4" />
                      Urgence technique
                    </a>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    <a href="tel:+21670000002">
                      <Phone className="mr-2 h-4 w-4" />
                      Appel d'urgence
                    </a>
                  </Button>
                </div>
                <p className="mt-6 text-sm text-white/70">
                  Disponible 24h/24 pour les incidents critiques affectant votre activité.
                </p>
              </div>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-6 py-8">
              <Link href={`/${locale}/legal`} className="text-sm text-muted-foreground hover:text-foreground">
                Mentions légales
              </Link>
              <Link href={`/${locale}/privacy`} className="text-sm text-muted-foreground hover:text-foreground">
                Politique de confidentialité
              </Link>
              <Link href={`/${locale}/support`} className="text-sm text-muted-foreground hover:text-foreground">
                Conditions d'utilisation
              </Link>
              <Link href={`/${locale}/support#cookies`} className="text-sm text-muted-foreground hover:text-foreground">
                Gestion des cookies
              </Link>
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
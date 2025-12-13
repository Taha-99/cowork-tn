"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp, ROLES } from "@/lib/auth";
import { getSupabaseClient } from "@/lib/supabase";
import { Loader2, Check, Building2, Users, Crown } from "lucide-react";

export default function RegisterPage({ params }) {
  const { locale } = React.use(params);
  const t = useTranslations("registerPage");
  const router = useRouter();
  
  const [step, setStep] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  
  // Form data
  const [formData, setFormData] = React.useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    spaceName: "",
    city: "",
    address: "",
    capacity: "",
    pitch: "",
  });

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      setIsLoading(false);
      return;
    }

    try {
      // Sign up with admin role
      const { user, error: authError } = await signUp(
        formData.email,
        formData.password,
        {
          full_name: formData.fullName,
          phone: formData.phone,
          role: ROLES.ADMIN,
        }
      );

      if (authError) {
        throw new Error(authError);
      }

      // Create the space
      const supabase = getSupabaseClient();
      const { error: spaceError } = await supabase
        .from("spaces")
        .insert({
          name: formData.spaceName,
          city: formData.city,
          address: formData.address,
          capacity: parseInt(formData.capacity) || 20,
          description: formData.pitch,
          owner_id: user.id,
        });

      if (spaceError) {
        console.error("Space creation error:", spaceError);
      }

      // Redirect to dashboard
      setStep(4);
      setTimeout(() => {
        router.push(`/${locale}/app`);
      }, 2000);
      
    } catch (err) {
      setError(err?.message || "Erreur lors de l'inscription");
    } finally {
      setIsLoading(false);
    }
  }

  const steps = [
    { id: 1, key: "personal", title: "Informations personnelles" },
    { id: 2, key: "space", title: "Votre espace" },
    { id: 3, key: "confirmation", title: "Confirmation" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="mx-auto w-full max-w-4xl space-y-8 px-6 py-16">
        {/* Header */}
        <div className="space-y-2 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white">
            <Building2 className="h-7 w-7" />
          </div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            {t("eyebrow")}
          </p>
          <h1 className="text-4xl font-display font-semibold text-foreground">
            {t("title")}
          </h1>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center">
          <div className="flex items-center gap-4">
            {steps.map((s, index) => (
              <React.Fragment key={s.key}>
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all ${
                      step > s.id
                        ? "bg-accent text-white"
                        : step === s.id
                        ? "bg-primary text-white"
                        : "border-2 border-border text-muted-foreground"
                    }`}
                  >
                    {step > s.id ? <Check className="h-5 w-5" /> : s.id}
                  </div>
                  <span className={`hidden sm:block text-sm font-medium ${
                    step >= s.id ? "text-foreground" : "text-muted-foreground"
                  }`}>
                    {s.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 w-12 ${step > s.id ? "bg-accent" : "bg-border"}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <Card className="rounded-3xl border border-border/60 bg-card shadow-xl">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <CardContent className="p-8 space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-xl font-semibold text-foreground">
                    Informations personnelles
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Commencez par créer votre compte administrateur
                  </p>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">{t("fields.fullName")}</Label>
                    <Input
                      id="fullName"
                      placeholder="Ahmed Ben Ali"
                      value={formData.fullName}
                      onChange={(e) => updateField("fullName", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t("fields.email")}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="ahmed@example.com"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">{t("fields.password")}</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => updateField("password", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => updateField("confirmPassword", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="phone">{t("fields.phone")}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+216 XX XXX XXX"
                      value={formData.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                    />
                  </div>
                </div>

                {error && (
                  <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={() => {
                      if (!formData.fullName || !formData.email || !formData.password) {
                        setError("Veuillez remplir tous les champs obligatoires");
                        return;
                      }
                      if (formData.password !== formData.confirmPassword) {
                        setError("Les mots de passe ne correspondent pas");
                        return;
                      }
                      setStep(2);
                    }}
                    className="px-8"
                  >
                    Continuer
                  </Button>
                </div>
              </CardContent>
            )}

            {/* Step 2: Space Info */}
            {step === 2 && (
              <CardContent className="p-8 space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-xl font-semibold text-foreground">
                    Votre espace de coworking
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Décrivez votre espace pour attirer les coworkers
                  </p>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="spaceName">{t("fields.spaceName")}</Label>
                    <Input
                      id="spaceName"
                      placeholder="CoWork Hub Tunis"
                      value={formData.spaceName}
                      onChange={(e) => updateField("spaceName", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">{t("fields.city")}</Label>
                    <Input
                      id="city"
                      placeholder="Tunis"
                      value={formData.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">{t("fields.capacity")}</Label>
                    <Input
                      id="capacity"
                      type="number"
                      placeholder="50"
                      value={formData.capacity}
                      onChange={(e) => updateField("capacity", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Adresse</Label>
                    <Input
                      id="address"
                      placeholder="123 Avenue Habib Bourguiba"
                      value={formData.address}
                      onChange={(e) => updateField("address", e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="pitch">{t("fields.pitch")}</Label>
                    <Textarea
                      id="pitch"
                      placeholder="Décrivez votre espace, ses avantages, son ambiance..."
                      rows={4}
                      value={formData.pitch}
                      onChange={(e) => updateField("pitch", e.target.value)}
                    />
                  </div>
                </div>

                {error && (
                  <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>
                    Retour
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      if (!formData.spaceName || !formData.city) {
                        setError("Le nom et la ville de l'espace sont requis");
                        return;
                      }
                      setStep(3);
                    }}
                    className="px-8"
                  >
                    Continuer
                  </Button>
                </div>
              </CardContent>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
              <CardContent className="p-8 space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-xl font-semibold text-foreground">
                    Confirmer l'inscription
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Vérifiez vos informations avant de créer votre compte
                  </p>
                </div>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-xl border border-border bg-muted/30 p-4">
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      Informations personnelles
                    </h3>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Nom</dt>
                        <dd className="font-medium text-foreground">{formData.fullName}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Email</dt>
                        <dd className="font-medium text-foreground">{formData.email}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Téléphone</dt>
                        <dd className="font-medium text-foreground">{formData.phone || "-"}</dd>
                      </div>
                    </dl>
                  </div>
                  
                  <div className="rounded-xl border border-border bg-muted/30 p-4">
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-primary" />
                      Espace de coworking
                    </h3>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Nom</dt>
                        <dd className="font-medium text-foreground">{formData.spaceName}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Ville</dt>
                        <dd className="font-medium text-foreground">{formData.city}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Capacité</dt>
                        <dd className="font-medium text-foreground">{formData.capacity || "Non spécifiée"}</dd>
                      </div>
                    </dl>
                  </div>
                </div>

                <div className="rounded-xl border border-accent/30 bg-accent/5 p-4">
                  <div className="flex items-start gap-3">
                    <Crown className="h-5 w-5 text-accent mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Essai gratuit de 14 jours</p>
                      <p className="text-sm text-muted-foreground">
                        Accès complet à toutes les fonctionnalités. Aucune carte bancaire requise.
                      </p>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setStep(2)}>
                    Retour
                  </Button>
                  <Button type="submit" disabled={isLoading} className="px-8">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Création en cours...
                      </>
                    ) : (
                      "Créer mon compte"
                    )}
                  </Button>
                </div>
              </CardContent>
            )}

            {/* Step 4: Success */}
            {step === 4 && (
              <CardContent className="p-8 text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
                  <Check className="h-8 w-8 text-accent" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                  Bienvenue !
                </h2>
                <p className="text-muted-foreground mb-6">
                  Votre compte a été créé avec succès. Vous allez être redirigé vers votre tableau de bord...
                </p>
                <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
              </CardContent>
            )}
          </form>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground">
          Vous avez déjà un compte ?{" "}
          <Link href={`/${locale}/login`} className="font-medium text-primary hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { signIn, getRedirectPath, ROLES } from "@/lib/auth";
import { Loader2 } from "lucide-react";

export default function LoginPage({ params }) {
  const { locale } = React.use(params);
  const t = useTranslations("auth");
  const tLogin = useTranslations("loginPage");
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    try {
      const { user, profile, error: authError } = await signIn(email, password);

      if (authError) {
        throw new Error(authError);
      }

      setSuccess(true);

      // Redirect based on role
      const role = profile?.role || ROLES.COWORKER;
      const redirectPath = getRedirectPath(role, locale);
      
      // Use window.location for hard redirect to ensure auth state is picked up
      setTimeout(() => {
        window.location.href = redirectPath;
      }, 300);
      
    } catch (err) {
      setError(err?.message || "Impossible de se connecter");
      setIsLoading(false);
    }
  }

  return (
    <div className="container flex min-h-screen items-center justify-center py-16">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white font-bold text-lg">
            C
          </div>
          <CardTitle className="text-2xl">{t("loginTitle")}</CardTitle>
          <CardDescription>{t("loginSubtitle")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mot de passe</Label>
                <Link href={`/${locale}/forgot-password`} className="text-xs text-primary hover:underline">
                  Mot de passe oublié ?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            {error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-lg bg-accent/10 p-3 text-sm text-accent">
                Connexion réussie ! Redirection...
              </div>
            )}
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connexion...
                </>
              ) : (
                "Se connecter"
              )}
            </Button>
          </form>
          
          <div className="mt-6 rounded-xl border border-border bg-muted/30 p-4">
            <p className="text-xs font-medium text-muted-foreground mb-3">{tLogin("demoHint")}</p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between rounded-lg bg-background p-2">
                <span className="font-medium text-foreground">Super Admin</span>
                <span className="text-muted-foreground">super@cowork.tn</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-background p-2">
                <span className="font-medium text-foreground">Space Admin</span>
                <span className="text-muted-foreground">admin@cowork.tn</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-background p-2">
                <span className="font-medium text-foreground">Coworker</span>
                <span className="text-muted-foreground">user@cowork.tn</span>
              </div>
              <p className="text-center text-muted-foreground mt-2">Password: demo123</p>
            </div>
          </div>
          
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Pas encore de compte ?{" "}
            <Link href={`/${locale}/register`} className="font-medium text-primary hover:underline">
              Créer un espace
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

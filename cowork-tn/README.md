## Cowork.tn – MVP Scaffold

Plateforme SaaS multi-tenant pour gérer les espaces de coworking tunisiens (réservations, membres, facturation, QR check-in). Ce dépôt contient l’ossature Next.js 14 demandée dans le cahier des charges afin de développer les features lors des prochains sprints.

### Stack imposée
- Next.js 16 (App Router) – JavaScript uniquement
- Tailwind CSS 3 + shadcn/ui (boutons, cards, dialogues, calendar…)
- next-intl pour i18n FR / AR (RTL) avec middleware
- next-themes pour le dark mode natif
- Supabase & Stripe placeholders (`lib/supabase.js`, `lib/plans.js`)

### Scripts
```bash
pnpm install       # installe les dépendances
pnpm dev           # démarre le serveur http://localhost:3000
pnpm build         # build production
pnpm start         # sert la version buildée
pnpm lint          # ESLint (JS uniquement)
```

### Structure rapide
- `app/` : routes App Router (landing, auth, super-admin, dashboard, membre)
- `app/[locale]/...` : routing FR/AR avec middleware auto (`/fr`, `/ar`)
- `components/` : UI marketing + dashboard (nav, hero, pricing, sidebar, data-table, shadcn/ui)
- `lib/` : utilitaires (i18n, plans, mock data, Supabase client placeholder, feature flags)
- `messages/` : dictionnaires FR & AR
- `middleware.js` + `next-intl.config.mjs` : forcent les locales prefixées

### Intégrations prévues (TODO)
- ✅ Shadcn components + Tailwind tokens (couleurs #2563EB, #1E40AF, #10B981)
- ⏳ Supabase Auth (RLS multi-tenant) – brancher `lib/supabase.js`
- ⏳ Stripe Billing (3 plans) – connecter webhooks + `mockInvoices`
- ⏳ PDF invoices + QR check-in – prévoir worker dans `/app/api`
- ⏳ Drag & drop plan interactif – remplacer `PlanCanvas` par éditeur React Flow

### Roadmap issue du cahier des charges
- [ ] Landing complète + pricing FR/AR
- [ ] Onboarding en 3 jours (Figma > Next)
- [ ] Super Admin (création d’espaces, suivi)
- [ ] Dashboard espace (plan interactif, stats MRR, activité)
- [ ] Membres + QR check-in + factures récurrentes
- [ ] Réservations drag & drop postes / salles
- [ ] Facturation Stripe + PDF auto + emails transactionnels
- [ ] Espace coworker `/my` (consultation réservations + paiement)

### Notes d’implémentation
- Police corps : Inter via `next/font`. Titre : Space Grotesk (placeholder) – remplacer par General Sans/Satoshi dès réception des fichiers.
- `.nvmrc` & `.node-version` ciblent Node 18.18.0 pour les déploiements.
- Les composants shadcn sont convertis en JavaScript pour respecter la contrainte « no TypeScript ».
- `mock-data.js` fournit des exemples pour itérer sur les écrans avant de brancher Supabase.

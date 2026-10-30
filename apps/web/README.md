# Site ZENITH TECH-SARL (Next.js + Sanity)

Site vitrine avec catalogue sans prix, demandes de devis (panier + formulaire), réalisations et page À propos.
Next.js 16 (App Router), React 19, Tailwind CSS 4, Sanity.

## Démarrer
```bash
npm install
cp .env.example .env.local
npm run dev
```
Sans `NEXT_PUBLIC_SANITY_PROJECT_ID`, le site s'affiche avec des **données d'exemple** (`lib/mock.ts`).
Dès que le projet Sanity est renseigné, le site lit le vrai contenu (rafraîchi toutes les 60 s).

## Brancher Sanity
1. Créez le Studio avec le schéma du dossier `sanity-schema` (documents, `structure.ts`, config singleton).
2. Renseignez `NEXT_PUBLIC_SANITY_PROJECT_ID` et `NEXT_PUBLIC_SANITY_DATASET` dans `.env.local`.
3. Créez les pôles, les catégories (avec leurs `filtres`), puis les produits, réalisations et clients références.
4. Le Studio doit autoriser l'origine de votre site dans les paramètres CORS du projet Sanity.

## Structure
```
app/                     pages (accueil, services, produits, réalisations, à propos, devis, contact, mentions légales)
app/api/devis/route.ts   réception des demandes de devis
components/              en-tête (méga-menu), pied de page, barre mobile, cartes, formulaire, filtres
lib/queries.ts           requêtes GROQ
lib/data.ts              accès aux données (Sanity, ou données d'exemple)
lib/mock.ts              données d'exemple
lib/quote.tsx            panier de devis (navigateur)
```

## Devis
Le formulaire envoie un JSON à `/api/devis`. Pour le transmettre à votre futur ERP NestJS, renseignez `QUOTE_WEBHOOK_URL`.
Sans cette variable, la demande est seulement écrite dans les logs du serveur : **ne mettez pas le site en ligne sans l'avoir configurée**.

## À faire avant la mise en ligne
- Remplacer les couleurs, le logo et les textes quand la maquette sera refaite (couleurs dans `app/globals.css`).
- Renseigner dans Sanity : coordonnées, WhatsApp, RCCM, NINA, texte et chiffres de la page À propos.
- Compléter l'hébergeur dans `app/mentions-legales/page.tsx`.
- Ajouter une vraie protection anti-spam (Cloudflare Turnstile) et une limitation de débit partagée (Redis/Upstash) : celle de `app/api/devis` est en mémoire.
- Ne publier un client référence que s'il a donné son accord (`afficherSurSite`).
- Optionnel : `generateStaticParams` pour pré-générer fiches produits et réalisations, et `sanity typegen` pour remplacer `lib/types.ts`.

# FisherMate

PWA de journal de pêche assisté par IA : à partir d'une photo et/ou d'un prompt texte, enregistre automatiquement le lieu, la date/heure, la météo, l'espèce, la taille, le leurre et la clarté de l'eau d'une prise.

## Stack

- **Frontend** : React + Vite, TypeScript, Tailwind CSS, PWA (`vite-plugin-pwa`)
- **Backend** : Vercel Serverless Functions (`/api`)
- **Base de données** : Postgres (Neon) + Prisma ORM
- **Stockage photos** : Vercel Blob
- **IA vision** : OpenAI GPT-4o (extraction structurée)
- **Météo** : Open-Meteo

## Développement local

```bash
npm install
npm run dev
```

Copiez `.env.example` vers `.env` et renseignez :

- `DATABASE_URL` / `DIRECT_URL` — chaînes de connexion Neon (poolée / directe)
- `OPENAI_API_KEY` — clé API OpenAI
- `BLOB_READ_WRITE_TOKEN` — jeton Vercel Blob

Après toute modification de `prisma/schema.prisma` :

```bash
npx prisma migrate dev
```

Les routes `/api/*` sont des fonctions serverless Vercel ; `vite dev` seul ne les exécute pas. Utilisez `vercel dev` (après `vercel login` + `vercel link`) pour tester le parcours complet en local, ou testez via un déploiement Vercel (preview/production).

## Déploiement

Le projet est pensé pour être importé directement dans Vercel (build Vite + fonctions `/api` auto-détectées). Configurez les mêmes variables d'environnement dans les réglages du projet Vercel.

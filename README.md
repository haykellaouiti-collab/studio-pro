# Studio Pro — HAK IA

Application SaaS de traitement vidéo et audio local dans le navigateur (React + Vite + FFmpeg.wasm + Supabase + Dodo Payments).

## Architecture (Standards HAK IA)
- `src/core/` : Authentification Supabase, vérification d'abonnement **Creator** et garde-fous de quotas.
- `src/processors/` : Moteur `FFmpeg.wasm` singleton (`ffmpegEngine.js`), anonymiseur (`anonymizerProcessor.js`) et assemblage multi-clips (`studioMixerProcessor.js`).
- `src/utils/` : Validation des fichiers vidéo, gestion déterministe des ressources mémoire (`ResourceTracker`) et journalisation.
- `src/ui/` : Composants React isolés de la logique de traitement.
- `tests/` : Suite de tests unitaires Vitest (`npm test`).
- `supabase/functions/dodo-webhook/` : Synchronisation automatique des paiements Dodo Payments vers la table `subscriptions`.

## Installation & Tests locaux
```bash
npm install
npm test
npm run dev
```

## Déploiement GitHub + Vercel
1. Poussez ce dossier sur votre dépôt GitHub.
2. Importez le projet dans Vercel (Framework Preset : **Vite**).
3. Ajoutez `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` dans les variables d'environnement Vercel.
4. `vercel.json` applique automatiquement les en-têtes `Cross-Origin-Opener-Policy` et `Cross-Origin-Embedder-Policy` requis par `FFmpeg.wasm`.

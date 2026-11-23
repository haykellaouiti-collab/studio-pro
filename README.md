# Studio Pro — HAK IA (v1.0)

Suite professionnelle de traitement vidéo et d'assemblage multi-clips exécutée **100 % localement dans le navigateur** grâce à WebAssembly (`FFmpeg.wasm`), avec authentification **Supabase**, quotas serveur atomiques et abonnements **Dodo Payments**.

## Fonctionnalités v1.0
- **Anonymiseur Vidéo** : suppression des métadonnées (`-map_metadata -1`) et des chapitres (`-map_chapters -1`), ré-encodage H.264/AAC (*Deep Clean*) pour les abonnés Creator.
- **Studio Multi-Clips** : assemblage ordonné (2 clips max en Gratuit, jusqu'à 10 clips en Creator) en format `16:9` ou `9:16` (`720p` ou `1080p`).
- **Watermark automatique** : filigrane `Studio Pro · HAK IA` incrusté sur le plan Gratuit, retiré sur le plan Creator.
- **Sécurité & Quotas serveur** : table `export_usage` + fonction PostgreSQL atomique `reserve_export` + Edge Function `export-gate`.
- **Paiements & Realtime** : intégration Dodo Payments (`10 $/mois`) avec webhook HMAC (`dodo-webhook`) et mise à jour instantanée via Supabase Realtime.

## Déploiement GitHub Pages
1. Déposez l'ensemble des fichiers à la racine de la branche `main` de votre dépôt GitHub.
2. Dans **Settings → Pages**, sélectionnez la branche `main` et le dossier `/ (root)`.
3. Exécutez les 3 fichiers SQL situés dans `supabase/migrations/` dans le **SQL Editor** de votre projet Supabase.

# NUVEX — Mise en route

## Lancer le site sur votre ordinateur
```bash
npm install
npm run dev
```
Puis ouvrez http://localhost:3000 (site) et http://localhost:3000/admin (admin).

Sans base de données, le site s'affiche avec le contenu par défaut, mais les formulaires et l'admin ne fonctionnent pas encore.

## Brancher l'admin (Supabase, gratuit) — 10 minutes
1. Créez un compte sur https://supabase.com puis **New project** (région : Europe).
2. **SQL Editor → New query** : collez tout le contenu de `supabase/schema.sql` puis **Run**.
3. **Authentication → Users → Add user → Create new user** : votre e-mail + un mot de passe solide (cochez « Auto confirm »).
4. De retour dans **SQL Editor**, exécutez (avec votre e-mail) :
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'VOTRE-EMAIL@exemple.com';
   ```
5. **Authentication → Sign In / Providers → Email** : désactivez **« Allow new users to sign up »** (personne d'autre ne pourra créer de compte).
6. **Project Settings → API** : copiez *Project URL* et la clé *anon public*.
7. Dans le dossier `site`, copiez `.env.example` en `.env.local` et collez-y les 2 valeurs.
8. Relancez `npm run dev`, allez sur `/admin` et connectez-vous.

## Ce que vous gérez dans /admin

**Mode démo** : tant que Supabase n'est pas branché, `/admin` s'ouvre avec des données fictives (enregistrées dans votre navigateur) pour tout tester. Le bouton « Réinitialiser la démo » remet les exemples à zéro.

### Pilotage
- **Tableau de bord** : encaissé ce mois, reste à encaisser, acomptes en attente, réservations, taux de confirmation, retards, note des avis, graphique des encaissements sur 6 mois et liste « À faire ».
- **Calendrier** : livraisons prévues (en bleu), en retard (en rouge), livrées (en vert) et démarrages ; liste des prochaines livraisons.

### Activité
- **Réservations** : les demandes envoyées depuis le site. Rappel en 1 clic (WhatsApp / appel), puis « Confirmer → projet » : crée la fiche client et le projet (prix de l'offre, livraison à J+7, acompte 50 %).
- **Projets clients** : projets à démarrer / en cours / livrés, compte à rebours avant livraison, retards, bouton « Marquer livré ».
- **Clients & paiements** : acomptes et soldes à encaisser bien en évidence, « Marquer payé » (date + moyen : espèces, CCP, BaridiMob…), relance WhatsApp pré-écrite, fiche de chaque client avec ses projets.

### Site web
- **Avis** : approuver / refuser / modifier / supprimer / ajouter. Seuls les avis approuvés s'affichent sur le site.
- **Offres** : noms, prix (vide = « Sur devis »), délais, liste de ce qui est inclus.
- **Réalisations** : ajouter, modifier, réordonner ou supprimer vos projets. Collez le lien du site : la capture d'écran se fait automatiquement (ou choisissez votre image). Aperçu en direct.
- **Paramètres** : WhatsApp, téléphone, e-mail, ville, réseaux sociaux.

Chaque modification du site (avis, offres, réalisations, paramètres) apparaît immédiatement.

## Mettre en ligne (Vercel, gratuit)
1. Envoyez le dossier `site` sur GitHub.
2. Sur https://vercel.com → **Add New Project** → importez le dépôt.
3. Dans **Environment Variables**, ajoutez `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. **Deploy**. Ajoutez ensuite votre nom de domaine dans **Settings → Domains**.

## Textes à compléter
Cherchez `[À REMPLACER]` et `[À CONFIRMER]` dans le code (FAQ : `components/site/faq.tsx`, note sous les offres : `app/page.tsx`). Les offres et réalisations se modifient depuis l'admin.

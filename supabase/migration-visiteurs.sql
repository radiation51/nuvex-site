-- ============================================================
-- NUVEX : page « Visiteurs » de l'admin (mesure d'audience anonyme, sans cookie)
-- À lancer UNE FOIS dans Supabase > SQL Editor. Sans risque : crée seulement une nouvelle table.
-- ============================================================

create table if not exists public.visits (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  -- view = page vue, offers_seen = a vu les offres, offer = a choisi une offre,
  -- whatsapp / phone = a cliqué pour écrire ou appeler, lead = a envoyé une demande de devis
  kind text not null,
  path text not null default '/',
  lang text,
  source text,
  device text,
  country text,
  -- empreinte anonyme qui change chaque jour (aucune adresse IP n'est enregistrée)
  visitor text not null,
  label text
);

create index if not exists visits_created_at_idx on public.visits (created_at);

-- Personne ne peut lire ni écrire directement : seul le serveur du site (clé secrète) y accède.
alter table public.visits enable row level security;

-- Les visites de plus de 13 mois ne servent plus : elles peuvent être effacées avec
--   delete from public.visits where created_at < now() - interval '13 months';

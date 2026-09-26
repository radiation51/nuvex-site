-- ============================================================
-- NUVEX : notifications sur le téléphone (Admin > Paramètres > Activer les notifications)
-- À lancer UNE FOIS dans Supabase > SQL Editor. Sans risque : crée seulement deux petites tables.
-- ============================================================

-- Clés d'envoi des notifications (créées automatiquement par le site, une seule ligne).
create table if not exists public.notify (
  id int primary key default 1 check (id = 1),
  vapid_public text,
  vapid_private text,
  updated_at timestamptz not null default now()
);

-- Appareils (téléphone, ordinateur) qui reçoivent les notifications.
create table if not exists public.push_subscriptions (
  endpoint text primary key,
  p256dh text not null,
  auth text not null,
  device text,
  created_at timestamptz not null default now()
);

-- Personne ne peut lire ni écrire directement : seul le serveur du site (clé secrète) y accède.
alter table public.notify enable row level security;
alter table public.push_subscriptions enable row level security;

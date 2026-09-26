-- ============================================================
-- NUVEX : notifications Telegram (Admin > Paramètres > Relier mon Telegram)
-- À lancer UNE FOIS dans Supabase > SQL Editor. Sans risque : crée seulement une petite table.
-- ============================================================

-- Le compte Telegram qui reçoit les notifications (une seule ligne).
create table if not exists public.notify (
  id int primary key default 1 check (id = 1),
  telegram_chat_id text,
  updated_at timestamptz not null default now()
);

-- Personne ne peut lire ni écrire directement : seul le serveur du site (clé secrète) y accède.
alter table public.notify enable row level security;

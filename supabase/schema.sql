-- =====================================================================
-- NUVEX — base de données Supabase
-- À coller une seule fois dans Supabase > SQL Editor > New query > Run
-- =====================================================================

-- ---------- Tables ----------
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 60),
  role text check (char_length(role) <= 80),
  text text not null check (char_length(text) between 10 and 600),
  rating int not null default 5 check (rating between 1 and 5),
  image_url text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 80),
  phone text not null check (char_length(phone) between 6 and 30),
  email text check (char_length(email) <= 120),
  offer text check (char_length(offer) <= 60),
  message text check (char_length(message) <= 2000),
  status text not null default 'new' check (status in ('new', 'contacted', 'converted', 'cancelled')),
  created_at timestamptz not null default now()
);

-- Clients (fiches clients, visibles uniquement par l'admin)
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null default '',
  email text,
  company text,
  city text,
  notes text,
  created_at timestamptz not null default now()
);

-- Projets clients : suivi de la création, de la livraison et des paiements (acompte 50 % + solde)
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  lead_id uuid references public.leads (id) on delete set null,
  title text not null,
  offer text,
  price int not null default 0 check (price >= 0),
  deposit_percent int not null default 50 check (deposit_percent between 0 and 100),
  deposit_paid_at date,
  deposit_method text,
  balance_paid_at date,
  balance_method text,
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'delivered', 'cancelled')),
  start_date date,
  due_date date,
  delivered_at date,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.offers (
  id text primary key,
  name text not null,
  description text not null default '',
  price int,
  delivery text not null default '',
  features jsonb not null default '[]'::jsonb,
  popular boolean not null default false,
  position int not null default 0,
  -- Traductions anglais / arabe (voir supabase/migration-langues.sql)
  translations jsonb
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text,
  description text,
  image_url text not null,
  link text,
  position int not null default 0,
  translations jsonb
);

create table if not exists public.settings (
  id int primary key default 1 check (id = 1),
  whatsapp text not null default '',
  phone text not null default '',
  email text not null default '',
  city text not null default 'Algérie',
  facebook text not null default '',
  instagram text not null default '',
  tiktok text not null default '',
  linkedin text not null default ''
);
insert into public.settings (id, whatsapp, phone, instagram) values (1, '0791 84 00 45', '0791 84 00 45', 'https://www.instagram.com/nuvex.213/') on conflict do nothing;

-- Mesure d'audience anonyme de la page « Visiteurs » (voir supabase/migration-visiteurs.sql)
create table if not exists public.visits (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  kind text not null,
  path text not null default '/',
  lang text,
  source text,
  device text,
  country text,
  visitor text not null,
  label text
);
create index if not exists visits_created_at_idx on public.visits (created_at);
alter table public.visits enable row level security;

-- Compte Telegram qui reçoit les notifications (voir supabase/migration-notifications.sql)
create table if not exists public.notify (
  id int primary key default 1 check (id = 1),
  telegram_chat_id text,
  updated_at timestamptz not null default now()
);
alter table public.notify enable row level security;

-- ---------- Qui est admin ? ----------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ---------- Sécurité (RLS) ----------
alter table public.admins   enable row level security;
alter table public.reviews  enable row level security;
alter table public.leads    enable row level security;
alter table public.offers   enable row level security;
alter table public.projects enable row level security;
alter table public.settings enable row level security;
alter table public.clients  enable row level security;
alter table public.orders   enable row level security;

-- admins : chacun voit seulement sa propre ligne
drop policy if exists "admins_self" on public.admins;
create policy "admins_self" on public.admins for select using (user_id = auth.uid());

-- reviews : tout le monde peut ENVOYER un avis (forcément "en attente"),
-- le public ne lit que les avis approuvés, l'admin fait tout.
drop policy if exists "reviews_insert_public" on public.reviews;
create policy "reviews_insert_public" on public.reviews for insert
  with check (status = 'pending');
drop policy if exists "reviews_read_approved" on public.reviews;
create policy "reviews_read_approved" on public.reviews for select
  using (status = 'approved' or public.is_admin());
drop policy if exists "reviews_admin" on public.reviews;
create policy "reviews_admin" on public.reviews for all
  using (public.is_admin()) with check (public.is_admin());

-- leads : tout le monde peut envoyer une demande, seul l'admin peut la lire.
drop policy if exists "leads_insert_public" on public.leads;
create policy "leads_insert_public" on public.leads for insert
  with check (status = 'new');
drop policy if exists "leads_admin" on public.leads;
create policy "leads_admin" on public.leads for all
  using (public.is_admin()) with check (public.is_admin());

-- clients / orders : réservés à l'admin (aucun accès public).
drop policy if exists "clients_admin" on public.clients;
create policy "clients_admin" on public.clients for all
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists "orders_admin" on public.orders;
create policy "orders_admin" on public.orders for all
  using (public.is_admin()) with check (public.is_admin());

-- offers / projects / settings : lecture publique, modification admin.
drop policy if exists "offers_read" on public.offers;
create policy "offers_read" on public.offers for select using (true);
drop policy if exists "offers_admin" on public.offers;
create policy "offers_admin" on public.offers for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "projects_read" on public.projects;
create policy "projects_read" on public.projects for select using (true);
drop policy if exists "projects_admin" on public.projects;
create policy "projects_admin" on public.projects for all
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "settings_read" on public.settings;
create policy "settings_read" on public.settings for select using (true);
drop policy if exists "settings_admin" on public.settings;
create policy "settings_admin" on public.settings for all
  using (public.is_admin()) with check (public.is_admin());

-- ---------- Stockage des images ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 3145728, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

-- Les visiteurs peuvent seulement déposer une photo d'avis dans le dossier "reviews/".
drop policy if exists "media_upload_reviews" on storage.objects;
create policy "media_upload_reviews" on storage.objects for insert
  with check (bucket_id = 'media' and (storage.foldername(name))[1] = 'reviews');
drop policy if exists "media_admin" on storage.objects;
create policy "media_admin" on storage.objects for all
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

-- ---------- Offres par défaut ----------
insert into public.offers (id, name, description, price, delivery, features, popular, position) values
('eco', 'Éco', 'L''essentiel pour être visible en ligne.', 25000, 'Livré en 7 jours',
  '[{"label":"Site one-page","included":true},{"label":"Nom de domaine inclus","included":true},{"label":"Adapté mobile","included":true},{"label":"Bouton WhatsApp","included":true},{"label":"Formulaire de contact","included":true},{"label":"Référencement Google","included":false}]', false, 1),
('pro', 'Pro', 'Le choix idéal pour les entreprises.', 45000, 'Livré en 7 jours',
  '[{"label":"Jusqu''à 5 pages","included":true},{"label":"Nom de domaine inclus","included":true},{"label":"Adapté mobile","included":true},{"label":"Bouton WhatsApp","included":true},{"label":"Référencement Google de base","included":true},{"label":"Petit espace d''administration (textes, photos, horaires)","included":true}]', true, 2),
('premium', 'Premium', 'Un site complet que vous gérez vous-même.', 95000, 'Livré en 7 jours',
  '[{"label":"Pages illimitées","included":true},{"label":"Nom de domaine inclus","included":true},{"label":"Design 100 % personnalisé","included":true},{"label":"Espace d''administration complet","included":true},{"label":"Référencement Google avancé","included":true},{"label":"Support prioritaire","included":true}]', false, 3),
('sur-mesure', 'Sur-mesure', 'E-commerce, réservation, application… on s''adapte.', null, 'Délai fixé ensemble selon le projet',
  '[{"label":"Analyse de votre besoin","included":true},{"label":"Nom de domaine inclus","included":true},{"label":"Fonctionnalités sur mesure","included":true},{"label":"Boutique en ligne possible","included":true},{"label":"Accompagnement dédié","included":true}]', false, 4)
on conflict (id) do nothing;

-- ---------- Nos réalisations ----------
alter table public.projects add column if not exists description text;
insert into public.projects (title, category, description, image_url, link, position)
select * from (values
  ('Bourahla Auto', 'Transport VIP & chauffeur privé', 'Site vitrine haut de gamme : services, galerie et réservation de trajets en ligne.', '/projects/bourahla-auto.jpg', 'https://bourahla-auto.com', 1),
  ('Qalb Al Haba — قلب الحبة', 'Boutique en ligne · huile d''olive', 'E-commerce en arabe, français et anglais, avec panier et commande via WhatsApp.', '/projects/qalb-alhaba.jpg', 'https://qalb-alhaba.netlify.app', 2),
  ('Logiciel Mayfer', 'Logiciel sur mesure', 'Logiciel de gestion développé sur mesure.', '/projects/mayfer.svg', null, 3)
) as v(title, category, description, image_url, link, position)
where not exists (select 1 from public.projects);

-- =====================================================================
-- DERNIÈRE ÉTAPE (après avoir créé votre compte admin dans
-- Authentication > Users > Add user) : remplacez l'e-mail puis exécutez :
--
--   insert into public.admins (user_id)
--   select id from auth.users where email = 'VOTRE-EMAIL@exemple.com';
-- =====================================================================

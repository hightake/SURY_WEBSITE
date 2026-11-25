-- =====================================================================
-- SURY – database schema (Lovable Cloud / Supabase · PostgreSQL)
-- DRAFT FOR REVIEW – not applied yet. Runs once in the Lovable SQL editor.
--
-- Mirrors src/models/content.ts. The app talks to it only through
-- src/data (the Backend interface); the stand-in in the browser is replaced
-- by a Supabase adapter, nothing else in the code changes.
--
-- Security model
--   * Visitors (anon): read published content only.
--   * Admins: signed in with Google AND listed in public.admins.
--       editor – edits all content
--       owner  – also manages the admins list
--   * Every rule is enforced here with Row Level Security (RLS);
--     the admin screens only mirror it.
-- =====================================================================

create extension if not exists citext;

-- ---------------------------------------------------------------------
-- 1. Who may manage the site
-- ---------------------------------------------------------------------
create table public.admins (
  email      citext primary key check (email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  role       text   not null default 'editor' check (role in ('owner', 'editor')),
  added_by   citext,
  created_at timestamptz not null default now()
);

-- the signed-in user's e-mail, from the Google sign-in token
create or replace function public.auth_email() returns public.citext
  language sql stable set search_path = '' as
  $$ select nullif(auth.jwt() ->> 'email', '')::public.citext $$;

-- The two checks run with the table owner's rights (security definer), so they
-- are locked down: an empty search_path with full names, so nothing can be
-- slipped in under the same name, and only the roles that need them may run them.
create or replace function public.is_admin() returns boolean
  language sql stable security definer set search_path = '' as
  $$ select exists (select 1 from public.admins where email OPERATOR(public.=) public.auth_email()) $$;

create or replace function public.is_owner() returns boolean
  language sql stable security definer set search_path = '' as
  $$ select exists (select 1 from public.admins where email OPERATOR(public.=) public.auth_email() and role = 'owner') $$;

revoke execute on function public.auth_email(), public.is_admin(), public.is_owner() from public;
grant  execute on function public.auth_email(), public.is_owner() to authenticated;
-- is_admin stays callable by visitors: the read rules ("visible or is_admin()") use it, and for a visitor it simply returns false
grant  execute on function public.is_admin() to anon, authenticated;

-- there is always at least one owner
create or replace function public.keep_one_owner() returns trigger
  language plpgsql as $$
begin
  if (select count(*) from admins where role = 'owner') = 0 then
    raise exception 'חייבת להישאר לפחות בעלת אתר אחת';
  end if;
  return null;
end $$;

create constraint trigger admins_keep_one_owner
  after update or delete on public.admins
  deferrable initially deferred
  for each row execute function public.keep_one_owner();

-- ---------------------------------------------------------------------
-- 2. Media (files live in Storage bucket "media"; one row per image)
-- ---------------------------------------------------------------------
create table public.media (
  id          uuid primary key default gen_random_uuid(),
  path        text not null unique,      -- media/<uuid>.webp  (≤1600px)
  small_path  text,                      -- media/<uuid>-sm.webp (≤700px)
  width       int  not null check (width > 0),
  height      int  not null check (height > 0),
  alt         text not null default '',  -- accessibility text
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 3. Catalogue
-- ---------------------------------------------------------------------
-- the five worlds – fixed set, edited but never added/removed from the admin
create table public.categories (
  id          smallint primary key,      -- category code: 1 hats … 5 blanche
  slug        text not null unique,      -- the word in links: hats, bandanas, cloa, scarves, blanche
  name        text not null,
  short_name  text not null,
  tagline     text not null default '',
  intro       text not null default '',
  sort_order  int  not null,
  cover_id    uuid references public.media (id) on delete set null,  -- category page photo
  niche_id    uuid references public.media (id) on delete set null   -- product on the stand (home)
);

create table public.subcategories (
  id            uuid primary key default gen_random_uuid(),
  category_id   smallint not null references public.categories (id),
  slug          text not null,           -- used in links (#anchor)
  name          text not null,
  sort_order    int  not null default 0,
  unique (category_id, slug)
);

-- A product belongs to a sub-category only; its category is the sub-category's
-- category. Storing the category on the product too could let the two disagree.
-- product numbers: 1001, 1002 … – the SKU and the link, never reused
create sequence public.product_sku_seq start 1001;

create table public.products (
  id              uuid primary key default gen_random_uuid(),
  sku             int  not null unique default nextval('public.product_sku_seq'),
  subcategory_id  uuid not null references public.subcategories (id) on delete restrict,
  name            text not null,
  description     text not null default '',
  details         text not null default '',
  sort_order      int  not null default 0,
  visible         boolean not null default false,   -- new products start hidden
  featured        boolean not null default false,   -- "new collection" on the home page
  price           numeric(10,2) check (price >= 0), -- optional, never shown
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index products_subcategory_idx on public.products (subcategory_id, sort_order);
create index products_featured_idx on public.products (featured) where featured;

-- ordered photos of a product; position 0 is the main photo
create table public.product_images (
  product_id uuid not null references public.products (id) on delete cascade,
  position   int  not null check (position >= 0),
  media_id   uuid not null references public.media (id) on delete restrict,
  primary key (product_id, position)
);

-- ---------------------------------------------------------------------
-- 4. Stores (edited once, shown on home, stores page and product pages)
-- ---------------------------------------------------------------------
create table public.stores (
  id           uuid primary key default gen_random_uuid(),
  city         text not null,
  label        text,                      -- e.g. "חנות סיטונאית"
  is_wholesale boolean not null default false,
  address      text not null default '',
  phone        text not null default '',
  nav_query    text not null default '',  -- what to search in Waze
  sort_order   int  not null default 0
);

create table public.store_hours (
  store_id uuid not null references public.stores (id) on delete cascade,
  position int  not null,
  days     text not null,                 -- "א׳–ה׳"
  hours    text not null,                 -- "10:00–20:00" / "סגור"
  primary key (store_id, position)
);

-- ---------------------------------------------------------------------
-- 5. Texts, banners and settings
-- ---------------------------------------------------------------------
-- one row per editable block; the shape of `data` per key is in src/models/content.ts
--   home.hero · home.worlds · home.newCollection · home.uniqueness
--   home.storyTeaser · home.stores · home.contact
--   page.story · page.privacy · page.accessibility   (body = sanitised HTML)
create table public.page_sections (
  key        text primary key,
  data       jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by citext
);

create table public.hero_banners (
  id            uuid primary key default gen_random_uuid(),
  media_id      uuid not null references public.media (id) on delete restrict,
  caption       text not null default '',
  category_id   smallint references public.categories (id),  -- null = stores page
  sort_order    int  not null default 0
);

-- public contact details (single row)
create table public.settings (
  id               smallint primary key default 1 check (id = 1),
  phone            text not null,
  whatsapp         text not null check (whatsapp ~ '^972\d{8,9}$'),
  whatsapp_display text not null,
  public_email     text not null
);

-- private settings – never readable by visitors (single row)
create table public.private_settings (
  id            smallint primary key default 1 check (id = 1),
  contact_inbox text not null           -- where the contact form is e-mailed
);

-- keep updated_at / updated_by current
create or replace function public.touch() returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  if tg_table_name = 'page_sections' then new.updated_by := auth_email(); end if;
  return new;
end $$;
create trigger products_touch      before update on public.products      for each row execute function public.touch();
create trigger page_sections_touch before insert or update on public.page_sections for each row execute function public.touch();

-- =====================================================================
-- 6. Row Level Security
-- =====================================================================
alter table public.admins           enable row level security;
alter table public.media            enable row level security;
alter table public.categories       enable row level security;
alter table public.subcategories    enable row level security;
alter table public.products         enable row level security;
alter table public.product_images   enable row level security;
alter table public.stores           enable row level security;
alter table public.store_hours      enable row level security;
alter table public.page_sections    enable row level security;
alter table public.hero_banners     enable row level security;
alter table public.settings         enable row level security;
alter table public.private_settings enable row level security;

-- public content: everyone reads, admins write
do $$
declare t text;
begin
  foreach t in array array['media','subcategories','stores','store_hours','page_sections','hero_banners'] loop
    execute format('create policy "%1$s: public read"  on public.%1$I for select using (true)', t);
    execute format('create policy "%1$s: admin insert" on public.%1$I for insert to authenticated with check (public.is_admin())', t);
    execute format('create policy "%1$s: admin update" on public.%1$I for update to authenticated using (public.is_admin()) with check (public.is_admin())', t);
    execute format('create policy "%1$s: admin delete" on public.%1$I for delete to authenticated using (public.is_admin())', t);
  end loop;
end $$;

-- categories: fixed set – admins may edit, nobody adds or removes
create policy "categories: public read"  on public.categories for select using (true);
create policy "categories: admin update" on public.categories for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- products: visitors see only visible ones; admins see and edit all
create policy "products: read visible" on public.products for select using (visible or public.is_admin());
create policy "products: admin insert" on public.products for insert to authenticated with check (public.is_admin());
create policy "products: admin update" on public.products for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "products: admin delete" on public.products for delete to authenticated using (public.is_admin());

create policy "product_images: read with product" on public.product_images for select
  using (exists (select 1 from public.products p where p.id = product_id and (p.visible or public.is_admin())));
create policy "product_images: admin write" on public.product_images for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- settings: public row read by all, edited by admins
create policy "settings: public read"  on public.settings for select using (true);
create policy "settings: admin update" on public.settings for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- private settings: admins only (the contact-form function uses the service role)
create policy "private_settings: admin read"   on public.private_settings for select to authenticated using (public.is_admin());
create policy "private_settings: admin update" on public.private_settings for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- admins list: each admin sees her own row (to know her role); the owner sees and manages all
create policy "admins: read self or owner" on public.admins for select to authenticated using (email = public.auth_email() or public.is_owner());
create policy "admins: owner insert" on public.admins for insert to authenticated with check (public.is_owner());
create policy "admins: owner update" on public.admins for update to authenticated using (public.is_owner()) with check (public.is_owner());
create policy "admins: owner delete" on public.admins for delete to authenticated using (public.is_owner());

-- =====================================================================
-- 7. Storage – bucket "media": public read, admins upload / replace / delete
--    Images only, up to 5 MB each – a safety net: the admin already shrinks
--    every image in the browser (1600px WebP, usually 200–400 KB).
-- =====================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 5242880, array['image/webp', 'image/jpeg', 'image/png'])
on conflict (id) do update set file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "media files: public read"  on storage.objects for select using (bucket_id = 'media');
create policy "media files: admin insert" on storage.objects for insert to authenticated with check (bucket_id = 'media' and public.is_admin());
create policy "media files: admin update" on storage.objects for update to authenticated using (bucket_id = 'media' and public.is_admin());
create policy "media files: admin delete" on storage.objects for delete to authenticated using (bucket_id = 'media' and public.is_admin());

-- =====================================================================
-- 8. Seed
-- =====================================================================
insert into public.admins (email, role) values ('sury025408888@gmail.com', 'owner');  -- replace with the client's Google account
insert into public.settings (phone, whatsapp, whatsapp_display, public_email)
  values ('02-5408888', '972503970444', '050-3970444', 'sury025408888@gmail.com');
insert into public.private_settings (contact_inbox) values ('sury025408888@gmail.com');
-- categories, sub-categories, products, stores and texts are imported from
-- src/content/site.json by a one-off script when the database is connected.

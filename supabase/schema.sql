-- Run this in Supabase SQL Editor (or as a migration).
-- Safe for re-run with IF NOT EXISTS guards.

create extension if not exists "pgcrypto";

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  label text not null,
  type text not null check (type in ('pattern', 'supplier', 'creator')),
  created_at timestamptz not null default now()
);

create table if not exists public.patterns (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  image_url text not null,
  difficulty text not null default 'Beginner'
    check (difficulty in ('Beginner', 'Intermediate', 'Advanced')),
  peg_width int not null default 29 check (peg_width > 0),
  peg_height int not null default 29 check (peg_height > 0),
  bead_count int not null default 0 check (bead_count >= 0),
  colors_required jsonb not null default '[]'::jsonb,
  tags text[] not null default '{}',
  category_id uuid references public.categories(id) on delete set null,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_patterns_category_id on public.patterns(category_id);
create index if not exists idx_patterns_created_at on public.patterns(created_at desc);
create index if not exists idx_patterns_difficulty on public.patterns(difficulty);

create table if not exists public.suppliers (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  company_name text not null,
  description text not null default '',
  location text not null default '',
  factory_type text not null default '',
  moq text not null default '',
  lead_time text not null default '',
  accepted_payment text[] not null default '{}',
  is_verified boolean not null default false,
  contact_email text,
  website text,
  main_products text[] not null default '{}',
  certification_badges text[] not null default '{}',
  gallery_urls text[] not null default '{}',
  category_id uuid references public.categories(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_suppliers_category_id on public.suppliers(category_id);
create index if not exists idx_suppliers_verified on public.suppliers(is_verified);

create table if not exists public.creators (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  bio text not null default '',
  platform text not null default '',
  profile_url text,
  avatar_url text,
  featured_works text[] not null default '{}',
  is_featured boolean not null default false,
  category_id uuid references public.categories(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_creators_featured on public.creators(is_featured);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid references public.suppliers(id) on delete set null,
  name text not null,
  email text not null,
  company text,
  quantity text,
  message text not null,
  source text not null default 'home',
  status text not null default 'New' check (status in ('New', 'Contacted', 'Closed')),
  created_at timestamptz not null default now()
);

create index if not exists idx_inquiries_supplier_id on public.inquiries(supplier_id);
create index if not exists idx_inquiries_status on public.inquiries(status);
create index if not exists idx_inquiries_created_at on public.inquiries(created_at desc);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text not null unique,
  stripe_payment_intent_id text,
  pattern_id uuid references public.patterns(id) on delete set null,
  customer_email text,
  shipping_address jsonb,
  amount_total int not null default 0,
  currency text not null default 'usd',
  status text not null default 'Paid' check (status in ('Pending', 'Paid', 'Shipped', 'Delivered', 'Canceled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.categories enable row level security;
alter table public.patterns enable row level security;
alter table public.suppliers enable row level security;
alter table public.creators enable row level security;
alter table public.inquiries enable row level security;
alter table public.orders enable row level security;

drop policy if exists "Public read categories" on public.categories;
create policy "Public read categories"
  on public.categories for select to anon, authenticated using (true);

drop policy if exists "Public read patterns" on public.patterns;
create policy "Public read patterns"
  on public.patterns for select to anon, authenticated using (true);

drop policy if exists "Public read suppliers" on public.suppliers;
create policy "Public read suppliers"
  on public.suppliers for select to anon, authenticated using (true);

drop policy if exists "Public read creators" on public.creators;
create policy "Public read creators"
  on public.creators for select to anon, authenticated using (true);

drop policy if exists "Allow anon insert inquiries" on public.inquiries;
create policy "Allow anon insert inquiries"
  on public.inquiries for insert to anon, authenticated with check (true);

drop policy if exists "Allow authenticated read inquiries" on public.inquiries;
create policy "Allow authenticated read inquiries"
  on public.inquiries for select to authenticated using (true);

drop policy if exists "Allow authenticated update inquiries" on public.inquiries;
create policy "Allow authenticated update inquiries"
  on public.inquiries for update to authenticated using (true);

drop policy if exists "Allow authenticated orders read" on public.orders;
create policy "Allow authenticated orders read"
  on public.orders for select to authenticated using (true);

drop policy if exists "Allow authenticated orders update" on public.orders;
create policy "Allow authenticated orders update"
  on public.orders for update to authenticated using (true);

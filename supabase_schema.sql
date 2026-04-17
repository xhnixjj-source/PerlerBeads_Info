-- =============================================================================
-- 可直接执行：Supabase → Dashboard → SQL → 新建查询 → 全选粘贴 → Run
-- 或：psql -f supabase_schema.sql
-- 可与仓库内 `supabase/schema.sql` 已建表共存：会为旧列名补新列（如 is_verified → verified）。
-- =============================================================================

begin;

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- patterns: 拼豆图纸
create table if not exists public.patterns (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  difficulty text not null default 'beginner'
    check (difficulty in ('beginner', 'intermediate', 'advanced')),
  color_palette jsonb not null default '[]'::jsonb,
  image_url text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_patterns_created_at on public.patterns (created_at desc);
create index if not exists idx_patterns_difficulty on public.patterns (difficulty);

drop trigger if exists trg_patterns_set_updated_at on public.patterns;
create trigger trg_patterns_set_updated_at
  before update on public.patterns
  for each row
  execute procedure public.set_updated_at();

-- suppliers: 供应商
create table if not exists public.suppliers (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  location text not null default '',
  moq int not null default 1 check (moq >= 0),
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 旧版 suppliers 使用 is_verified，此处补 verified 供后续索引/查询使用
alter table public.suppliers add column if not exists verified boolean not null default false;

do $legacy_suppliers$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'suppliers'
      and column_name = 'is_verified'
  ) then
    execute 'update public.suppliers set verified = is_verified';
  end if;
end
$legacy_suppliers$;

create index if not exists idx_suppliers_verified on public.suppliers (verified);

drop trigger if exists trg_suppliers_set_updated_at on public.suppliers;
create trigger trg_suppliers_set_updated_at
  before update on public.suppliers
  for each row
  execute procedure public.set_updated_at();

-- orders: 订单（依赖 patterns）
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  pattern_id uuid not null references public.patterns (id) on delete restrict,
  total_price numeric(12, 2) not null check (total_price >= 0),
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'processing', 'shipped', 'completed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_orders_pattern_id on public.orders (pattern_id);
create index if not exists idx_orders_status on public.orders (status);
create index if not exists idx_orders_created_at on public.orders (created_at desc);

drop trigger if exists trg_orders_set_updated_at on public.orders;
create trigger trg_orders_set_updated_at
  before update on public.orders
  for each row
  execute procedure public.set_updated_at();

-- inquiries: 询盘（依赖 suppliers）
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references public.suppliers (id) on delete cascade,
  buyer_email text not null,
  message text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 旧版 inquiries 使用 email、无 updated_at
alter table public.inquiries add column if not exists buyer_email text;
alter table public.inquiries add column if not exists updated_at timestamptz not null default now();

do $legacy_inquiries$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'inquiries'
      and column_name = 'email'
  ) then
    execute 'update public.inquiries set buyer_email = email where buyer_email is null';
  end if;
end
$legacy_inquiries$;

alter table public.inquiries alter column buyer_email set not null;

create index if not exists idx_inquiries_supplier_id on public.inquiries (supplier_id);
create index if not exists idx_inquiries_created_at on public.inquiries (created_at desc);

drop trigger if exists trg_inquiries_set_updated_at on public.inquiries;
create trigger trg_inquiries_set_updated_at
  before update on public.inquiries
  for each row
  execute procedure public.set_updated_at();

-- creators: 博主
create table if not exists public.creators (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  platform text not null default '',
  followers bigint not null default 0 check (followers >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 旧版 creators 无 followers 列
alter table public.creators add column if not exists followers bigint not null default 0;

create index if not exists idx_creators_platform on public.creators (platform);
create index if not exists idx_creators_followers on public.creators (followers desc);

drop trigger if exists trg_creators_set_updated_at on public.creators;
create trigger trg_creators_set_updated_at
  before update on public.creators
  for each row
  execute procedure public.set_updated_at();

commit;

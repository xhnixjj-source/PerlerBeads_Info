-- E-commerce: categories, customer OAuth users, product category FK, order line items, shop orders.
-- Run after supabase_schema.sql + supabase_admin_schema.sql + prior migrations.

begin;

-- ---------------------------------------------------------------------------
-- Customer users (OAuth / storefront; separate from admin_users)
-- ---------------------------------------------------------------------------
create table if not exists public.customer_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  image text,
  email_verified timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_customer_users_email on public.customer_users (lower(email));

drop trigger if exists trg_customer_users_set_updated_at on public.customer_users;
create trigger trg_customer_users_set_updated_at
  before update on public.customer_users
  for each row
  execute procedure public.set_updated_at();

-- OAuth provider linkage (optional persistence for NextAuth events)
create table if not exists public.customer_accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.customer_users (id) on delete cascade,
  type text not null default 'oauth',
  provider text not null,
  provider_account_id text not null,
  refresh_token text,
  access_token text,
  expires_at bigint,
  token_type text,
  scope text,
  id_token text,
  created_at timestamptz not null default now(),
  unique (provider, provider_account_id)
);

create index if not exists idx_customer_accounts_user_id on public.customer_accounts (user_id);

-- ---------------------------------------------------------------------------
-- Product categories (admin-configurable)
-- Conflicts with older supabase/schema.sql shape: (slug, label, type) — no "name" column.
-- ---------------------------------------------------------------------------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Upgrade legacy public.categories (label/type) to storefront columns without dropping the table.
do $legacy_categories$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'categories'
      and column_name = 'label'
  )
  and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'categories'
      and column_name = 'name'
  ) then
    alter table public.categories add column if not exists name text;
    alter table public.categories add column if not exists description text not null default '';
    alter table public.categories add column if not exists sort_order int not null default 0;
    alter table public.categories add column if not exists is_active boolean not null default true;
    alter table public.categories add column if not exists updated_at timestamptz not null default now();
    update public.categories set name = label where name is null;
    update public.categories set name = coalesce(nullif(trim(name), ''), slug) where name is null or trim(name) = '';
    alter table public.categories alter column name set not null;
  elsif exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'categories'
      and column_name = 'label'
  )
  and exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'categories'
      and column_name = 'name'
  ) then
    update public.categories
    set name = coalesce(nullif(trim(name), ''), label, slug)
    where trim(coalesce(name, '')) = '';
  elsif exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'categories'
      and column_name = 'name'
  )
  and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'categories'
      and column_name = 'updated_at'
  ) then
    alter table public.categories add column if not exists description text not null default '';
    alter table public.categories add column if not exists sort_order int not null default 0;
    alter table public.categories add column if not exists is_active boolean not null default true;
    alter table public.categories add column if not exists updated_at timestamptz not null default now();
  end if;
end
$legacy_categories$;

drop trigger if exists trg_categories_set_updated_at on public.categories;
create trigger trg_categories_set_updated_at
  before update on public.categories
  for each row
  execute procedure public.set_updated_at();

-- Seed store categories. Legacy supabase/schema.sql also has NOT NULL "label" — must supply it when present.
do $seed_categories$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'categories'
      and column_name = 'label'
  )
  and exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'categories'
      and column_name = 'type'
  ) then
    insert into public.categories (name, slug, description, sort_order, type, label)
    values
      ('拼豆产品', 'perler-beads', 'Perler / fuse bead kits and supplies', 1, 'pattern', '拼豆产品'),
      ('木制手工玩具', 'wooden-toys', 'Wooden craft toys', 2, 'pattern', '木制手工玩具'),
      ('3D打印', '3d-printing', '3D-printed parts and models', 3, 'pattern', '3D打印')
    on conflict (slug) do nothing;
  elsif exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'categories'
      and column_name = 'type'
  ) then
    insert into public.categories (name, slug, description, sort_order, type)
    values
      ('拼豆产品', 'perler-beads', 'Perler / fuse bead kits and supplies', 1, 'pattern'),
      ('木制手工玩具', 'wooden-toys', 'Wooden craft toys', 2, 'pattern'),
      ('3D打印', '3d-printing', '3D-printed parts and models', 3, 'pattern')
    on conflict (slug) do nothing;
  else
    insert into public.categories (name, slug, description, sort_order)
    values
      ('拼豆产品', 'perler-beads', 'Perler / fuse bead kits and supplies', 1),
      ('木制手工玩具', 'wooden-toys', 'Wooden craft toys', 2),
      ('3D打印', '3d-printing', '3D-printed parts and models', 3)
    on conflict (slug) do nothing;
  end if;
end
$seed_categories$;

drop policy if exists "Public read categories" on public.categories;

-- ---------------------------------------------------------------------------
-- Products: category FK, remove supplier, listing status
-- ---------------------------------------------------------------------------
alter table public.products add column if not exists category_id uuid references public.categories (id) on delete set null;
alter table public.products add column if not exists list_status text not null default 'published';

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'products_list_status_check'
  ) then
    alter table public.products
      add constraint products_list_status_check
      check (list_status in ('draft', 'published'));
  end if;
end $$;

-- Backfill category_id from legacy text column when possible
update public.products p
set category_id = c.id
from public.categories c
where p.category_id is null
  and p.category is not null
  and trim(p.category) <> ''
  and (
    lower(trim(p.category)) = lower(c.slug)
    or lower(trim(p.category)) = lower(c.name)
  );

-- Remaining products: attach default category (first by sort_order)
update public.products p
set category_id = (select id from public.categories order by sort_order asc limit 1)
where p.category_id is null;

alter table public.products drop constraint if exists products_supplier_id_fkey;
alter table public.products drop column if exists supplier_id;

alter table public.products drop column if exists category;

-- ---------------------------------------------------------------------------
-- Orders: support shop carts + legacy pattern kit rows
-- Some DBs never had order_number (prep-only rows) — add before touching the column.
-- ---------------------------------------------------------------------------
alter table public.orders add column if not exists order_number text;
alter table public.orders add column if not exists stripe_session_id text;
alter table public.orders add column if not exists amount_total int;
alter table public.orders add column if not exists currency text default 'usd';
alter table public.orders add column if not exists user_id uuid references public.customer_users (id) on delete set null;
alter table public.orders add column if not exists order_type text not null default 'pattern_kit';
alter table public.orders add column if not exists shipping_address jsonb;
alter table public.orders add column if not exists total_price numeric(12, 2);

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'orders_order_type_check'
  ) then
    alter table public.orders
      add constraint orders_order_type_check
      check (order_type in ('pattern_kit', 'shop'));
  end if;
end $$;

do $orders_nullable$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'orders'
      and column_name = 'pattern_id'
  ) then
    execute 'alter table public.orders alter column pattern_id drop not null';
  end if;
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'orders'
      and column_name = 'order_number'
  ) then
    execute 'alter table public.orders alter column order_number drop not null';
  end if;
end
$orders_nullable$;

-- ---------------------------------------------------------------------------
-- Order line items (shop orders)
-- ---------------------------------------------------------------------------
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete restrict,
  quantity int not null check (quantity > 0),
  unit_price numeric(12, 2) not null check (unit_price >= 0),
  created_at timestamptz not null default now()
);

create index if not exists idx_order_items_order_id on public.order_items (order_id);
create index if not exists idx_order_items_product_id on public.order_items (product_id);

-- ---------------------------------------------------------------------------
-- RLS: storefront reads via anon key
-- ---------------------------------------------------------------------------
alter table public.categories enable row level security;
alter table public.products enable row level security;

drop policy if exists categories_public_read on public.categories;
create policy categories_public_read
  on public.categories for select
  using (is_active = true);

drop policy if exists products_public_read on public.products;
create policy products_public_read
  on public.products for select
  using (list_status = 'published');

commit;

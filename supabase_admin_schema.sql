-- =============================================================================
-- Admin 后台扩展：在 Supabase Dashboard → SQL → 新建查询 → 粘贴执行
-- 依赖：已存在 public.patterns、public.suppliers 及 public.set_updated_at()
-- 若仅有 supabase_schema.sql：请先执行该文件或确保扩展与函数已创建。
-- =============================================================================

begin;

create extension if not exists "pgcrypto";

-- 若尚未定义 updated_at 触发器函数（与 supabase_schema.sql 一致）
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- 1. 扩展现有表：suppliers
-- ---------------------------------------------------------------------------
alter table public.suppliers add column if not exists logo_url text;
alter table public.suppliers add column if not exists banner_images jsonb not null default '[]'::jsonb;
alter table public.suppliers add column if not exists certifications jsonb not null default '[]'::jsonb;
alter table public.suppliers add column if not exists products jsonb not null default '[]'::jsonb;
alter table public.suppliers add column if not exists verified boolean not null default false;
alter table public.suppliers add column if not exists rating numeric(4, 2)
  check (rating is null or (rating >= 0 and rating <= 5));
alter table public.suppliers add column if not exists review_count int not null default 0 check (review_count >= 0);

create index if not exists idx_suppliers_rating on public.suppliers (rating desc nulls last);

-- ---------------------------------------------------------------------------
-- 1. 扩展现有表：patterns
-- ---------------------------------------------------------------------------
alter table public.patterns add column if not exists seo_title text;
alter table public.patterns add column if not exists seo_description text;
alter table public.patterns add column if not exists seo_keywords text;
alter table public.patterns add column if not exists ai_generated_metadata jsonb not null default '{}'::jsonb;
alter table public.patterns add column if not exists views_count bigint not null default 0 check (views_count >= 0);
alter table public.patterns add column if not exists downloads_count bigint not null default 0 check (downloads_count >= 0);

create index if not exists idx_patterns_views_count on public.patterns (views_count desc);
create index if not exists idx_patterns_downloads_count on public.patterns (downloads_count desc);

-- ---------------------------------------------------------------------------
-- 2. products（商城自营 SKU；类目见 public.categories，迁移见 supabase/migrations/20260418000001_*）
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

drop trigger if exists trg_categories_set_updated_at on public.categories;
create trigger trg_categories_set_updated_at
  before update on public.categories
  for each row
  execute procedure public.set_updated_at();

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category_id uuid references public.categories (id) on delete set null,
  name text not null,
  description text not null default '',
  price_usd numeric(12, 2) check (price_usd is null or price_usd >= 0),
  price_cny numeric(12, 2) check (price_cny is null or price_cny >= 0),
  moq int not null default 1 check (moq >= 0),
  stock int not null default 0 check (stock >= 0),
  sku text not null default '',
  images jsonb not null default '[]'::jsonb,
  specifications jsonb not null default '{}'::jsonb,
  tags jsonb not null default '[]'::jsonb,
  featured boolean not null default false,
  list_status text not null default 'published'
    check (list_status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 兼容旧库：若仍存在 supplier_id / category 文本列，由迁移 20260418000001 负责删除与回填
alter table public.products add column if not exists category_id uuid references public.categories (id) on delete set null;
alter table public.products add column if not exists list_status text not null default 'published';

create index if not exists idx_products_category_id on public.products (category_id);
create index if not exists idx_products_featured on public.products (featured) where featured = true;
create index if not exists idx_products_created_at on public.products (created_at desc);

drop trigger if exists trg_products_set_updated_at on public.products;
create trigger trg_products_set_updated_at
  before update on public.products
  for each row
  execute procedure public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 3. admin_users（先于 admin_logs）
-- ---------------------------------------------------------------------------
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  role text not null
    check (role in ('super_admin', 'content_admin', 'order_admin', 'supplier_admin')),
  last_login timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_admin_users_role on public.admin_users (role);

drop trigger if exists trg_admin_users_set_updated_at on public.admin_users;
create trigger trg_admin_users_set_updated_at
  before update on public.admin_users
  for each row
  execute procedure public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 4. blog_posts（content 为富文本：jsonb，兼容 TipTap/ProseMirror 等 JSON 文档）
-- ---------------------------------------------------------------------------
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  content jsonb not null default '{"type":"doc","content":[]}'::jsonb,
  excerpt text not null default '',
  featured_image_url text,
  seo_title text,
  seo_description text,
  seo_keywords text,
  ai_generated boolean not null default false,
  ai_prompt_used text,
  status text not null default 'draft'
    check (status in ('draft', 'published', 'scheduled')),
  published_at timestamptz,
  views_count bigint not null default 0 check (views_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_blog_posts_status on public.blog_posts (status);
create index if not exists idx_blog_posts_published_at on public.blog_posts (published_at desc nulls last);
create index if not exists idx_blog_posts_created_at on public.blog_posts (created_at desc);

drop trigger if exists trg_blog_posts_set_updated_at on public.blog_posts;
create trigger trg_blog_posts_set_updated_at
  before update on public.blog_posts
  for each row
  execute procedure public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 5. admin_logs
-- ---------------------------------------------------------------------------
create table if not exists public.admin_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references public.admin_users (id) on delete set null,
  action text not null check (action in ('create', 'update', 'delete')),
  table_name text not null,
  record_id uuid,
  changes jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_admin_logs_admin_id on public.admin_logs (admin_id);
create index if not exists idx_admin_logs_table_name on public.admin_logs (table_name);
create index if not exists idx_admin_logs_created_at on public.admin_logs (created_at desc);
create index if not exists idx_admin_logs_record on public.admin_logs (table_name, record_id);

commit;

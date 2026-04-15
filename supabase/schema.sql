-- Run this in Supabase SQL Editor (or as a migration).

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  source text not null default 'home',
  created_at timestamptz not null default now()
);

alter table public.inquiries enable row level security;

-- Allow anonymous inserts from your Next.js API (uses anon key).
-- Adjust if you switch to service role only.
create policy "Allow anon insert inquiries"
  on public.inquiries
  for insert
  to anon
  with check (true);

-- Optional: block public reads (service role / dashboard can still read).
create policy "Deny anon select inquiries"
  on public.inquiries
  for select
  to anon
  using (false);

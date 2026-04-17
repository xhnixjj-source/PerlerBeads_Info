-- Single-row key/value store for admin UI settings (API: GET/PUT /api/admin/settings)
begin;

create table if not exists public.admin_settings (
  id smallint primary key default 1 check (id = 1),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.admin_settings (id, data) values (1, '{}'::jsonb)
on conflict (id) do nothing;

drop trigger if exists trg_admin_settings_set_updated_at on public.admin_settings;
create trigger trg_admin_settings_set_updated_at
  before update on public.admin_settings
  for each row
  execute procedure public.set_updated_at();

commit;

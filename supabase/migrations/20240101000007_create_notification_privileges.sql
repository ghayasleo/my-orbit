-- =========================
-- 1) BASE GRANTS
-- =========================
grant usage on schema public to anon, authenticated, service_role;

-- Table privileges (RLS will still enforce row-level checks)
grant select, insert, update, delete on table
  public.reminders,
  public.loans,
  public.user_push_tokens,
  public.user_notification_settings
to authenticated;

-- Sequences used by identity/serial columns:
grant usage, select on all sequences in schema public to authenticated, anon;

-- Sensible defaults for future objects:
alter default privileges in schema public
  grant select, insert, update, delete on tables to authenticated, anon;
alter default privileges in schema public
  grant usage, select on sequences to authenticated, anon;

alter table public.reminders                   enable row level security;
alter table public.loans                       enable row level security;
alter table public.user_push_tokens            enable row level security;
alter table public.user_notification_settings  enable row level security;

-- ========= 1) BASE GRANTS (schema, tables, sequences) =========
grant usage on schema public to anon, authenticated, service_role;

-- These GRANTs give SQL privileges; RLS still applies afterward.
grant select, insert, update, delete on table public.reminders to authenticated;
grant select, insert, update, delete on table public.loans     to authenticated;
grant select, insert, update, delete on table public.expenses  to authenticated;

-- Sequences used by identity/serial columns:
grant usage, select on all sequences in schema public to authenticated, anon;

-- Make future objects sane by default:
alter default privileges in schema public
  grant select, insert, update, delete on tables   to authenticated, anon;
alter default privileges in schema public
  grant usage, select                on sequences to authenticated, anon;

alter table public.reminders enable row level security;
alter table public.loans     enable row level security;
alter table public.expenses  enable row level security;

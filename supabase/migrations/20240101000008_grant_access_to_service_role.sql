-- schema usage (probably already set)
grant usage on schema public to service_role;

-- table privileges for server code
grant select, insert, update, delete on table
  public.user_push_tokens,
  public.user_notification_settings,
  public.reminders,
  public.loans
to service_role;

-- if these tables use sequences/identity columns:
grant usage, select on all sequences in schema public to service_role;

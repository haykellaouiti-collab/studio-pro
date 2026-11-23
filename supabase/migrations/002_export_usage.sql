create table if not exists public.export_usage (
  user_id uuid not null references auth.users(id) on delete cascade,
  day date not null default (now() at time zone 'utc')::date,
  used integer not null default 0,
  primary key (user_id, day)
);

alter table public.export_usage enable row level security;

create policy "Users can read own export usage"
  on public.export_usage for select
  using (auth.uid() = user_id);

create or replace function public.reserve_export(p_user_id uuid)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_is_creator boolean;
  v_today date := (now() at time zone 'utc')::date;
  v_used integer;
begin
  select exists (
    select 1 from public.subscriptions
    where user_id = p_user_id
      and status in ('active', 'trialing')
      and (current_period_end is null or current_period_end > now())
  ) into v_is_creator;

  if v_is_creator then
    insert into public.export_usage (user_id, day, used)
    values (p_user_id, v_today, 1)
    on conflict (user_id, day) do update set used = public.export_usage.used + 1
    returning used into v_used;

    return jsonb_build_object('allowed', true, 'plan', 'creator', 'used', v_used, 'limit', null);
  end if;

  insert into public.export_usage (user_id, day, used)
  values (p_user_id, v_today, 0)
  on conflict (user_id, day) do nothing;

  update public.export_usage
  set used = used + 1
  where user_id = p_user_id and day = v_today and used < 1
  returning used into v_used;

  if v_used is null then
    return jsonb_build_object('allowed', false, 'plan', 'free', 'used', 1, 'limit', 1);
  end if;

  return jsonb_build_object('allowed', true, 'plan', 'free', 'used', v_used, 'limit', 1);
end;
$$;

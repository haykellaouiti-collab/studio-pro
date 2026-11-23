create table if not exists public.webhook_events (
  webhook_id text primary key,
  type text not null,
  received_at timestamptz not null default now()
);

alter table public.webhook_events enable row level security;

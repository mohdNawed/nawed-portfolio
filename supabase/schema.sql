create extension if not exists pgcrypto;

create table if not exists public.portfolio_messages (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('contact', 'hire')),
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 320),
  message text not null default '',
  project_type text,
  budget text,
  source text not null,
  status text not null default 'new' check (status in ('new', 'read', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists portfolio_messages_created_at_idx
  on public.portfolio_messages (created_at desc);

create index if not exists portfolio_messages_status_idx
  on public.portfolio_messages (status);

alter table public.portfolio_messages enable row level security;

revoke all on table public.portfolio_messages from anon, authenticated;
grant select, insert, update, delete on table public.portfolio_messages to service_role;


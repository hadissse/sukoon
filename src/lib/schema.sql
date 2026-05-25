-- Sukoon database schema

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- Users (extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Charts
create table if not exists public.charts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null default 'natal',
  birth_date date not null,
  birth_time time not null,
  birth_place text not null,
  latitude double precision not null,
  longitude double precision not null,
  timezone text not null,
  chart_json jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Events (log entries)
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  note text,
  mood text,
  energy text,
  tags text[] default '{}',
  placement_key text,
  extra jsonb default '{}'
);

-- Calibrations (user-adjusted planet positions)
create table if not exists public.calibrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  planet text not null,
  degree_offset double precision not null default 0,
  updated_at timestamptz not null default now(),
  unique(user_id, planet)
);

-- Traits (cached trait profile)
create table if not exists public.traits (
  user_id uuid primary key references auth.users(id) on delete cascade,
  profile_json jsonb not null,
  updated_at timestamptz not null default now()
);

-- Journey progress
create table if not exists public.journey_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  journey_id text not null,
  week_start date not null,
  step_index integer not null default 0,
  completed_steps integer[] default '{}',
  journal_entries jsonb default '{}',
  updated_at timestamptz not null default now(),
  unique(user_id, journey_id, week_start)
);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.charts enable row level security;
alter table public.events enable row level security;
alter table public.calibrations enable row level security;
alter table public.traits enable row level security;
alter table public.journey_progress enable row level security;

-- RLS policies: each user can only access their own rows
create policy "profiles: own" on public.profiles for all using (auth.uid() = id);
create policy "charts: own" on public.charts for all using (auth.uid() = user_id);
create policy "events: own" on public.events for all using (auth.uid() = user_id);
create policy "calibrations: own" on public.calibrations for all using (auth.uid() = user_id);
create policy "traits: own" on public.traits for all using (auth.uid() = user_id);
create policy "journey_progress: own" on public.journey_progress for all using (auth.uid() = user_id);

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger charts_updated_at before update on public.charts
  for each row execute function public.set_updated_at();
create trigger calibrations_updated_at before update on public.calibrations
  for each row execute function public.set_updated_at();
create trigger traits_updated_at before update on public.traits
  for each row execute function public.set_updated_at();
create trigger journey_progress_updated_at before update on public.journey_progress
  for each row execute function public.set_updated_at();

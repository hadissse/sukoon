-- Migration: missing tables (quiz_answers, transit_feedback, user_preferences,
-- sukoon_votes, push_subscriptions) + calibrations column fix.
-- Run this once in the Supabase SQL editor.

-- ─── Quiz answers ────────────────────────────────────────────────────────────
create table if not exists public.quiz_answers (
  user_id uuid primary key references auth.users(id) on delete cascade,
  answers  jsonb not null default '{}',
  updated_at timestamptz not null default now()
);
alter table public.quiz_answers enable row level security;
create policy "quiz_answers: own" on public.quiz_answers
  for all using (auth.uid() = user_id);

-- ─── Transit feedback ────────────────────────────────────────────────────────
create table if not exists public.transit_feedback (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  transit_id    text not null,
  transit_type  text not null,
  rating        integer,
  reflection    text,
  created_at    timestamptz not null default now(),
  unique(user_id, transit_id)
);
alter table public.transit_feedback enable row level security;
create policy "transit_feedback: own" on public.transit_feedback
  for all using (auth.uid() = user_id);

-- ─── User preferences ────────────────────────────────────────────────────────
create table if not exists public.user_preferences (
  user_id             uuid primary key references auth.users(id) on delete cascade,
  notifications_json  jsonb not null default '{}',
  ui_flags            jsonb not null default '{}',
  updated_at          timestamptz not null default now()
);
alter table public.user_preferences enable row level security;
create policy "user_preferences: own" on public.user_preferences
  for all using (auth.uid() = user_id);

-- ─── Votes ───────────────────────────────────────────────────────────────────
create table if not exists public.sukoon_votes (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  card_id         text not null,
  vote            text not null,
  note            text,
  transit_planet  text,
  natal_planet    text,
  created_at      timestamptz not null default now()
);
alter table public.sukoon_votes enable row level security;
create policy "sukoon_votes: own" on public.sukoon_votes
  for all using (auth.uid() = user_id);

-- ─── Calibrations: add cal_type + cal_key columns if missing ─────────────────
alter table public.calibrations
  add column if not exists cal_type text not null default 'planet',
  add column if not exists cal_key  text not null default '';

-- The old unique constraint is on (user_id, planet). We need (user_id, cal_type, cal_key).
-- Drop the old one if it exists and add the new one.
do $$
begin
  if exists (
    select 1 from pg_constraint
    where conname = 'calibrations_user_id_planet_key'
  ) then
    alter table public.calibrations drop constraint calibrations_user_id_planet_key;
  end if;
end $$;
alter table public.calibrations
  drop constraint if exists calibrations_user_id_cal_type_cal_key_key;
alter table public.calibrations
  add constraint calibrations_user_id_cal_type_cal_key_key unique (user_id, cal_type, cal_key);

-- ─── Push subscriptions ──────────────────────────────────────────────────────
create table if not exists public.push_subscriptions (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users(id) on delete cascade,
  endpoint            text not null unique,
  p256dh              text not null,
  auth                text not null,
  preferred_hour_utc  integer not null default 8, -- 0-23
  enabled             boolean not null default true,
  last_sent           date,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
alter table public.push_subscriptions enable row level security;
create policy "push_subscriptions: own" on public.push_subscriptions
  for all using (auth.uid() = user_id);

-- Auto-update updated_at triggers for new tables
create trigger user_preferences_updated_at before update on public.user_preferences
  for each row execute function public.set_updated_at();
create trigger push_subscriptions_updated_at before update on public.push_subscriptions
  for each row execute function public.set_updated_at();

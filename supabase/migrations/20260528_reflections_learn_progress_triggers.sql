-- Migration: reflections table, learn_progress table, missing updated_at triggers.

-- ─── Reflections ─────────────────────────────────────────────────────────────
create table if not exists public.reflections (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  prompt      text,
  body        text not null,
  mood        text,
  tags        text[] default '{}',
  source      text,  -- e.g. 'transit', 'journey', 'free'
  source_id   text,  -- transit slug / journey step id / null
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
alter table public.reflections enable row level security;
create policy "reflections: own" on public.reflections
  for all using (auth.uid() = user_id);
create index if not exists reflections_user_id_created_at
  on public.reflections (user_id, created_at desc);
create trigger reflections_updated_at before update on public.reflections
  for each row execute function public.set_updated_at();

-- ─── Learn progress ──────────────────────────────────────────────────────────
create table if not exists public.learn_progress (
  user_id       uuid not null references auth.users(id) on delete cascade,
  lesson_id     text not null,
  completed_at  timestamptz not null default now(),
  primary key (user_id, lesson_id)
);
alter table public.learn_progress enable row level security;
create policy "learn_progress: own" on public.learn_progress
  for all using (auth.uid() = user_id);

-- ─── Push subscriptions ───────────────────────────────────────────────────────
create table if not exists public.push_subscriptions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  endpoint    text not null unique,
  p256dh      text not null,
  auth        text not null,
  created_at  timestamptz not null default now()
);
alter table public.push_subscriptions enable row level security;
create policy "push_subscriptions: own" on public.push_subscriptions
  for all using (auth.uid() = user_id);

-- ─── Missing updated_at triggers ─────────────────────────────────────────────
-- quiz_answers already has the column; just needs the trigger
create trigger if not exists quiz_answers_updated_at before update on public.quiz_answers
  for each row execute function public.set_updated_at();

-- transit_feedback: add updated_at column then trigger
alter table public.transit_feedback
  add column if not exists updated_at timestamptz not null default now();
create trigger if not exists transit_feedback_updated_at before update on public.transit_feedback
  for each row execute function public.set_updated_at();

-- sukoon_votes: add updated_at column then trigger
alter table public.sukoon_votes
  add column if not exists updated_at timestamptz not null default now();
create trigger if not exists sukoon_votes_updated_at before update on public.sukoon_votes
  for each row execute function public.set_updated_at();

-- Session 5: persistence for watches and signal cards.
--
-- Run this once via the Supabase Dashboard SQL editor, or `supabase db push`
-- if the project is linked to the Supabase CLI. Nothing in this build could
-- run this for you — the sandbox that wrote it has no network access to
-- your Supabase project. See SESSION_REPORT.md, Session 5.
--
-- source_trail is stored as jsonb (an array of SourceTrailEntry objects,
-- matching packages/types/src/signals.ts) rather than a third normalized
-- table. Deliberate: it's never queried or filtered independently of its
-- parent card, just displayed — normalizing it would add a join for no
-- real benefit.

create table if not exists public.watches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null,
  thesis_question text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.signal_cards (
  id uuid primary key default gen_random_uuid(),
  watch_id uuid not null references public.watches(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  headline text not null,
  gap_summary text not null,
  confidence text not null check (confidence in ('low', 'medium', 'high')),
  source_trail jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists watches_user_id_idx on public.watches (user_id, created_at desc);
create index if not exists signal_cards_watch_id_idx on public.signal_cards (watch_id, created_at asc);

alter table public.watches enable row level security;
alter table public.signal_cards enable row level security;

-- user_id is stored directly on signal_cards (denormalized from watches)
-- specifically so this policy doesn't need a join to watches to enforce
-- ownership — one row, one check.
create policy "Users can view their own watches"
  on public.watches for select
  using (auth.uid() = user_id);

create policy "Users can insert their own watches"
  on public.watches for insert
  with check (auth.uid() = user_id);

create policy "Users can view their own signal cards"
  on public.signal_cards for select
  using (auth.uid() = user_id);

create policy "Users can insert their own signal cards"
  on public.signal_cards for insert
  with check (auth.uid() = user_id);

-- No update/delete policies yet — nothing in the product edits or removes
-- a watch or signal card once created. Add those deliberately if a future
-- session adds that capability; don't assume they're covered by the above.

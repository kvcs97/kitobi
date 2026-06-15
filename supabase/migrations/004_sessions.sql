create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  type text not null check (type in ('flashcard', 'word', 'quiz')),
  modul text not null,
  perfekt int2 not null default 0,
  gut int2 not null default 0,
  wieder int2 not null default 0,
  duration_sec int4
);

alter table public.sessions enable row level security;

create policy "Users can view own sessions" on public.sessions
  for select using (user_id = auth.uid());

create policy "Users can insert own sessions" on public.sessions
  for insert with check (user_id = auth.uid());

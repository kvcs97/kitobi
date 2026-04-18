-- ============================================================
-- Migration 002: subjects
-- ============================================================

create table public.subjects (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  name       text not null,
  color      text not null default '#C084FC',
  exam_date  date,
  created_at timestamptz not null default now()
);

alter table public.subjects enable row level security;

create policy "Users can manage own subjects"
  on public.subjects for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

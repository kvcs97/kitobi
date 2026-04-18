-- ============================================================
-- Migration 006: study_logs
-- ============================================================

create table public.study_logs (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  subject_id     uuid references public.subjects(id) on delete set null,
  date           date not null default current_date,
  duration_min   integer,
  cards_reviewed integer,
  created_at     timestamptz not null default now()
);

alter table public.study_logs enable row level security;

create policy "Users can manage own study logs"
  on public.study_logs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- Migration 005: quiz_sessions + quiz_questions
-- ============================================================

create table public.quiz_sessions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  subject_id   uuid references public.subjects(id) on delete set null,
  score        integer,
  total        integer,
  completed_at timestamptz,
  created_at   timestamptz not null default now()
);

alter table public.quiz_sessions enable row level security;

create policy "Users can manage own quiz sessions"
  on public.quiz_sessions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create table public.quiz_questions (
  id             uuid primary key default gen_random_uuid(),
  session_id     uuid not null references public.quiz_sessions(id) on delete cascade,
  question       text not null,
  type           text not null default 'multiple_choice',
  correct_answer text not null,
  user_answer    text,
  options        jsonb,
  is_correct     boolean,
  created_at     timestamptz not null default now()
);

alter table public.quiz_questions enable row level security;

create policy "Users can manage own quiz questions"
  on public.quiz_questions for all
  using (
    exists (
      select 1 from public.quiz_sessions s
      where s.id = session_id and s.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.quiz_sessions s
      where s.id = session_id and s.user_id = auth.uid()
    )
  );

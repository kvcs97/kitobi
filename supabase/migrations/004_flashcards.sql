-- ============================================================
-- Migration 004: flashcard_decks + flashcards
-- ============================================================

create table public.flashcard_decks (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  subject_id uuid references public.subjects(id) on delete set null,
  note_id    uuid references public.notes(id) on delete set null,
  name       text not null,
  created_at timestamptz not null default now()
);

alter table public.flashcard_decks enable row level security;

create policy "Users can manage own decks"
  on public.flashcard_decks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- FSRS fields: stability, difficulty, due, state, reps, lapses
create table public.flashcards (
  id          uuid primary key default gen_random_uuid(),
  deck_id     uuid not null references public.flashcard_decks(id) on delete cascade,
  front       text not null,
  back        text not null,
  stability   double precision not null default 0,
  difficulty  double precision not null default 0,
  due_date    timestamptz not null default now(),
  state       integer not null default 0,
  reps        integer not null default 0,
  lapses      integer not null default 0,
  last_review timestamptz,
  created_at  timestamptz not null default now()
);

alter table public.flashcards enable row level security;

create policy "Users can manage own flashcards"
  on public.flashcards for all
  using (
    exists (
      select 1 from public.flashcard_decks d
      where d.id = deck_id and d.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.flashcard_decks d
      where d.id = deck_id and d.user_id = auth.uid()
    )
  );

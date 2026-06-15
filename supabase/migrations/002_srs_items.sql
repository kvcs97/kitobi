create table public.srs_items (
  item_id text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  type text not null check (type in ('character', 'word')),
  ease numeric(4,2) not null default 2.5,
  interval int2 not null default 0,
  reps int2 not null default 0,
  lapses int2 not null default 0,
  due date not null default current_date,
  last_review date,
  primary key (item_id, user_id)
);

alter table public.srs_items enable row level security;

create policy "Users can view own srs items" on public.srs_items
  for select using (user_id = auth.uid());

create policy "Users can insert own srs items" on public.srs_items
  for insert with check (user_id = auth.uid());

create policy "Users can update own srs items" on public.srs_items
  for update using (user_id = auth.uid());

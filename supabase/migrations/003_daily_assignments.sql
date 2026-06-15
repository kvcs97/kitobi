create table public.daily_assignments (
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  word_ids text[] not null,
  completed_ids text[] not null default '{}',
  primary key (user_id, date)
);

alter table public.daily_assignments enable row level security;

create policy "Users can view own daily assignments" on public.daily_assignments
  for select using (user_id = auth.uid());

create policy "Users can insert own daily assignments" on public.daily_assignments
  for insert with check (user_id = auth.uid());

create policy "Users can update own daily assignments" on public.daily_assignments
  for update using (user_id = auth.uid());

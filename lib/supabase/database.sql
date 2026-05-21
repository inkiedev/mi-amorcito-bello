-- Mi Amorcito Bello - Supabase bootstrap
-- Run this whole file in Supabase SQL Editor for a fresh project.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  role text not null check (role in ('him', 'her')),
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.romantic_memories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  date date not null,
  type text not null check (type in ('photo', 'quote', 'memory', 'special-day', 'moment')),
  content text not null,
  image_url text,
  tags text[] default array[]::text[],
  is_favorite boolean default false,
  created_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.special_days (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date date not null,
  description text not null,
  is_recurring boolean default false,
  category text not null check (category in ('anniversary', 'first-time', 'milestone', 'celebration')),
  created_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  author text,
  date date not null,
  context text,
  is_favorite boolean default false,
  created_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.joint_finance_entries (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  amount numeric(12, 2) not null check (amount > 0),
  type text not null check (type in ('income', 'expense')),
  category text not null,
  entry_date date not null,
  created_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.romantic_memories enable row level security;
alter table public.special_days enable row level security;
alter table public.quotes enable row level security;
alter table public.joint_finance_entries enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Authenticated users can view all memories" on public.romantic_memories;
create policy "Authenticated users can view all memories"
  on public.romantic_memories for select to authenticated
  using (true);

drop policy if exists "Users can insert their own memories" on public.romantic_memories;
create policy "Users can insert their own memories"
  on public.romantic_memories for insert to authenticated
  with check (auth.uid() = created_by);

drop policy if exists "Users can update their own memories" on public.romantic_memories;
drop policy if exists "Authenticated users can update all memories" on public.romantic_memories;
create policy "Authenticated users can update all memories"
  on public.romantic_memories for update to authenticated
  using (true)
  with check (true);

drop policy if exists "Users can delete their own memories" on public.romantic_memories;
drop policy if exists "Authenticated users can delete all memories" on public.romantic_memories;
create policy "Authenticated users can delete all memories"
  on public.romantic_memories for delete to authenticated
  using (true);

drop policy if exists "Authenticated users can view all special days" on public.special_days;
create policy "Authenticated users can view all special days"
  on public.special_days for select to authenticated
  using (true);

drop policy if exists "Users can insert their own special days" on public.special_days;
create policy "Users can insert their own special days"
  on public.special_days for insert to authenticated
  with check (auth.uid() = created_by);

drop policy if exists "Users can update their own special days" on public.special_days;
drop policy if exists "Authenticated users can update all special days" on public.special_days;
create policy "Authenticated users can update all special days"
  on public.special_days for update to authenticated
  using (true)
  with check (true);

drop policy if exists "Users can delete their own special days" on public.special_days;
drop policy if exists "Authenticated users can delete all special days" on public.special_days;
create policy "Authenticated users can delete all special days"
  on public.special_days for delete to authenticated
  using (true);

drop policy if exists "Authenticated users can view all quotes" on public.quotes;
create policy "Authenticated users can view all quotes"
  on public.quotes for select to authenticated
  using (true);

drop policy if exists "Users can insert their own quotes" on public.quotes;
create policy "Users can insert their own quotes"
  on public.quotes for insert to authenticated
  with check (auth.uid() = created_by);

drop policy if exists "Users can update their own quotes" on public.quotes;
drop policy if exists "Authenticated users can update all quotes" on public.quotes;
create policy "Authenticated users can update all quotes"
  on public.quotes for update to authenticated
  using (true)
  with check (true);

drop policy if exists "Users can delete their own quotes" on public.quotes;
drop policy if exists "Authenticated users can delete all quotes" on public.quotes;
create policy "Authenticated users can delete all quotes"
  on public.quotes for delete to authenticated
  using (true);

drop policy if exists "Authenticated users can view all finance entries" on public.joint_finance_entries;
create policy "Authenticated users can view all finance entries"
  on public.joint_finance_entries for select to authenticated
  using (true);

drop policy if exists "Users can insert finance entries" on public.joint_finance_entries;
create policy "Users can insert finance entries"
  on public.joint_finance_entries for insert to authenticated
  with check (auth.uid() = created_by);

drop policy if exists "Authenticated users can update all finance entries" on public.joint_finance_entries;
create policy "Authenticated users can update all finance entries"
  on public.joint_finance_entries for update to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated users can delete all finance entries" on public.joint_finance_entries;
create policy "Authenticated users can delete all finance entries"
  on public.joint_finance_entries for delete to authenticated
  using (true);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, role, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'Usuario'),
    coalesce(new.raw_user_meta_data->>'role', 'him'),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do update set
    name = excluded.name,
    role = excluded.role,
    avatar_url = excluded.avatar_url,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

insert into public.profiles (id, name, role, avatar_url)
select
  users.id,
  coalesce(users.raw_user_meta_data->>'name', split_part(users.email, '@', 1), 'Usuario'),
  case
    when users.raw_user_meta_data->>'role' in ('him', 'her')
      then users.raw_user_meta_data->>'role'
    else 'him'
  end,
  users.raw_user_meta_data->>'avatar_url'
from auth.users
on conflict (id) do nothing;

create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists update_profiles_updated_at on public.profiles;
create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at_column();

drop trigger if exists update_romantic_memories_updated_at on public.romantic_memories;
create trigger update_romantic_memories_updated_at
  before update on public.romantic_memories
  for each row execute function public.update_updated_at_column();

drop trigger if exists update_special_days_updated_at on public.special_days;
create trigger update_special_days_updated_at
  before update on public.special_days
  for each row execute function public.update_updated_at_column();

drop trigger if exists update_quotes_updated_at on public.quotes;
create trigger update_quotes_updated_at
  before update on public.quotes
  for each row execute function public.update_updated_at_column();

drop trigger if exists update_joint_finance_entries_updated_at on public.joint_finance_entries;
create trigger update_joint_finance_entries_updated_at
  before update on public.joint_finance_entries
  for each row execute function public.update_updated_at_column();

create index if not exists romantic_memories_date_idx on public.romantic_memories(date desc);
create index if not exists romantic_memories_type_idx on public.romantic_memories(type);
create index if not exists special_days_date_idx on public.special_days(date);
create index if not exists quotes_date_idx on public.quotes(date desc);
create index if not exists joint_finance_entries_entry_date_idx on public.joint_finance_entries(entry_date desc);
create index if not exists joint_finance_entries_type_idx on public.joint_finance_entries(type);

insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do update set public = true;

drop policy if exists "Authenticated users can view photos" on storage.objects;
create policy "Authenticated users can view photos"
  on storage.objects for select to authenticated
  using (bucket_id = 'photos');

drop policy if exists "Users can upload photos to own folder" on storage.objects;
create policy "Users can upload photos to own folder"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "Users can update own photos" on storage.objects;
drop policy if exists "Authenticated users can update shared photos" on storage.objects;
create policy "Authenticated users can update shared photos"
  on storage.objects for update to authenticated
  using (bucket_id = 'photos')
  with check (bucket_id = 'photos');

drop policy if exists "Users can delete own photos" on storage.objects;
drop policy if exists "Authenticated users can delete shared photos" on storage.objects;
create policy "Authenticated users can delete shared photos"
  on storage.objects for delete to authenticated
  using (bucket_id = 'photos');

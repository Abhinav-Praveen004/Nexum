-- Create tables

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  is_editor boolean not null default true,
  created_at timestamptz not null default now()
);

create table articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  author text not null,
  pdp_day int not null check (pdp_day between 1 and 4),
  description text not null,
  content text,
  cover_image_url text,
  document_url text,
  status text not null default 'draft' check (status in ('draft','published')),
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create table podcast_episodes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  episode_number int not null,
  recording_date date not null,
  description text not null,
  audio_url text,
  transcript text,
  status text not null default 'draft' check (status in ('draft','published')),
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table timeline_entries (
  id uuid primary key default gen_random_uuid(),
  day_number int not null check (day_number between 1 and 4),
  title text not null,
  description text,
  milestone boolean not null default false,
  media_url text,
  caption text,
  status text not null default 'upcoming' check (status in ('upcoming','completed')),
  entry_order int not null default 0,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table appreciation_messages (
  id uuid primary key default gen_random_uuid(),
  recipient_name text not null,
  message text not null,
  sender_name text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  moderated_by uuid references auth.users(id),
  moderated_at timestamptz,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table profiles enable row level security;
alter table articles enable row level security;
alter table podcast_episodes enable row level security;
alter table timeline_entries enable row level security;
alter table appreciation_messages enable row level security;

-- Profiles RLS
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

-- Articles RLS
create policy "Public can view published articles" on articles
  for select using (status = 'published');

create policy "Auth users can manage articles" on articles
  for all to authenticated using (true) with check (true);

-- Podcast Episodes RLS
create policy "Public can view published podcasts" on podcast_episodes
  for select using (status = 'published');

create policy "Auth users can manage podcasts" on podcast_episodes
  for all to authenticated using (true) with check (true);

-- Timeline Entries RLS
create policy "Public can view timeline entries" on timeline_entries
  for select using (true);

create policy "Auth users can manage timeline entries" on timeline_entries
  for all to authenticated using (true) with check (true);

-- Appreciation Messages RLS
create policy "Public can insert appreciation messages" on appreciation_messages
  for insert with check (status = 'pending');

create policy "Public can view approved appreciation messages" on appreciation_messages
  for select using (status = 'approved');

create policy "Auth users can manage appreciation messages" on appreciation_messages
  for all to authenticated using (true) with check (true);

-- Storage Buckets
insert into storage.buckets (id, name, public) values 
  ('journal-media', 'journal-media', true),
  ('podcast-audio', 'podcast-audio', true),
  ('timeline-media', 'timeline-media', true),
  ('team-photos', 'team-photos', true)
on conflict (id) do nothing;

-- Storage RLS
create policy "Public Access" on storage.objects for select using (true);

create policy "Auth users can upload" on storage.objects for insert to authenticated with check (true);
create policy "Auth users can update" on storage.objects for update to authenticated using (true);
create policy "Auth users can delete" on storage.objects for delete to authenticated using (true);

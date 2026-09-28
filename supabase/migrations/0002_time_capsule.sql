-- Create timeline_days table
create table timeline_days (
  day_number int primary key check (day_number between 1 and 4),
  title text,
  day_date date,
  summary text,
  updated_at timestamptz default now()
);

-- Seed timeline_days with empty rows
insert into timeline_days (day_number) values (1), (2), (3), (4) on conflict do nothing;

-- Enable RLS on timeline_days
alter table timeline_days enable row level security;
create policy "Public can view timeline_days" on timeline_days for select using (true);
create policy "Auth users can update timeline_days" on timeline_days for update to authenticated using (true);

-- Alter timeline_entries table
alter table timeline_entries add column entry_type text not null default 'activity' check (entry_type in ('activity', 'milestone', 'reflection'));
alter table timeline_entries add column reflection_author text;
alter table timeline_entries add column confirmed_at timestamptz;
alter table timeline_entries add column confirmed_by uuid references auth.users(id);

-- Backfill entry_type for existing milestones
update timeline_entries set entry_type = 'milestone' where milestone = true;

-- Drop milestone column
alter table timeline_entries drop column milestone;

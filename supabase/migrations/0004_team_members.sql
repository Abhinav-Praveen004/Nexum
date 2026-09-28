create table team_members (
  slug text primary key,
  name text not null,
  role text not null,
  qualification text not null,
  bio text not null,
  photo_url text,
  tags text[] not null default '{}',
  pdp_journey text,
  reflections text,
  sort_order int not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

-- Constraints
alter table team_members 
  add constraint team_members_bio_len check (char_length(bio) <= 2000),
  add constraint team_members_pdp_journey_len check (pdp_journey is null or char_length(pdp_journey) <= 3000),
  add constraint team_members_reflections_len check (reflections is null or char_length(reflections) <= 3000),
  add constraint team_members_tags_count check (array_length(tags, 1) is null or array_length(tags, 1) <= 12);

-- Function to validate each tag length
create or replace function check_team_tags_length(tags text[]) returns boolean as $$
declare
  tag text;
begin
  if tags is null then return true; end if;
  foreach tag in array tags loop
    if char_length(tag) > 30 then return false; end if;
  end loop;
  return true;
end;
$$ language plpgsql immutable;

alter table team_members add constraint team_members_tag_len check (check_team_tags_length(tags));

-- Enable RLS
alter table team_members enable row level security;
create policy "Public can view team members" on team_members for select using (true);
create policy "Auth users can update team members" on team_members for update to authenticated using (true);
-- No insert/delete policies since the roster is fixed

-- Seed data
insert into team_members (slug, name, role, qualification, bio, tags, sort_order) values
('janhavi-j', 'Janhavi J', 'Team Captain', 'BSc Psychology', 'An ambitious and versatile MBA student who combines analytical thinking, people-oriented insight, and creative problem-solving. Brings communication, leadership, decision-making, and persuasion skills, along with the ability to adapt to different roles and challenges. Actively involved in extracurricular activities and career counselling initiatives. Interested in understanding people, connecting ideas, and bridging human behaviour with business thinking.', array['analytical thinking', 'creative problem-solving', 'communication', 'leadership', 'decision-making', 'persuasion', 'extracurricular activities', 'career counselling'], 1),
('rubikaa-v', 'Rubikaa V', 'Vice-Captain', 'BCom (Business Analytics)', 'An MBA student with a strong interest in entrepreneurship, business development, and the fashion industry. Creative, adaptable, and goal-oriented, with an ambition to build her own clothing brand. Interested in learning new skills, taking on challenges, and continuously developing her communication, leadership, and business abilities.', array['entrepreneurship', 'business development', 'fashion industry', 'communication', 'leadership', 'business abilities'], 2),
('rithvika-k', 'Rithvika K', 'Team Member', 'BBA', 'A motivated and enthusiastic MBA student interested in management, teamwork, leadership, and business strategies. Hardworking, responsible, and willing to learn. Enjoys interacting with people, participating in team activities, and improving communication and professional skills. Aims to build confidence and develop a successful career in management.', array['management', 'teamwork', 'leadership', 'business strategies', 'communication', 'professional skills'], 3),
('unni-mia-roy', 'Unni Mia Roy', 'Team Member', 'BCom, MA History', 'Born in Uttar Pradesh into a Kerala family and raised in Chennai and Coimbatore, Unni Mia brings a cross-cultural perspective shaped by her upbringing. Social and focused on self-improvement, she enjoys reading, fishkeeping, and upcycling. She values balancing studies, fitness, and extracurricular interests, and brings communication, research, and analytical skills.', array['reading', 'fishkeeping', 'upcycling', 'fitness', 'communication', 'research', 'analytical skills'], 4),
('dhanvi-a', 'Dhanvi A', 'Team Member', 'BCom (Accounting & Finance)', 'Experienced in working with teams through volunteering in a healthcare club and later serving as its president. Also participated in the Students Forum''s leadership structure and gained experience leading and conducting college events. Her experience reflects involvement in student leadership, teamwork, and event coordination.', array['leadership', 'teamwork', 'event coordination'], 5),
('dharani-s', 'Dharani S', 'Team Member', 'BCom (Professional Accounting)', 'An MBA student at GRG School of Management Studies with a strong interest in business, leadership, and continuous learning. Calm, adaptable, and responsible, with a belief in observing, learning, and growing through experience. Curious about new ideas and motivated to build meaningful business skills. Aspires to expand her family business and become a confident, capable, forward-thinking professional.', array['business', 'leadership', 'continuous learning', 'business skills'], 6),
('chahana-l', 'Chahana L', 'Team Member', 'BCom', 'An MBA student with an undergraduate foundation in accounting, business fundamentals, and economics. Focused on developing management, analytical, and leadership skills. Eager to learn, adapt, and take on real-world business challenges. Interested in applying her commerce background and management training across areas such as finance, marketing, operations, or strategy.', array['accounting', 'business fundamentals', 'economics', 'management', 'analytical skills', 'leadership', 'finance', 'marketing', 'operations', 'strategy'], 7),
('sandhiya-gs-nayer', 'Sandhiya GS Nayer', 'Team Member', 'BCom (Financial Service)', 'A calm and introverted MBA student who becomes more open and friendly as she gets comfortable with people. Interested in learning, personal and professional development, editing, driving, and creative and aesthetic activities. Values using time productively, developing useful skills, and building a career.', array['learning', 'personal development', 'professional development', 'editing', 'driving', 'creative activities', 'aesthetic activities'], 8);

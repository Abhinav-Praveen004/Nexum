-- Add length constraints if they don't exist
do $$
begin
  alter table appreciation_messages 
    add constraint appreciation_recipient_len check (char_length(trim(recipient_name)) between 1 and 80),
    add constraint appreciation_message_len check (char_length(trim(message)) between 10 and 600),
    add constraint appreciation_sender_len check (sender_name is null or char_length(trim(sender_name)) <= 80);
exception
  when duplicate_object then null;
end $$;

-- Create function to force pending status on anon inserts
create or replace function force_pending_appreciation()
returns trigger
language plpgsql
security definer
as $$
begin
  -- Only override if the user is not authenticated (anon)
  if auth.role() = 'anon' then
    NEW.status := 'pending';
    NEW.moderated_by := null;
    NEW.moderated_at := null;
  end if;
  return NEW;
end;
$$;

-- Create the trigger
drop trigger if exists ensure_pending_appreciation on appreciation_messages;
create trigger ensure_pending_appreciation
  before insert on appreciation_messages
  for each row
  execute function force_pending_appreciation();

-- Ensure RLS is enabled and policies are strict
-- The existing policy for anon insert is:
-- create policy "Public can insert appreciation messages" on appreciation_messages for insert with check (status = 'pending');
-- This already rejects anon inserts if status != 'pending', and our trigger guarantees NEW.status = 'pending'.

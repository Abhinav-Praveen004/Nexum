const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testSecurity() {
  console.log('Testing anon key access...');
  
  // 1. Articles
  console.log('\n--- Articles ---');
  let res = await supabase.from('articles').select('title, status');
  console.log('Select articles (should only see published):', res.data?.length > 0 ? 'Success' : 'Empty/Denied', res.error?.message || '');
  
  res = await supabase.from('articles').insert([{ title: 'Hack', slug: 'hack', author: 'hacker', pdp_day: 1, description: 'hack' }]);
  console.log('Insert article:', res.error?.message || 'Success (WARNING: SHOULD FAIL)');
  
  // 2. Podcast Episodes
  console.log('\n--- Podcast Episodes ---');
  res = await supabase.from('podcast_episodes').select('title, status');
  console.log('Select podcasts (should only see published):', res.data?.length > 0 ? 'Success' : 'Empty/Denied', res.error?.message || '');
  
  res = await supabase.from('podcast_episodes').insert([{ title: 'Hack', episode_number: 99, recording_date: '2023-01-01', description: 'hack' }]);
  console.log('Insert podcast:', res.error?.message || 'Success (WARNING: SHOULD FAIL)');
  
  // 3. Timeline Entries
  console.log('\n--- Timeline Entries ---');
  res = await supabase.from('timeline_entries').select('title');
  console.log('Select timeline entries (should see all):', res.data?.length > 0 ? 'Success' : 'Empty/Denied', res.error?.message || '');
  
  res = await supabase.from('timeline_entries').insert([{ day_number: 1, title: 'Hack' }]);
  console.log('Insert timeline entry:', res.error?.message || 'Success (WARNING: SHOULD FAIL)');
  
  // 4. Appreciation Messages
  console.log('\n--- Appreciation Messages ---');
  res = await supabase.from('appreciation_messages').select('message, status');
  console.log('Select appreciation messages (should only see approved):', res.data?.length > 0 ? 'Success' : 'Empty/Denied', res.error?.message || '');
  
  res = await supabase.from('appreciation_messages').insert([{ recipient_name: 'Test', message: 'This is a test message to ensure trigger works' }]).select('status');
  console.log('Insert appreciation message:', res.error ? res.error.message : `Success. Status is: ${res.data[0].status}`);
  
  // 5. Team Members
  console.log('\n--- Team Members ---');
  res = await supabase.from('team_members').select('slug');
  console.log('Select team members (should see all):', res.data?.length > 0 ? 'Success' : 'Empty/Denied', res.error?.message || '');
  
  res = await supabase.from('team_members').update({ bio: 'hacked' }).eq('slug', 'janhavi-j');
  const verify = await supabase.from('team_members').select('bio').eq('slug', 'janhavi-j').single();
  console.log('Update team member bio:', verify.data?.bio === 'hacked' ? 'Success (WARNING: SHOULD FAIL)' : 'Failed (RLS Worked)');
}

testSecurity();

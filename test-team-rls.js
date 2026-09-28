const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

const envData = fs.readFileSync('.env.local', 'utf8')
const NEXT_PUBLIC_SUPABASE_URL = envData.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1]
const NEXT_PUBLIC_SUPABASE_ANON_KEY = envData.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)[1]

const supabase = createClient(
  NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function testTeamRLS() {
  console.log('Testing RLS for Team Profiles...')
  
  // Test: Try to update a member as anon
  const { data, error } = await supabase
    .from('team_members')
    .update({ bio: 'Hacked by anon' })
    .eq('slug', 'janhavi-j')
    
  console.log('Anon Update Result Data (should be null or empty):', data)
  console.log('Anon Update Error (should be an error or silently fail based on Postgres RLS):', error ? error.message : 'Silently rejected (0 rows updated if no return data)')
  
  // Test Read to ensure it didn't change
  const { data: readData } = await supabase.from('team_members').select('bio').eq('slug', 'janhavi-j').single()
  console.log('Bio in DB after attack:', readData ? (readData.bio === 'Hacked by anon' ? 'FAILED - RLS BYPASSED' : 'SAFE - Bio remains intact') : 'Not found')
}

testTeamRLS()

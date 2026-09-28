const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const envData = fs.readFileSync('.env.local', 'utf8')
const NEXT_PUBLIC_SUPABASE_URL = envData.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1]
const NEXT_PUBLIC_SUPABASE_ANON_KEY = envData.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)[1]

const supabase = createClient(
  NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function testRLS() {
  console.log('Testing RLS for Appreciation Wall...')
  
  // Test 1: Insert with status = 'approved'
  const { data: insertData, error: insertError } = await supabase
    .from('appreciation_messages')
    .insert({
      recipient_name: 'Test RLS User',
      message: 'This is a test message that should be forced to pending.',
      status: 'approved' // Trying to sneak in an approved status
    })
    
  console.log('Insert Error (should be null):', insertError ? insertError.message : 'null')
  
  // Test 2: Try to read pending/rejected rows as anon
  const { data: readData, error: readError } = await supabase
    .from('appreciation_messages')
    .select('*')
    .eq('recipient_name', 'Test RLS User')
    
  console.log('Anon Read Result Count (should be 0 because it was forced to pending):', readData ? readData.length : 0)
  
  if (readError) console.error('Read error:', readError)
}

testRLS()

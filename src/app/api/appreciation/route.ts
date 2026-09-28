import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Initialize a standard supabase client for anon inserts (no SSR needed here, we just use Anon key)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// In-memory rate limiting (best-effort on serverless)
const ipMap = new Map<string, { count: number, resetAt: number }>()
const RATE_LIMIT_COUNT = 3
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000 // 1 hour

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown-ip'
    
    // Rate limit check
    const now = Date.now()
    const rateData = ipMap.get(ip)
    if (rateData) {
      if (now > rateData.resetAt) {
        ipMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
      } else {
        if (rateData.count >= RATE_LIMIT_COUNT) {
          return NextResponse.json({ error: 'Too many submissions. Please try again later.' }, { status: 429 })
        }
        rateData.count += 1
      }
    } else {
      ipMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    }

    const body = await req.json()
    const { recipient_name, message, sender_name, honeypot, startTime } = body

    // 1. Spam protection checks
    if (honeypot) {
      // Silently accept bots filling the honeypot
      return NextResponse.json({ success: true })
    }
    
    if (!startTime || (now - startTime < 3000)) {
      return NextResponse.json({ error: 'Form submitted too quickly.' }, { status: 400 })
    }

    // 2. Data validation
    const trimmedRecipient = recipient_name?.trim() || ''
    const trimmedMessage = message?.trim() || ''
    const trimmedSender = sender_name?.trim() || ''

    if (trimmedRecipient.length < 1 || trimmedRecipient.length > 80) {
      return NextResponse.json({ error: 'Recipient name must be between 1 and 80 characters.' }, { status: 400 })
    }
    if (trimmedMessage.length < 10 || trimmedMessage.length > 600) {
      return NextResponse.json({ error: 'Message must be between 10 and 600 characters.' }, { status: 400 })
    }
    if (trimmedSender.length > 80) {
      return NextResponse.json({ error: 'Sender name is too long.' }, { status: 400 })
    }

    // 3. Insert using anon client without .select()
    const { error: insertError } = await supabase
      .from('appreciation_messages')
      .insert({
        recipient_name: trimmedRecipient,
        message: trimmedMessage,
        sender_name: trimmedSender.length > 0 ? trimmedSender : null,
      })
      // CRITICAL: We cannot chain .select() because RLS prevents anon from reading pending rows

    if (insertError) {
      console.error("DB Insert Error:", insertError)
      return NextResponse.json({ error: 'Failed to submit message. Please try again.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("API Route Error:", err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}

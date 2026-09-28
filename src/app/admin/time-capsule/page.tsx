import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { TimeCapsuleEditor } from "@/components/admin/TimeCapsuleEditor"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Admin - Time Capsule",
}

export default async function AdminTimeCapsulePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect("/login")
  }

  // Fetch timeline days
  const { data: days } = await supabase
    .from("timeline_days")
    .select("*")
    .order("day_number", { ascending: true })

  // Fetch timeline entries
  const { data: entries } = await supabase
    .from("timeline_entries")
    .select("*")
    .order("day_number", { ascending: true })
    .order("entry_order", { ascending: true })
    .order("created_at", { ascending: true })

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-neutral-900 dark:text-white mb-2">
          Time Capsule Management
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Manage day markers and memory entries for the public Time Capsule.
        </p>
      </div>

      <TimeCapsuleEditor 
        initialDays={days || []} 
        initialEntries={entries || []} 
        userId={user.id} 
      />
    </div>
  )
}

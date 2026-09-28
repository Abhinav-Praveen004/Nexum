import { createClient } from "@/lib/supabase/server"
import { Section } from "@/components/shared/Section"
import { TimeCapsuleClient } from "@/components/time-capsule/TimeCapsuleClient"
import { BookImage } from "lucide-react"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Time Capsule | NEXUM",
  description: "The memory archive of the NEXUM Profile Development Program.",
}

export default async function TimeCapsulePage() {
  const supabase = await createClient()

  // Fetch timeline days
  const { data: days, error: daysError } = await supabase
    .from("timeline_days")
    .select("*")
    .order("day_number", { ascending: true })

  // Fetch timeline entries
  const { data: entries, error: entriesError } = await supabase
    .from("timeline_entries")
    .select("*")
    .order("day_number", { ascending: true })
    .order("entry_order", { ascending: true })
    .order("created_at", { ascending: true })

  if (daysError || entriesError) {
    return (
      <Section className="min-h-screen py-16 md:py-24 bg-neutral-50 dark:bg-brand-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 font-medium">Failed to load time capsule. Please try again later.</p>
        </div>
      </Section>
    )
  }

  return (
    <Section className="min-h-screen py-16 md:py-24 bg-neutral-50 dark:bg-brand-black">
      <div className="mb-16 max-w-3xl text-center mx-auto fade-in-on-scroll is-visible">
        <div className="w-16 h-16 bg-brand-emerald/10 text-brand-emerald rounded-full flex items-center justify-center mx-auto mb-6">
          <BookImage size={32} />
        </div>
        <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4">
          Time Capsule
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          The memory archive of our four-day Profile Development Program journey.
        </p>
      </div>

      <TimeCapsuleClient days={days || []} entries={entries || []} />
    </Section>
  )
}

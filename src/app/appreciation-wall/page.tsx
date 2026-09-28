import { createClient } from "@/lib/supabase/server"
import { Section } from "@/components/shared/Section"
import { HeartHandshake } from "lucide-react"
import { AppreciationWallClient } from "@/components/appreciation-wall/AppreciationWallClient"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Appreciation Wall | NEXUM",
  description: "Recognising the contributions and efforts of our team.",
}

export default async function AppreciationWallPage() {
  const supabase = await createClient()

  // Only fetch approved messages
  const { data: messages, error } = await supabase
    .from("appreciation_messages")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false })

  if (error) {
    return (
      <Section className="min-h-screen py-16 md:py-24 bg-neutral-50 dark:bg-brand-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 font-medium">Failed to load appreciation wall. Please try again later.</p>
        </div>
      </Section>
    )
  }

  return (
    <Section className="min-h-screen py-16 md:py-24 bg-neutral-50 dark:bg-brand-black">
      <div className="mb-16 max-w-3xl text-center mx-auto fade-in-on-scroll is-visible">
        <div className="w-16 h-16 bg-brand-emerald/10 text-brand-emerald rounded-full flex items-center justify-center mx-auto mb-6">
          <HeartHandshake size={32} />
        </div>
        <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4">
          Appreciation Wall
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          Recognising the contributions, big and small, that make our four days together work. Give a shoutout to someone who helped you, inspired you, or just made you smile.
        </p>
      </div>

      <AppreciationWallClient messages={messages || []} />
    </Section>
  )
}

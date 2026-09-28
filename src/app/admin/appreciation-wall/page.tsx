import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AppreciationModerator } from "@/components/admin/AppreciationModerator"
import { HeartHandshake } from "lucide-react"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Admin - Appreciation Wall",
}

export default async function AdminAppreciationPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect("/login")
  }

  // Fetch all appreciation messages
  const { data: messages } = await supabase
    .from("appreciation_messages")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-brand-emerald/10 text-brand-emerald rounded-lg">
          <HeartHandshake size={24} />
        </div>
        <div>
          <h1 className="font-heading text-3xl font-bold text-neutral-900 dark:text-white">
            Appreciation Moderation
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Review submissions before they appear on the public wall.
          </p>
        </div>
      </div>

      <AppreciationModerator initialMessages={messages || []} userId={user.id} />
    </div>
  )
}

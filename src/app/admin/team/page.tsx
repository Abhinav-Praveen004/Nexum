import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getTeamMembers } from "@/lib/team"
import Link from "next/link"
import Image from "next/image"
import { Users, Pencil } from "lucide-react"
import { Card } from "@/components/shared/Card"
import { Button } from "@/components/shared/Button"

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
}

export const metadata = {
  title: "Admin - Team Profiles",
}

export default async function AdminTeamPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect("/login")
  }

  const members = await getTeamMembers()

  return (
    <div className="max-w-6xl mx-auto py-12 md:py-16 min-h-screen px-4 md:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-emerald/10 text-brand-emerald rounded-lg">
            <Users size={24} />
          </div>
          <div>
            <h1 className="font-heading text-3xl font-bold text-neutral-900 dark:text-white">
              Team Profiles
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Manage teammate bios, PDP journeys, and photos.
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <Button asChild variant="secondary">
            <Link href="/admin">Back to Dashboard</Link>
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map(member => (
          <Link key={member.slug} href={`/admin/team/${member.slug}`} className="group outline-none">
            <Card className="p-6 flex items-center gap-4 hover:shadow-md transition-shadow hover:border-brand-emerald group-focus-visible:ring-2 group-focus-visible:ring-brand-emerald">
              <div className="shrink-0">
                {member.photo_url ? (
                  <div className="w-16 h-16 rounded-full overflow-hidden relative">
                    <Image src={member.photo_url} alt={member.name} fill className="object-cover" sizes="64px" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-xl font-heading font-bold text-neutral-500 dark:text-neutral-400">
                    {getInitials(member.name)}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-semibold text-lg text-neutral-900 dark:text-white truncate group-hover:text-brand-emerald transition-colors">
                  {member.name}
                </h3>
                <p className="text-sm text-neutral-500 truncate">
                  {member.role}
                </p>
              </div>
              <div className="text-neutral-400 group-hover:text-brand-emerald transition-colors">
                <Pencil size={20} />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

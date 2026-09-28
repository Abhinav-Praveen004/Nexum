import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { getTeamMember } from "@/lib/team"
import { TeamMemberEditor } from "@/components/admin/TeamMemberEditor"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Edit Team Member",
}

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function EditTeamMemberPage({ params }: PageProps) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect("/login")
  }

  const { slug } = await params
  const member = await getTeamMember(slug)

  if (!member) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/admin/team" className="inline-flex items-center gap-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white font-medium mb-8 transition-colors">
        <ArrowLeft size={20} /> Back to Team Profiles
      </Link>

      <TeamMemberEditor member={member} />
    </div>
  )
}

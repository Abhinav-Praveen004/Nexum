"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Section } from "@/components/shared/Section"
import { Card } from "@/components/shared/Card"
import { Button } from "@/components/shared/Button"
import { LogOut, BookOpen, Mic, Hourglass, HeartHandshake, Users } from "lucide-react"

const ADMIN_SECTIONS = [
  { id: "journal", title: "Daily Journal", icon: BookOpen },
  { id: "podcasts", title: "Podcasts", icon: Mic },
  { id: "timeline", title: "Time Capsule", icon: Hourglass },
  { id: "appreciation", title: "Appreciation Wall", icon: HeartHandshake },
  { id: "team", title: "Team Profiles", icon: Users },
]

export default function AdminDashboard() {
  const router = useRouter()
  const supabase = createClient()
  const [pendingCount, setPendingCount] = useState<number | null>(null)

  useEffect(() => {
    const fetchPending = async () => {
      const { count } = await supabase
        .from('appreciation_messages')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')
      if (count !== null) setPendingCount(count)
    }
    fetchPending()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <Section className="py-12 md:py-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4 fade-in-on-scroll is-visible">
        <div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            Manage NEXUM content and moderate submissions.
          </p>
        </div>
        <Button onClick={handleLogout} variant="secondary" className="gap-2">
          <LogOut size={16} /> Sign Out
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 fade-in-on-scroll is-visible">
        <Link href="/admin/journal" className="group outline-none">
          <Card className="p-6 flex flex-col h-full transition-all duration-300 hover:shadow-md hover:border-brand-emerald group-focus-visible:ring-2 group-focus-visible:ring-brand-emerald">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-brand-emerald/10 text-brand-emerald rounded-lg">
                <BookOpen size={20} />
              </div>
              <h2 className="font-heading text-xl font-semibold text-neutral-900 dark:text-white group-hover:text-brand-emerald transition-colors">
                Daily Journal
              </h2>
            </div>
            <div className="mt-auto pt-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-brand-emerald/10 text-brand-emerald text-xs font-medium rounded-full transition-colors group-hover:bg-brand-emerald group-hover:text-white">
                Manage Entries &rarr;
              </span>
            </div>
          </Card>
        </Link>
        
        <Link href="/admin/podcasts" className="group outline-none">
          <Card className="p-6 flex flex-col h-full transition-all duration-300 hover:shadow-md hover:border-brand-emerald group-focus-visible:ring-2 group-focus-visible:ring-brand-emerald">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-brand-emerald/10 text-brand-emerald rounded-lg">
                <Mic size={20} />
              </div>
              <h2 className="font-heading text-xl font-semibold text-neutral-900 dark:text-white group-hover:text-brand-emerald transition-colors">
                Podcasts
              </h2>
            </div>
            <div className="mt-auto pt-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-brand-emerald/10 text-brand-emerald text-xs font-medium rounded-full transition-colors group-hover:bg-brand-emerald group-hover:text-white">
                Manage Episodes &rarr;
              </span>
            </div>
          </Card>
        </Link>
        
        <Link href="/admin/time-capsule" className="group outline-none">
          <Card className="p-6 flex flex-col h-full transition-all duration-300 hover:shadow-md hover:border-brand-emerald group-focus-visible:ring-2 group-focus-visible:ring-brand-emerald">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-brand-emerald/10 text-brand-emerald rounded-lg">
                <Hourglass size={20} />
              </div>
              <h2 className="font-heading text-xl font-semibold text-neutral-900 dark:text-white group-hover:text-brand-emerald transition-colors">
                Time Capsule
              </h2>
            </div>
            <div className="mt-auto pt-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-brand-emerald/10 text-brand-emerald text-xs font-medium rounded-full transition-colors group-hover:bg-brand-emerald group-hover:text-white">
                Manage Memories &rarr;
              </span>
            </div>
          </Card>
        </Link>

        <Link href="/admin/appreciation-wall" className="group outline-none">
          <Card className="p-6 flex flex-col h-full transition-all duration-300 hover:shadow-md hover:border-brand-emerald group-focus-visible:ring-2 group-focus-visible:ring-brand-emerald relative">
            {pendingCount !== null && pendingCount > 0 && (
              <span className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-in zoom-in">
                {pendingCount} Pending
              </span>
            )}
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-brand-emerald/10 text-brand-emerald rounded-lg">
                <HeartHandshake size={20} />
              </div>
              <h2 className="font-heading text-xl font-semibold text-neutral-900 dark:text-white group-hover:text-brand-emerald transition-colors">
                Appreciation Wall
              </h2>
            </div>
            <div className="mt-auto pt-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-brand-emerald/10 text-brand-emerald text-xs font-medium rounded-full transition-colors group-hover:bg-brand-emerald group-hover:text-white">
                Moderate Messages &rarr;
              </span>
            </div>
          </Card>
        </Link>

        <Link href="/admin/team" className="group outline-none">
          <Card className="p-6 flex flex-col h-full transition-all duration-300 hover:shadow-md hover:border-brand-emerald group-focus-visible:ring-2 group-focus-visible:ring-brand-emerald relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-brand-emerald/10 text-brand-emerald rounded-lg">
                <Users size={20} />
              </div>
              <h2 className="font-heading text-xl font-semibold text-neutral-900 dark:text-white group-hover:text-brand-emerald transition-colors">
                Team Profiles
              </h2>
            </div>
            
            <div className="mt-auto pt-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-brand-emerald/10 text-brand-emerald text-xs font-medium rounded-full transition-colors group-hover:bg-brand-emerald group-hover:text-white">
                Manage Members &rarr;
              </span>
            </div>
          </Card>
        </Link>

        {ADMIN_SECTIONS.filter(s => s.id !== 'journal' && s.id !== 'podcasts' && s.id !== 'timeline' && s.id !== 'appreciation' && s.id !== 'team').map((section) => (
          <Card key={section.id} className="p-6 flex flex-col h-full opacity-60">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-brand-emerald/10 text-brand-emerald rounded-lg">
                <section.icon size={20} />
              </div>
              <h2 className="font-heading text-xl font-semibold text-neutral-900 dark:text-white">
                {section.title}
              </h2>
            </div>
            
            <div className="mt-auto pt-6">
              <span className="inline-block px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-xs font-medium rounded-full">
                Coming in a later phase
              </span>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  )
}

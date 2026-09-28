import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Section } from "@/components/shared/Section"
import { Card } from "@/components/shared/Card"
import { Button } from "@/components/shared/Button"
import { Plus, Edit2, ExternalLink } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminPodcastsList() {
  const supabase = await createClient()

  const { data: episodes } = await supabase
    .from("podcast_episodes")
    .select("*")
    .order("episode_number", { ascending: false })

  return (
    <Section className="py-12 md:py-16 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-neutral-900 dark:text-white">
            Podcast CMS
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Manage your NEXUM On Air episodes.
          </p>
        </div>
        <div className="flex gap-4">
          <Button asChild variant="secondary">
            <Link href="/admin">Back to Dashboard</Link>
          </Button>
          <Button asChild className="gap-2">
            <Link href="/admin/podcasts/new"><Plus size={16} /> New Episode</Link>
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="px-6 py-4 font-semibold text-neutral-900 dark:text-white">Ep #</th>
                <th className="px-6 py-4 font-semibold text-neutral-900 dark:text-white">Title</th>
                <th className="px-6 py-4 font-semibold text-neutral-900 dark:text-white">Recording Date</th>
                <th className="px-6 py-4 font-semibold text-neutral-900 dark:text-white">Status</th>
                <th className="px-6 py-4 font-semibold text-neutral-900 dark:text-white text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {!episodes || episodes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">
                    No podcast episodes found. Create one to get started.
                  </td>
                </tr>
              ) : (
                episodes.map((episode) => (
                  <tr key={episode.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/20 transition-colors">
                    <td className="px-6 py-4 text-neutral-600 dark:text-neutral-400 font-medium">
                      {String(episode.episode_number).padStart(2, '0')}
                    </td>
                    <td className="px-6 py-4 font-medium text-neutral-900 dark:text-white max-w-[250px] truncate">
                      {episode.title}
                    </td>
                    <td className="px-6 py-4 text-neutral-600 dark:text-neutral-400">
                      {new Date(episode.recording_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-md ${
                        episode.status === 'published' 
                          ? 'bg-brand-emerald/10 text-brand-emerald' 
                          : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                      }`}>
                        {episode.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {episode.status === 'published' && (
                          <Link 
                            href={`/podcasts`} 
                            target="_blank"
                            className="p-2 text-neutral-500 hover:text-brand-emerald transition-colors"
                            title="View on public page"
                          >
                            <ExternalLink size={16} />
                          </Link>
                        )}
                        <Link 
                          href={`/admin/podcasts/${episode.id}`}
                          className="p-2 text-neutral-500 hover:text-blue-500 transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </Section>
  )
}

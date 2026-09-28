import { createClient } from "@/lib/supabase/server"
import { Section } from "@/components/shared/Section"
import { Card } from "@/components/shared/Card"
import { Calendar, Mic, ChevronDown } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function PodcastsPage() {
  const supabase = await createClient()

  const { data: episodes } = await supabase
    .from("podcast_episodes")
    .select("*")
    .eq("status", "published")
    .order("episode_number", { ascending: false })

  return (
    <Section className="min-h-screen py-16 md:py-24 bg-neutral-50 dark:bg-brand-black">
      {/* Header */}
      <div className="mb-16 max-w-3xl text-center mx-auto fade-in-on-scroll is-visible">
        <div className="w-16 h-16 bg-brand-emerald/10 text-brand-emerald rounded-full flex items-center justify-center mx-auto mb-6">
          <Mic size={32} />
        </div>
        <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4">
          NEXUM On Air
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          Listen to our discussions, strategies, and reflections from the Profile Development Program.
        </p>
      </div>

      {/* Episodes List */}
      {!episodes || episodes.length === 0 ? (
        <div className="text-center py-24 bg-white dark:bg-neutral-900/50 rounded-2xl border border-neutral-200 dark:border-neutral-800 fade-in-on-scroll is-visible">
          <Mic className="w-12 h-12 text-neutral-300 dark:text-neutral-700 mx-auto mb-4" />
          <p className="text-xl font-heading font-medium text-neutral-900 dark:text-white mb-2">
            Stay tuned!
          </p>
          <p className="text-neutral-600 dark:text-neutral-400">
            Episodes will appear here once the team uploads them.
          </p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-8 fade-in-on-scroll is-visible">
          {episodes.map((episode) => (
            <Card key={episode.id} className="p-6 md:p-8 overflow-hidden transition-all hover:shadow-md hover:border-brand-emerald">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-32 shrink-0">
                  <div className="aspect-square bg-neutral-100 dark:bg-neutral-800 rounded-xl flex flex-col items-center justify-center border border-neutral-200 dark:border-neutral-700">
                    <span className="text-neutral-500 font-semibold uppercase text-xs tracking-widest mb-1">Episode</span>
                    <span className="font-heading text-4xl font-bold text-neutral-900 dark:text-white">
                      {String(episode.episode_number).padStart(2, '0')}
                    </span>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-3">
                    <Calendar size={14} /> 
                    {new Date(episode.recording_date).toLocaleDateString(undefined, { 
                      year: 'numeric', month: 'long', day: 'numeric' 
                    })}
                  </div>
                  
                  <h2 className="font-heading text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-3">
                    {episode.title}
                  </h2>
                  
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
                    {episode.description}
                  </p>
                  
                  {episode.audio_url && (
                    <div className="mb-6">
                      <audio controls className="w-full h-12 rounded-lg bg-neutral-100 dark:bg-neutral-900 outline-none">
                        <source src={episode.audio_url} />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}

                  {episode.transcript && (
                    <details className="group border border-neutral-200 dark:border-neutral-800 rounded-lg">
                      <summary className="flex items-center justify-between p-4 cursor-pointer font-medium text-neutral-700 dark:text-neutral-300 hover:text-brand-emerald select-none list-none [&::-webkit-details-marker]:hidden">
                        View Transcript
                        <ChevronDown size={16} className="transition-transform group-open:rotate-180" />
                      </summary>
                      <div className="p-4 pt-0 text-sm text-neutral-600 dark:text-neutral-400 whitespace-pre-wrap leading-loose border-t border-neutral-100 dark:border-neutral-800 mt-2">
                        {episode.transcript}
                      </div>
                    </details>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Section>
  )
}

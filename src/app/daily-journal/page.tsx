import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/server"
import { Section } from "@/components/shared/Section"
import { Card } from "@/components/shared/Card"
import { Calendar, User, Search, BookOpen } from "lucide-react"

interface PageProps {
  searchParams: Promise<{
    q?: string
    day?: string
    author?: string
  }>
}

export default async function DailyJournal({ searchParams }: PageProps) {
  const { q, day, author } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })

  if (q) {
    query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`)
  }
  if (day) {
    query = query.eq("pdp_day", parseInt(day))
  }
  if (author) {
    query = query.ilike("author", `%${author}%`)
  }

  const { data: articles } = await query

  const featured = !q && !day && !author && articles && articles.length > 0 ? articles[0] : null
  const regularArticles = featured ? articles?.slice(1) : articles

  return (
    <Section className="min-h-screen py-16 md:py-24">
      <div className="mb-12">
        <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Daily Journal
        </h1>
        <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400">
          Reflections, strategies, and key moments from the four-day Profile Development Program.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-12 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 md:p-6 flex flex-col md:flex-row gap-4">
        <form className="flex-1 flex gap-4 flex-col sm:flex-row" method="GET" action="/daily-journal">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <input 
              name="q"
              defaultValue={q}
              placeholder="Search journals..." 
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-brand-black border border-neutral-200 dark:border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-emerald"
            />
          </div>
          <select 
            name="day" 
            defaultValue={day || ""} 
            className="px-4 py-2 bg-white dark:bg-brand-black border border-neutral-200 dark:border-neutral-700 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-emerald"
          >
            <option value="">All Days</option>
            <option value="1">Day 1</option>
            <option value="2">Day 2</option>
            <option value="3">Day 3</option>
            <option value="4">Day 4</option>
          </select>
          <button type="submit" className="px-6 py-2 bg-brand-emerald text-white font-medium rounded-md hover:bg-brand-emerald-hover transition-colors">
            Filter
          </button>
          {(q || day || author) && (
            <Link href="/daily-journal" className="px-6 py-2 bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-medium rounded-md hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors text-center">
              Clear
            </Link>
          )}
        </form>
      </div>

      {!articles || articles.length === 0 ? (
        <div className="text-center py-24 bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl border border-neutral-200 dark:border-neutral-800">
          <p className="text-xl text-neutral-600 dark:text-neutral-400">
            {q || day || author ? "No journal entries found matching your filters." : "No journal entries published yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-16">
          {/* Featured Article */}
          {featured && (
            <Link href={`/daily-journal/${featured.slug}`} className="group outline-none block">
              <Card className="overflow-hidden flex flex-col md:flex-row transition-all duration-300 hover:shadow-lg hover:border-brand-emerald group-focus-visible:ring-2 group-focus-visible:ring-brand-emerald">
                <div className="md:w-1/2 relative min-h-[300px] md:min-h-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                  {featured.cover_image_url ? (
                    <Image src={featured.cover_image_url} alt={featured.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                  ) : (
                    <div className="text-neutral-400 dark:text-neutral-600 flex flex-col items-center gap-2">
                      <BookOpen size={48} />
                      <span className="font-heading font-semibold uppercase tracking-widest text-xs">Featured Entry</span>
                    </div>
                  )}
                </div>
                <div className="p-8 md:p-12 md:w-1/2 flex flex-col justify-center">
                  <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wider mb-4">
                    <span className="text-brand-emerald bg-brand-emerald/10 px-2 py-1 rounded">Day {featured.pdp_day}</span>
                    <span className="text-neutral-500 flex items-center gap-1"><Calendar size={14}/> {new Date(featured.published_at || featured.created_at).toLocaleDateString()}</span>
                  </div>
                  <h2 className="font-heading text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4 group-hover:text-brand-emerald transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
                    {featured.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 mt-auto">
                    <User size={16} /> By {featured.author}
                  </div>
                </div>
              </Card>
            </Link>
          )}

          {/* Regular Articles Grid */}
          {regularArticles && regularArticles.length > 0 && (
            <div>
              <h3 className="font-heading text-2xl font-bold text-neutral-900 dark:text-white mb-8 border-b border-neutral-200 dark:border-neutral-800 pb-4">
                More Entries
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularArticles.map((article) => (
                  <Link key={article.id} href={`/daily-journal/${article.slug}`} className="group outline-none flex flex-col h-full">
                    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-md hover:border-brand-emerald group-focus-visible:ring-2 group-focus-visible:ring-brand-emerald">
                      <div className="relative h-48 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0 border-b border-neutral-200 dark:border-neutral-800">
                        {article.cover_image_url ? (
                          <Image src={article.cover_image_url} alt={article.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" />
                        ) : (
                          <BookOpen size={32} className="text-neutral-300 dark:text-neutral-700" />
                        )}
                        <div className="absolute top-4 left-4 bg-white/90 dark:bg-brand-black/90 backdrop-blur-sm text-brand-emerald text-xs font-bold uppercase tracking-wider px-2 py-1 rounded shadow-sm">
                          Day {article.pdp_day}
                        </div>
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 mb-3">
                          <Calendar size={14} />
                          {new Date(article.published_at || article.created_at).toLocaleDateString()}
                        </div>
                        <h3 className="font-heading text-xl font-bold text-neutral-900 dark:text-white mb-3 group-hover:text-brand-emerald transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6 flex-1 line-clamp-3">
                          {article.description}
                        </p>
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-neutral-100 dark:border-neutral-800">
                          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                            <User size={14} /> {article.author}
                          </span>
                          <span className="text-sm font-medium text-brand-emerald group-hover:text-brand-emerald-hover transition-colors">
                            Read more
                          </span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Section>
  )
}

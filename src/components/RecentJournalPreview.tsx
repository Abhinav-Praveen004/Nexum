import Link from "next/link"
import { ArrowRight, Calendar } from "lucide-react"
import { Section } from "@/components/shared/Section"
import { Card } from "@/components/shared/Card"
import { Button } from "@/components/shared/Button"

// Structured for easy replacement with real data later
const PLACEHOLDER_ENTRIES = [
  {
    id: "1",
    title: "Sample Entry: Day One Kickoff",
    excerpt: "Real journal posts will appear here once published. This space will capture our initial thoughts, team formation dynamics, and the first challenges we faced together.",
    date: "Day 1",
    author: "Janhavi J",
  },
  {
    id: "2",
    title: "Sample Entry: Navigating The First Hurdle",
    excerpt: "Real journal posts will appear here once published. We'll use these entries to document our problem-solving process and the strategic pivots we made.",
    date: "Day 2",
    author: "Rubikaa V",
  },
  {
    id: "3",
    title: "Sample Entry: Finding Our Rhythm",
    excerpt: "Real journal posts will appear here once published. Reflections on how our diverse perspectives coalesced into a unified approach to the program's demands.",
    date: "Day 3",
    author: "NEXUM Team",
  },
]

import { createClient } from "@/lib/supabase/server"

export async function RecentJournalPreview() {
  const supabase = await createClient()
  
  const { data: articles } = await supabase
    .from('articles')
    .select('id, title, description, created_at, author, slug')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(3)

  const hasArticles = articles && articles.length > 0
  
  // Map real articles to the shape expected by the UI, or use placeholders
  const entries = hasArticles ? articles.map(article => {
    // Format date nicely
    const date = new Date(article.created_at).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
    
    return {
      id: article.slug,
      title: article.title,
      excerpt: article.description,
      date: date,
      author: article.author,
    }
  }) : PLACEHOLDER_ENTRIES

  return (
    <Section>
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 fade-in-on-scroll is-visible">
        <div>
          <h2 className="font-heading text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
            From the Journal
          </h2>
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">
            Latest reflections and insights from the team.
          </p>
        </div>
        <Button asChild variant="ghost" className="gap-2 self-start md:self-auto">
          <Link href="/daily-journal">
            View All Entries <ArrowRight size={16} />
          </Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 fade-in-on-scroll is-visible">
        {entries.map((entry) => (
          <Card key={entry.id} className="p-6 flex flex-col hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors">
            <div className="flex items-center gap-2 text-xs font-medium text-brand-emerald mb-4">
              <Calendar size={14} />
              <span className="uppercase tracking-wider">{entry.date}</span>
            </div>
            
            <h3 className="font-heading text-xl font-semibold text-neutral-900 dark:text-white mb-3 line-clamp-2">
              {entry.title}
            </h3>
            
            <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
              {entry.excerpt}
            </p>
            
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <span className="text-xs font-medium text-neutral-500 dark:text-neutral-500">
                By {entry.author}
              </span>
              <Link 
                href={`/daily-journal/${entry.id}`}
                className="text-sm font-medium text-brand-emerald hover:text-brand-emerald-hover transition-colors"
                aria-label={`Read ${entry.title}`}
              >
                Read more
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  )
}

import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Calendar, User, FileText } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Section } from "@/components/shared/Section"
import { Button } from "@/components/shared/Button"

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function DailyJournalDetail({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: article } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single()

  if (!article) {
    notFound()
  }

  // Fetch related articles (same pdp_day, excluding current)
  const { data: related } = await supabase
    .from("articles")
    .select("title, slug, cover_image_url")
    .eq("pdp_day", article.pdp_day)
    .eq("status", "published")
    .neq("id", article.id)
    .limit(3)

  return (
    <Section className="py-12 md:py-16">
      <div className="max-w-4xl mx-auto fade-in-on-scroll is-visible">
        <Button asChild variant="ghost" className="mb-8 -ml-4 gap-2">
          <Link href="/daily-journal">
            <ArrowLeft size={16} /> Back to Journal
          </Link>
        </Button>

        <header className="mb-12">
          <div className="flex flex-wrap items-center gap-4 text-sm font-semibold uppercase tracking-wider mb-6">
            <span className="text-brand-emerald bg-brand-emerald/10 px-3 py-1.5 rounded-md">
              Day {article.pdp_day}
            </span>
            <span className="text-neutral-500 flex items-center gap-2">
              <Calendar size={16} /> 
              {new Date(article.published_at || article.created_at).toLocaleDateString(undefined, { 
                year: 'numeric', month: 'long', day: 'numeric' 
              })}
            </span>
            <span className="text-neutral-500 flex items-center gap-2">
              <User size={16} /> {article.author}
            </span>
          </div>

          <h1 className="font-heading text-4xl md:text-6xl font-bold text-neutral-900 dark:text-white mb-6 leading-tight">
            {article.title}
          </h1>

          <p className="text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {article.description}
          </p>
        </header>

        {article.cover_image_url && (
          <div className="relative w-full aspect-video mb-16 rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
            <Image 
              src={article.cover_image_url} 
              alt={article.title} 
              fill 
              sizes="(max-width: 896px) 100vw, 896px"
              className="object-cover" 
              priority
            />
          </div>
        )}

        <div className="prose prose-lg dark:prose-invert prose-emerald max-w-none">
          {article.document_url ? (
            <div className="my-12 p-8 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl text-center bg-neutral-50 dark:bg-neutral-900/50">
              <FileText className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
              <h3 className="font-heading text-xl font-semibold mb-2">Document Attached</h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                This journal entry contains a PDF or external document (e.g., Canva presentation).
              </p>
              <Button asChild>
                <a href={article.document_url} target="_blank" rel="noopener noreferrer">
                  View Document
                </a>
              </Button>
            </div>
          ) : (
            <div className="whitespace-pre-wrap leading-loose">
              {article.content}
            </div>
          )}
        </div>

        {/* Related Articles */}
        {related && related.length > 0 && (
          <div className="mt-24 pt-12 border-t border-neutral-200 dark:border-neutral-800">
            <h3 className="font-heading text-2xl font-bold text-neutral-900 dark:text-white mb-8">
              More from Day {article.pdp_day}
            </h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {related.map((rel) => (
                <Link key={rel.slug} href={`/daily-journal/${rel.slug}`} className="group outline-none">
                  <div className="bg-neutral-50 dark:bg-neutral-900/50 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 transition-all hover:border-brand-emerald">
                    <div className="relative aspect-video bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                      {rel.cover_image_url ? (
                        <Image src={rel.cover_image_url} alt={rel.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                      ) : (
                        <FileText size={24} className="text-neutral-300 dark:text-neutral-700" />
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="font-heading font-semibold text-neutral-900 dark:text-white group-hover:text-brand-emerald line-clamp-2">
                        {rel.title}
                      </h4>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </Section>
  )
}

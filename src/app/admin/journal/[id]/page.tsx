import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { JournalEditor } from "@/components/admin/JournalEditor"
import { Section } from "@/components/shared/Section"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditJournalPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: article } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .single()

  if (!article) {
    notFound()
  }

  return (
    <Section className="py-12 md:py-16 bg-neutral-50 dark:bg-brand-black min-h-screen">
      <div className="mb-8 max-w-4xl mx-auto">
        <h1 className="font-heading text-3xl font-bold text-neutral-900 dark:text-white">
          Edit Article
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-1">
          Make changes to your existing journal entry.
        </p>
      </div>
      
      <JournalEditor initialData={article} />
    </Section>
  )
}

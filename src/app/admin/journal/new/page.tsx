import { JournalEditor } from "@/components/admin/JournalEditor"
import { Section } from "@/components/shared/Section"

export default function NewJournalPage() {
  return (
    <Section className="py-12 md:py-16 bg-neutral-50 dark:bg-brand-black min-h-screen">
      <div className="mb-8 max-w-4xl mx-auto">
        <h1 className="font-heading text-3xl font-bold text-neutral-900 dark:text-white">
          Create New Article
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-1">
          Draft a new entry for the Daily Journal.
        </p>
      </div>
      
      <JournalEditor />
    </Section>
  )
}

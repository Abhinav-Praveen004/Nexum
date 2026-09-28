import { PodcastEditor } from "@/components/admin/PodcastEditor"
import { Section } from "@/components/shared/Section"

export default function NewPodcastPage() {
  return (
    <Section className="py-12 md:py-16 bg-neutral-50 dark:bg-brand-black min-h-screen">
      <div className="mb-8 max-w-4xl mx-auto">
        <h1 className="font-heading text-3xl font-bold text-neutral-900 dark:text-white">
          Create New Episode
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-1">
          Draft a new episode for NEXUM On Air.
        </p>
      </div>
      
      <PodcastEditor />
    </Section>
  )
}

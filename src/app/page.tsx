import { Hero } from "@/components/Hero"
import { PDPExplainer } from "@/components/PDPExplainer"
import { SectionPreviews } from "@/components/SectionPreviews"
import { CaptainFeature } from "@/components/CaptainFeature"
import { RecentJournalPreview } from "@/components/RecentJournalPreview"
import { Section } from "@/components/shared/Section"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <PDPExplainer />
      <SectionPreviews />
      <CaptainFeature />
      <RecentJournalPreview />
      
      {/* Closing Statement */}
      <Section className="py-16 md:py-24 text-center">
        <div className="max-w-2xl mx-auto space-y-4 fade-in-on-scroll is-visible">
          <p className="font-heading text-2xl md:text-3xl font-medium tracking-tight text-neutral-900 dark:text-white">
            Together, we transform challenges into stepping stones.
          </p>
          <p className="text-brand-emerald font-medium uppercase tracking-wider text-sm">
            Continuous Learning &bull; Unified Teamwork &bull; Infinite Growth
          </p>
        </div>
      </Section>
    </div>
  )
}

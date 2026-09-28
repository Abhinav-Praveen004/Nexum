import { Section } from "@/components/shared/Section"

export function PDPExplainer() {
  return (
    <Section className="bg-neutral-50 dark:bg-neutral-900 border-y border-neutral-200 dark:border-neutral-800">
      <div className="max-w-4xl mx-auto text-center space-y-8 fade-in-on-scroll is-visible">
        <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
          The Profile Development Program
        </h2>
        
        <div className="grid sm:grid-cols-2 gap-8 text-left mt-12">
          <div className="space-y-4">
            <h3 className="font-heading text-xl font-semibold text-brand-emerald">A Catalyst for Growth</h3>
            <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
              The four-day Profile Development Program (PDP) is designed to push boundaries, test adaptability, and foster critical thinking. It acts as an intensive incubator where future leaders engage with real-world complexities.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="font-heading text-xl font-semibold text-brand-emerald">Collaboration at its Core</h3>
            <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
              Success in the PDP relies not just on individual brilliance, but on cohesive teamwork. We learn to navigate diverse perspectives, leverage each other's strengths, and build robust solutions together under pressure.
            </p>
          </div>
        </div>
      </div>
    </Section>
  )
}

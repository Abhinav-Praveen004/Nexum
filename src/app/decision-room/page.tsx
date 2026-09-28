import { Section } from "@/components/shared/Section"
import { DecisionRoomClient } from "@/components/decision-room/DecisionRoomClient"
import { Lightbulb } from "lucide-react"

export const metadata = {
  title: "Decision Room | NEXUM",
  description: "Think like a manager in the NEXUM Decision Room.",
}

export default function DecisionRoomPage() {
  return (
    <Section className="min-h-screen py-16 md:py-24 bg-neutral-50 dark:bg-brand-black">
      <div className="mb-12 max-w-3xl text-center mx-auto fade-in-on-scroll is-visible">
        <div className="w-16 h-16 bg-brand-emerald/10 text-brand-emerald rounded-full flex items-center justify-center mx-auto mb-6">
          <Lightbulb size={32} />
        </div>
        <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4">
          Think Like a Manager
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          Explore real-world leadership scenarios. There are no strictly right or wrong answers—only different trade-offs and approaches to leading a team.
        </p>
      </div>

      <div className="max-w-4xl mx-auto fade-in-on-scroll is-visible">
        <DecisionRoomClient />
      </div>
    </Section>
  )
}

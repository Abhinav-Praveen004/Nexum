import Link from "next/link"
import { Users, BookOpen, Mic, BrainCircuit, Gamepad2, Hourglass, HeartHandshake } from "lucide-react"
import { Section } from "@/components/shared/Section"
import { Card } from "@/components/shared/Card"

const SECTIONS = [
  { href: "/our-team", label: "Our Team", icon: Users, color: "text-blue-500" },
  { href: "/daily-journal", label: "Daily Journal", icon: BookOpen, color: "text-emerald-500" },
  { href: "/podcasts", label: "Podcasts", icon: Mic, color: "text-purple-500" },
  { href: "/decision-room", label: "Decision Room", icon: BrainCircuit, color: "text-rose-500" },
  { href: "/fun-zone", label: "Fun Zone", icon: Gamepad2, color: "text-orange-500" },
  { href: "/time-capsule", label: "Time Capsule", icon: Hourglass, color: "text-amber-500" },
  { href: "/appreciation-wall", label: "Appreciation Wall", icon: HeartHandshake, color: "text-pink-500" },
]

export function SectionPreviews() {
  return (
    <Section>
      <div className="mb-12 text-center fade-in-on-scroll is-visible">
        <h2 className="font-heading text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Explore the Hub
        </h2>
        <p className="mt-4 text-neutral-600 dark:text-neutral-400">
          Navigate through our experiences, reflections, and strategic decisions.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 fade-in-on-scroll is-visible">
        {SECTIONS.map((section) => (
          <Link key={section.href} href={section.href} className="group outline-none">
            <Card className="h-full flex flex-col items-center justify-center p-6 text-center transition-all duration-300 hover:border-brand-emerald hover:shadow-md dark:hover:border-brand-emerald group-focus-visible:ring-2 group-focus-visible:ring-brand-emerald">
              <section.icon className={`w-8 h-8 mb-4 transition-transform group-hover:scale-110 ${section.color}`} />
              <h3 className="font-heading font-semibold text-neutral-900 dark:text-neutral-100">
                {section.label}
              </h3>
            </Card>
          </Link>
        ))}
      </div>
    </Section>
  )
}

import { Section } from "@/components/shared/Section"
import { Card } from "@/components/shared/Card"
import Link from "next/link"
import { Gamepad2, Search, Timer, Brain, CheckSquare } from "lucide-react"

export const metadata = {
  title: "Fun Zone | NEXUM",
  description: "Interactive activities to test your management instincts.",
}

const ACTIVITIES = [
  {
    id: "mystery-manager",
    title: "Mystery Manager",
    description: "Solve a team puzzle using clues. What really went wrong?",
    icon: Search,
    time: "~3 mins",
    href: "/fun-zone/mystery-manager",
    colorClass: "bg-blue-500/10 text-blue-500",
    hoverClass: "group-hover:border-blue-500 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.1)]"
  },
  {
    id: "sixty-second-ceo",
    title: "60-Second CEO",
    description: "Make fast trade-offs under pressure. Time is ticking!",
    icon: Timer,
    time: "1 min",
    href: "/fun-zone/sixty-second-ceo",
    colorClass: "bg-orange-500/10 text-orange-500",
    hoverClass: "group-hover:border-orange-500 group-hover:shadow-[0_0_15px_rgba(249,115,22,0.1)]"
  },
  {
    id: "brain-break",
    title: "Brain Break",
    description: "Quick mental puzzles: Logic, Memory, Pattern, Reasoning.",
    icon: Brain,
    time: "~5 mins",
    href: "/fun-zone/brain-break",
    colorClass: "bg-purple-500/10 text-purple-500",
    hoverClass: "group-hover:border-purple-500 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.1)]"
  },
  {
    id: "pop-up-quiz",
    title: "Pop-Up Quiz",
    description: "Test your knowledge on leadership and team dynamics.",
    icon: CheckSquare,
    time: "~4 mins",
    href: "/fun-zone/pop-up-quiz",
    colorClass: "bg-brand-emerald/10 text-brand-emerald",
    hoverClass: "group-hover:border-brand-emerald group-hover:shadow-[0_0_15px_rgba(16,185,129,0.1)]"
  }
]

export default function FunZonePage() {
  return (
    <Section className="min-h-screen py-16 md:py-24 bg-neutral-50 dark:bg-brand-black">
      <div className="mb-16 max-w-3xl text-center mx-auto fade-in-on-scroll is-visible">
        <div className="w-16 h-16 bg-brand-emerald/10 text-brand-emerald rounded-full flex items-center justify-center mx-auto mb-6">
          <Gamepad2 size={32} />
        </div>
        <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4">
          Fun Zone
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          Take a break and test your management instincts with these interactive mini-games and quizzes.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto fade-in-on-scroll is-visible">
        {ACTIVITIES.map((activity) => (
          <Link key={activity.id} href={activity.href} className="group outline-none">
            <Card className={`p-8 h-full flex flex-col transition-all duration-300 border-neutral-200 dark:border-neutral-800 ${activity.hoverClass}`}>
              <div className="flex items-start justify-between mb-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${activity.colorClass}`}>
                  <activity.icon size={24} />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full">
                  {activity.time}
                </span>
              </div>
              <h2 className="font-heading text-2xl font-bold text-neutral-900 dark:text-white mb-3">
                {activity.title}
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6 flex-1">
                {activity.description}
              </p>
              <div className="mt-auto">
                <span className="inline-flex items-center text-sm font-semibold text-neutral-900 dark:text-white group-hover:text-brand-emerald transition-colors">
                  Play now &rarr;
                </span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </Section>
  )
}

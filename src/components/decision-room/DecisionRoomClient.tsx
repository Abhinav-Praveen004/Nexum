"use client"

import { useState } from "react"
import { Card } from "@/components/shared/Card"
import { Button } from "@/components/shared/Button"
import { ArrowRight, RotateCcw, CheckCircle2, MessageSquare } from "lucide-react"

type Option = {
  id: string
  text: string
  explanation: string
}

type Scenario = {
  id: number
  title: string
  situation: string
  options: Option[]
  reflectionQuestion: string
}

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    title: "The Missed Deadline",
    situation: "A team member has failed to complete an important task before a deadline. The rest of the team's work is now affected. As the team leader, what would you do?",
    options: [
      {
        id: "A",
        text: "Reassign their work immediately to another team member.",
        explanation: "Keeps the deadline on track for the rest of the team, but can undermine the original member's ownership and morale, and the new owner may lack full context. Tends to work best when the task is time-critical and a capable teammate has spare capacity."
      },
      {
        id: "B",
        text: "Speak privately with the team member to understand what happened.",
        explanation: "Shows respect and can uncover the real cause — overload, unclear scope, a personal issue — while preserving trust. Takes time you may not have, and doesn't immediately fix the schedule. Tends to work best when there's some slack and the relationship matters."
      },
      {
        id: "C",
        text: "Give the team member a short extension while adjusting the team's schedule.",
        explanation: "Balances fairness to the individual with the team's need to keep moving, and shows flexibility. Can shift the delay onto other people's timelines and may set a precedent if it happens again. Tends to work best when the cause is understandable and appears to be one-off."
      },
      {
        id: "D",
        text: "Complete the task yourself to avoid further delays.",
        explanation: "Guarantees it gets done and is fastest short-term. Doesn't build the team's own capability, adds to the leader's workload, and avoids the root cause. Best treated as a last resort under extreme time pressure."
      }
    ],
    reflectionQuestion: "Would your decision change if this was the team member's first missed deadline versus a repeated pattern?"
  },
  {
    id: 2,
    title: "The Team Conflict",
    situation: "Two team members disagree about how to complete an important project. Their disagreement is slowing down the group. As the team leader, what would you do?",
    options: [
      {
        id: "A",
        text: "Step in and make the final decision yourself to keep the project moving.",
        explanation: "Fast, and removes the immediate bottleneck. May leave one or both members feeling unheard, and the leader takes full responsibility if it doesn't work out. Best when time pressure is severe."
      },
      {
        id: "B",
        text: "Bring both members together for a structured conversation to understand each perspective and find common ground.",
        explanation: "Builds trust and often produces a stronger combined solution; models healthy conflict resolution. Takes more time and real facilitation skill, and can stall if the disagreement is more personal than practical."
      },
      {
        id: "C",
        text: "Ask the wider team to weigh in and help decide.",
        explanation: "Shares ownership of the decision and surfaces other viewpoints. Can turn a two-person disagreement into a bigger group issue, and a majority view isn't always the best technical choice."
      },
      {
        id: "D",
        text: "Let the two members try to resolve it privately before stepping in.",
        explanation: "Builds their own conflict-resolution skills without undermining their autonomy. Risks losing more time if they can't resolve it themselves. Best when the relationship matters long-term and there's some schedule slack."
      }
    ],
    reflectionQuestion: "What would change your answer here — the deadline pressure, the working relationship between the two members, or something else?"
  },
  {
    id: 3,
    title: "The Creative but Unreliable Member",
    situation: "A team member regularly contributes creative ideas but often fails to complete assigned work on time. As the team leader, how would you respond?",
    options: [
      {
        id: "A",
        text: "Reduce their responsibilities to lower-pressure creative tasks and reassign deadline-critical work elsewhere.",
        explanation: "Protects deadlines and still uses their creative strength, but can feel like a demotion and doesn't address the reliability issue itself."
      },
      {
        id: "B",
        text: "Have a direct conversation about the pattern and ask what's getting in the way of finishing work on time.",
        explanation: "Treats them as a full team member and may uncover a fixable cause. Requires an honest, non-confrontational conversation, and builds accountability only with ongoing follow-up."
      },
      {
        id: "C",
        text: "Pair them with a more deadline-focused teammate on shared tasks.",
        explanation: "Combines creative input with follow-through, and can become a natural mentoring dynamic. Can feel like being \"managed\" by a peer, and only works if both people are comfortable with the pairing."
      },
      {
        id: "D",
        text: "Set smaller, more frequent check-in deadlines instead of one long deadline.",
        explanation: "Catches delays early and gives natural moments to course-correct. Adds oversight work for the leader, and can feel like micromanagement if not framed well."
      }
    ],
    reflectionQuestion: "Would your response change if this had happened once versus several times in a row?"
  }
]

export function DecisionRoomClient() {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0)
  const [choices, setChoices] = useState<Record<number, string>>({}) // scenario id -> option id
  const [isFinished, setIsFinished] = useState(false)

  const scenario = SCENARIOS[currentScenarioIndex]
  const selectedOptionId = choices[scenario?.id]
  const selectedOption = scenario?.options.find(opt => opt.id === selectedOptionId)

  const handleSelectOption = (optionId: string) => {
    setChoices(prev => ({ ...prev, [scenario.id]: optionId }))
  }

  const handleNext = () => {
    if (currentScenarioIndex < SCENARIOS.length - 1) {
      setCurrentScenarioIndex(prev => prev + 1)
    } else {
      setIsFinished(true)
    }
  }

  const handleRestartScenario = () => {
    setChoices(prev => {
      const next = { ...prev }
      delete next[scenario.id]
      return next
    })
  }

  const handleRestartAll = () => {
    setChoices({})
    setCurrentScenarioIndex(0)
    setIsFinished(false)
  }

  if (isFinished) {
    return (
      <Card className="p-8 md:p-12 border-brand-emerald">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-brand-emerald/10 text-brand-emerald rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="font-heading text-3xl font-bold text-neutral-900 dark:text-white mb-4">
            Reflection Complete
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto text-lg">
            Thank you for exploring these leadership scenarios. Here is a recap of the approaches you leaned toward:
          </p>
        </div>

        <div className="space-y-6 mb-12">
          {SCENARIOS.map((scen, idx) => {
            const pickedOptionId = choices[scen.id]
            const pickedOption = scen.options.find(opt => opt.id === pickedOptionId)
            return (
              <div key={scen.id} className="p-6 bg-neutral-50 dark:bg-neutral-900/50 rounded-xl border border-neutral-200 dark:border-neutral-800">
                <h3 className="font-heading text-lg font-bold text-neutral-900 dark:text-white mb-2">
                  Scenario {idx + 1}: {scen.title}
                </h3>
                <p className="text-neutral-700 dark:text-neutral-300 font-medium flex items-start gap-3">
                  <span className="text-brand-emerald shrink-0 bg-brand-emerald/10 w-6 h-6 flex items-center justify-center rounded-full text-sm">
                    {pickedOptionId}
                  </span>
                  {pickedOption?.text}
                </p>
              </div>
            )
          })}
        </div>

        <div className="text-center">
          <p className="text-neutral-700 dark:text-neutral-300 italic text-lg mb-8 max-w-2xl mx-auto">
            Discuss your choices with your classmates—you might be surprised by how different their perspectives and chosen trade-offs are!
          </p>
          <Button onClick={handleRestartAll} variant="secondary" className="gap-2">
            <RotateCcw size={16} /> Restart entire Decision Room
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      {/* Progress Header */}
      <div className="bg-neutral-50 dark:bg-neutral-900 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <span className="text-brand-emerald font-semibold uppercase tracking-wider text-sm mb-1 block">
            Scenario {currentScenarioIndex + 1} of {SCENARIOS.length}
          </span>
          <h2 className="font-heading text-2xl font-bold text-neutral-900 dark:text-white">
            {scenario.title}
          </h2>
        </div>
        <Button variant="ghost" onClick={handleRestartAll} className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white gap-2 text-sm shrink-0">
          <RotateCcw size={14} /> Restart entire Decision Room
        </Button>
      </div>

      <div className="p-6 md:p-8">
        <p className="text-lg md:text-xl text-neutral-800 dark:text-neutral-200 mb-8 leading-relaxed font-medium">
          {scenario.situation}
        </p>

        {!selectedOptionId ? (
          <div className="grid gap-4">
            {scenario.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleSelectOption(option.id)}
                className="w-full text-left p-6 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-brand-emerald dark:hover:border-brand-emerald hover:bg-brand-emerald/5 transition-all outline-none focus-visible:ring-2 focus-visible:ring-brand-emerald group flex gap-4 items-start"
              >
                <div className="w-8 h-8 shrink-0 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 flex items-center justify-center font-bold font-heading group-hover:bg-brand-emerald group-hover:text-white transition-colors">
                  {option.id}
                </div>
                <span className="text-neutral-700 dark:text-neutral-300 font-medium pt-1">
                  {option.text}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Selected Choice Banner */}
            <div className="p-6 rounded-xl border border-brand-emerald bg-brand-emerald/5 flex gap-4 items-start">
              <div className="w-8 h-8 shrink-0 rounded-full bg-brand-emerald text-white flex items-center justify-center font-bold font-heading">
                {selectedOption?.id}
              </div>
              <span className="text-neutral-900 dark:text-white font-medium pt-1">
                {selectedOption?.text}
              </span>
            </div>

            {/* Explanation */}
            <div className="space-y-6">
              <div className="bg-neutral-50 dark:bg-neutral-900/50 p-6 rounded-xl">
                <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-neutral-500 mb-3">
                  Trade-offs & Context
                </h3>
                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {selectedOption?.explanation}
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 p-6 rounded-xl">
                <div className="flex gap-3 items-start">
                  <MessageSquare className="shrink-0 text-blue-500 mt-1" size={20} />
                  <div>
                    <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
                      Reflection Question
                    </h3>
                    <p className="text-blue-900 dark:text-blue-200 italic font-medium leading-relaxed">
                      {scenario.reflectionQuestion}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-neutral-200 dark:border-neutral-800">
              <Button variant="ghost" onClick={handleRestartScenario} className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white gap-2">
                <RotateCcw size={16} /> Restart this scenario
              </Button>
              <Button variant="primary" onClick={handleNext} className="gap-2 w-full sm:w-auto">
                {currentScenarioIndex < SCENARIOS.length - 1 ? (
                  <>Next Scenario <ArrowRight size={16} /></>
                ) : (
                  <>See Final Reflection <ArrowRight size={16} /></>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

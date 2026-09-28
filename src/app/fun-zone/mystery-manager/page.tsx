"use client"

import { useState } from "react"
import Link from "next/link"
import { Section } from "@/components/shared/Section"
import { Card } from "@/components/shared/Card"
import { Button } from "@/components/shared/Button"
import { ArrowLeft, Search, CheckCircle2, XCircle } from "lucide-react"
import { STORY, CLUES, QUESTION, OPTIONS, FULL_EXPLANATION } from "@/data/fun-zone/mystery-manager"

export default function MysteryManager() {
  const [revealedClues, setRevealedClues] = useState<number[]>([])
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)

  const handleReveal = (id: number) => {
    if (!revealedClues.includes(id)) {
      setRevealedClues([...revealedClues, id])
    }
  }

  const handleRestart = () => {
    setRevealedClues([])
    setSelectedOptionId(null)
  }

  const selectedOption = OPTIONS.find(o => o.id === selectedOptionId)
  const canAnswer = revealedClues.length >= 3

  return (
    <Section className="min-h-screen py-12 bg-neutral-50 dark:bg-brand-black">
      <div className="max-w-4xl mx-auto mb-8">
        <Link 
          href="/fun-zone" 
          className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-brand-emerald transition-colors font-medium mb-8"
        >
          <ArrowLeft size={20} /> Back to Fun Zone
        </Link>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center shrink-0">
            <Search size={24} />
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white">
            Mystery Manager
          </h1>
        </div>

        <Card className="p-6 md:p-8 border-blue-500/20 mb-8">
          <h2 className="font-heading text-xl font-bold mb-3">The Case of the Slipped Launch</h2>
          <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed font-medium">
            {STORY}
          </p>
        </Card>

        <div className="mb-8">
          <div className="flex justify-between items-end mb-4">
            <h2 className="font-heading text-xl font-bold text-neutral-900 dark:text-white">
              Clue Board
            </h2>
            <span className="text-sm font-semibold text-neutral-500">
              {revealedClues.length} of {CLUES.length} clues examined
            </span>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-4">
            {CLUES.map((clue) => {
              const isRevealed = revealedClues.includes(clue.id)
              return (
                <button
                  key={clue.id}
                  onClick={() => handleReveal(clue.id)}
                  disabled={isRevealed || !!selectedOptionId}
                  className={`relative p-6 rounded-xl border text-left transition-all duration-300 outline-none ${
                    isRevealed 
                      ? "border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-sm" 
                      : "border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-100/50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:border-blue-400 focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer"
                  }`}
                >
                  {!isRevealed ? (
                    <div className="flex items-center gap-3 text-neutral-500">
                      <Search size={20} />
                      <span className="font-medium">Tap to reveal Clue {clue.id}</span>
                    </div>
                  ) : (
                    <div className="animate-in fade-in duration-300">
                      <span className="inline-block text-xs font-bold uppercase tracking-wider text-blue-500 mb-2">
                        Clue {clue.id}
                      </span>
                      <p className="text-neutral-800 dark:text-neutral-200 font-medium">
                        {clue.text}
                      </p>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Question Area */}
        <div className={`transition-opacity duration-500 ${canAnswer ? "opacity-100" : "opacity-50 pointer-events-none"}`}>
          <Card className="p-6 md:p-8">
            <h2 className="font-heading text-xl font-bold text-neutral-900 dark:text-white mb-6">
              {QUESTION}
            </h2>
            
            {!canAnswer && (
              <div className="mb-6 p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg text-neutral-600 dark:text-neutral-400 text-sm flex items-center gap-2">
                <Search size={16} /> Examine at least 3 clues to unlock the question.
              </div>
            )}

            {!selectedOptionId ? (
              <div className="grid gap-3">
                {OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedOptionId(opt.id)}
                    disabled={!canAnswer}
                    className="w-full text-left p-4 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all font-medium text-neutral-700 dark:text-neutral-300 flex gap-4 items-start outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    <span className="shrink-0 w-6 h-6 rounded bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-sm font-bold">
                      {opt.id}
                    </span>
                    {opt.text}
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className={`p-6 rounded-xl border flex gap-4 items-start ${selectedOption?.isBest ? 'border-brand-emerald bg-brand-emerald/5' : 'border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900'}`}>
                  {selectedOption?.isBest ? (
                    <CheckCircle2 className="shrink-0 text-brand-emerald mt-0.5" size={24} />
                  ) : (
                    <XCircle className="shrink-0 text-neutral-400 mt-0.5" size={24} />
                  )}
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-white mb-1">
                      You chose: {selectedOption?.text}
                    </h3>
                    <p className={`font-medium ${selectedOption?.isBest ? 'text-brand-emerald' : 'text-neutral-600 dark:text-neutral-400'}`}>
                      {selectedOption?.revealText}
                    </p>
                  </div>
                </div>

                <div className="p-6 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl">
                  <h3 className="font-heading text-sm font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
                    The Full Picture
                  </h3>
                  <p className="text-blue-900 dark:text-blue-200 leading-relaxed font-medium">
                    {FULL_EXPLANATION}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                  <Button onClick={handleRestart} variant="primary" className="w-full sm:w-auto">
                    Play again
                  </Button>
                  <Button asChild variant="secondary" className="w-full sm:w-auto">
                    <Link href="/fun-zone">Back to Fun Zone</Link>
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </Section>
  )
}

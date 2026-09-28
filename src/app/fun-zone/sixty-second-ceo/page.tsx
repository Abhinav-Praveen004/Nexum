"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Section } from "@/components/shared/Section"
import { Card } from "@/components/shared/Card"
import { Button } from "@/components/shared/Button"
import { ArrowLeft, Timer as TimerIcon, Play, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react"
import { SITUATIONS, Situation, Option } from "@/data/fun-zone/sixty-second-ceo"

const TIME_LIMIT = 15000 // 15 seconds in ms

export default function SixtySecondCEO() {
  const [started, setStarted] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)
  
  // State for current turn
  const [isAnswering, setIsAnswering] = useState(false)
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const [timedOut, setTimedOut] = useState(false)
  
  // History tracking
  const [history, setHistory] = useState<Record<number, { optionId: string | null, timedOut: boolean }>>({})
  const [isFinished, setIsFinished] = useState(false)

  // Timer refs
  const endTimeRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)

  // Clear timer helper
  const clearCurrentTimer = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    endTimeRef.current = null
  }

  // Timer effect
  useEffect(() => {
    if (!started || isFinished || isAnswering) {
      clearCurrentTimer()
      return
    }

    const startTimer = () => {
      endTimeRef.current = Date.now() + TIME_LIMIT
      
      const tick = () => {
        if (!endTimeRef.current) return
        
        const remaining = Math.max(0, endTimeRef.current - Date.now())
        setTimeLeft(remaining)
        
        if (remaining === 0) {
          handleTimeout()
        } else {
          rafRef.current = requestAnimationFrame(tick)
        }
      }
      
      rafRef.current = requestAnimationFrame(tick)
    }

    // Only start timer if we aren't already answering a question
    startTimer()

    return clearCurrentTimer
  }, [started, currentIndex, isFinished, isAnswering])

  const handleTimeout = () => {
    clearCurrentTimer()
    setTimedOut(true)
    setIsAnswering(true)
    const currentId = SITUATIONS[currentIndex].id
    setHistory(prev => ({ ...prev, [currentId]: { optionId: null, timedOut: true } }))
  }

  const handleSelect = (optionId: string) => {
    clearCurrentTimer()
    setSelectedOptionId(optionId)
    setIsAnswering(true)
    const currentId = SITUATIONS[currentIndex].id
    setHistory(prev => ({ ...prev, [currentId]: { optionId, timedOut: false } }))
  }

  const handleNext = () => {
    setIsAnswering(false)
    setSelectedOptionId(null)
    setTimedOut(false)
    setTimeLeft(TIME_LIMIT)

    if (currentIndex < SITUATIONS.length - 1) {
      setCurrentIndex(prev => prev + 1)
    } else {
      setIsFinished(true)
    }
  }

  const handleRestart = () => {
    setIsFinished(false)
    setStarted(false)
    setCurrentIndex(0)
    setIsAnswering(false)
    setSelectedOptionId(null)
    setTimedOut(false)
    setHistory({})
    setTimeLeft(TIME_LIMIT)
  }

  if (!started) {
    return (
      <Section className="min-h-screen py-12 bg-neutral-50 dark:bg-brand-black flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <Link 
            href="/fun-zone" 
            className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-orange-500 transition-colors font-medium mb-8"
          >
            <ArrowLeft size={20} /> Back to Fun Zone
          </Link>
          <Card className="p-8 md:p-12 text-center border-orange-500/20">
            <div className="w-20 h-20 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <TimerIcon size={40} />
            </div>
            <h1 className="font-heading text-4xl font-bold text-neutral-900 dark:text-white mb-4">
              60-Second CEO
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8 max-w-lg mx-auto leading-relaxed">
              You will face 4 management situations. You have exactly 15 seconds to make a decision for each. 
              The timer stops while you read the feedback.
            </p>
            <Button onClick={() => setStarted(true)} className="bg-orange-500 hover:bg-orange-600 text-white gap-2 text-lg px-8 py-6">
              <Play size={20} /> Start the Clock
            </Button>
          </Card>
        </div>
      </Section>
    )
  }

  if (isFinished) {
    const successCount = Object.values(history).filter(h => !h.timedOut).length
    return (
      <Section className="min-h-screen py-12 bg-neutral-50 dark:bg-brand-black">
        <div className="max-w-3xl mx-auto">
          <Card className="p-8 md:p-12 border-orange-500/20">
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="font-heading text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                Time's Up!
              </h2>
              <p className="text-lg text-neutral-600 dark:text-neutral-400">
                You decided in time on {successCount} of {SITUATIONS.length} situations.
              </p>
            </div>

            <div className="space-y-6 mb-10">
              {SITUATIONS.map((sit, idx) => {
                const rec = history[sit.id]
                const opt = rec?.optionId ? sit.options.find(o => o.id === rec.optionId) : null
                
                return (
                  <div key={sit.id} className="p-5 bg-neutral-100 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
                    <h3 className="font-heading font-bold mb-2">Situation {idx + 1}</h3>
                    {rec?.timedOut ? (
                      <p className="text-orange-600 dark:text-orange-400 font-medium flex items-center gap-2">
                        <AlertCircle size={16} /> Ran out of time
                      </p>
                    ) : (
                      <p className="text-brand-emerald font-medium flex items-start gap-2">
                        <CheckCircle2 size={16} className="shrink-0 mt-1" />
                        <span>{opt?.text}</span>
                      </p>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button onClick={handleRestart} variant="primary" className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white">
                Play again
              </Button>
              <Button asChild variant="secondary" className="w-full sm:w-auto">
                <Link href="/fun-zone">Back to Fun Zone</Link>
              </Button>
            </div>
          </Card>
        </div>
      </Section>
    )
  }

  const currentSituation = SITUATIONS[currentIndex]
  const selectedOption = currentSituation.options.find(o => o.id === selectedOptionId)
  
  // Calculate timer visual
  const percentage = (timeLeft / TIME_LIMIT) * 100
  const secondsLeft = Math.ceil(timeLeft / 1000)

  return (
    <Section className="min-h-screen py-8 md:py-12 bg-neutral-50 dark:bg-brand-black">
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/fun-zone" 
          className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-orange-500 transition-colors font-medium mb-6"
        >
          <ArrowLeft size={20} /> Back to Fun Zone
        </Link>
        
        <Card className="overflow-hidden border-orange-500/20">
          <div className="bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-orange-500 font-semibold uppercase tracking-wider text-sm mb-1 block">
                Situation {currentIndex + 1} of {SITUATIONS.length}
              </span>
            </div>
            
            {/* Timer visual */}
            <div className={`flex items-center gap-3 bg-white dark:bg-black px-4 py-2 rounded-full shadow-sm border ${secondsLeft <= 5 && !isAnswering ? 'border-red-500 text-red-500' : 'border-neutral-200 dark:border-neutral-800'}`}>
              <TimerIcon size={18} className={secondsLeft <= 5 && !isAnswering ? 'animate-pulse' : ''} />
              <div className="font-mono font-bold text-lg w-6 text-center">
                {secondsLeft}
              </div>
              <div className="w-24 h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-100 ease-linear ${secondsLeft <= 5 ? 'bg-red-500' : 'bg-orange-500'}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-white mb-8 leading-relaxed">
              {currentSituation.situation}
            </h2>

            {!isAnswering ? (
              <div className="grid gap-4">
                {currentSituation.options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelect(opt.id)}
                    className="text-left p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all font-medium text-neutral-700 dark:text-neutral-300 outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                {timedOut ? (
                  <div className="p-6 rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/10 text-red-800 dark:text-red-200">
                    <h3 className="font-heading font-bold text-lg mb-2 flex items-center gap-2">
                      <AlertCircle size={20} /> Time's up.
                    </h3>
                    <p className="font-medium">Not deciding is also a decision, and it has trade-offs too.</p>
                  </div>
                ) : (
                  <div className="p-6 rounded-xl border border-orange-500/30 bg-orange-50 dark:bg-orange-900/10">
                    <h3 className="font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                      <CheckCircle2 className="text-orange-500" size={20} /> You chose:
                    </h3>
                    <p className="font-medium text-neutral-700 dark:text-neutral-300 mb-4">{selectedOption?.text}</p>
                    <div className="pt-4 border-t border-orange-200 dark:border-orange-800/30">
                      <span className="block text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 mb-1">Trade-off</span>
                      <p className="text-neutral-800 dark:text-neutral-200">{selectedOption?.explanation}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end pt-4">
                  <Button onClick={handleNext} className="bg-neutral-900 text-white dark:bg-white dark:text-black">
                    {currentIndex < SITUATIONS.length - 1 ? 'Next Situation' : 'See Results'} <ArrowRight size={16} className="ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </Section>
  )
}

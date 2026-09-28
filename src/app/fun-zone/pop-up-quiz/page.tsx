"use client"

import { useState } from "react"
import Link from "next/link"
import { Section } from "@/components/shared/Section"
import { Card } from "@/components/shared/Card"
import { Button } from "@/components/shared/Button"
import { ArrowLeft, CheckSquare, Play, CheckCircle2, XCircle, ArrowRight } from "lucide-react"
import { QUIZ_QUESTIONS } from "@/data/fun-zone/pop-up-quiz"

const DISCLAIMER = "This quiz is for entertainment and learning. It is not a scientifically validated personality or leadership assessment."

export default function PopUpQuiz() {
  const [started, setStarted] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const [history, setHistory] = useState<Record<string, string>>({}) // questionId -> optionId
  const [isFinished, setIsFinished] = useState(false)

  const handleStart = () => {
    setStarted(true)
    setCurrentIndex(0)
    setHistory({})
    setIsFinished(false)
    setSelectedOptionId(null)
  }

  const handleNext = () => {
    if (currentIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentIndex(c => c + 1)
      setSelectedOptionId(null)
    } else {
      setIsFinished(true)
    }
  }

  const handleSelect = (optionId: string) => {
    setSelectedOptionId(optionId)
    setHistory(prev => ({ ...prev, [QUIZ_QUESTIONS[currentIndex].id]: optionId }))
  }

  if (!started) {
    return (
      <Section className="min-h-screen py-12 bg-neutral-50 dark:bg-brand-black flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <Link 
            href="/fun-zone" 
            className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-brand-emerald transition-colors font-medium mb-8"
          >
            <ArrowLeft size={20} /> Back to Fun Zone
          </Link>
          
          <Card className="p-8 md:p-12 text-center border-brand-emerald/20">
            <div className="w-20 h-20 bg-brand-emerald/10 text-brand-emerald rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckSquare size={40} />
            </div>
            <h1 className="font-heading text-4xl font-bold text-neutral-900 dark:text-white mb-4">
              Pop-Up Quiz
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8 max-w-lg mx-auto leading-relaxed">
              Test your knowledge on leadership, communication, and team dynamics.
            </p>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 p-4 rounded-lg mb-8 text-sm text-yellow-800 dark:text-yellow-200 font-medium text-left">
              <strong>Note:</strong> {DISCLAIMER}
            </div>

            <Button onClick={handleStart} variant="primary" className="gap-2 text-lg px-8 py-6">
              <Play size={20} /> Start Quiz
            </Button>
          </Card>
        </div>
      </Section>
    )
  }

  if (isFinished) {
    const score = Object.entries(history).reduce((acc, [qId, ansId]) => {
      const q = QUIZ_QUESTIONS.find(q => q.id === qId)
      return acc + (q?.correctOptionId === ansId ? 1 : 0)
    }, 0)
    
    let message = ""
    if (score <= 3) message = "A great starting point, and every manager keeps learning."
    else if (score <= 6) message = "Solid instincts."
    else message = "Strong grasp of the basics."

    return (
      <Section className="min-h-screen py-12 bg-neutral-50 dark:bg-brand-black">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl font-bold text-neutral-900 dark:text-white mb-2">
              Quiz Complete
            </h2>
            <div className="inline-block bg-brand-emerald/10 text-brand-emerald px-6 py-2 rounded-full font-heading font-bold text-2xl mb-4">
              {score} / {QUIZ_QUESTIONS.length}
            </div>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 font-medium">
              {message}
            </p>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 p-4 rounded-lg mb-10 text-sm text-yellow-800 dark:text-yellow-200 font-medium text-center">
            <strong>Note:</strong> {DISCLAIMER}
          </div>

          <Card className="p-6 md:p-8 border-brand-emerald/20 mb-8">
            <h3 className="font-heading text-xl font-bold mb-6 flex items-center gap-2">
              <CheckSquare className="text-brand-emerald" /> Review Answers
            </h3>
            
            <div className="space-y-8">
              {QUIZ_QUESTIONS.map((q, idx) => {
                const ans = history[q.id]
                const isCorrect = ans === q.correctOptionId
                const pickedText = q.options.find(o => o.id === ans)?.text
                const correctText = q.options.find(o => o.id === q.correctOptionId)?.text
                
                return (
                  <div key={q.id} className="pb-8 border-b border-neutral-200 dark:border-neutral-800 last:border-0 last:pb-0">
                    <p className="font-semibold text-neutral-900 dark:text-white mb-4">
                      {idx + 1}. {q.question}
                    </p>
                    
                    <div className="grid gap-3 mb-4">
                      <div className={`p-4 rounded-lg border ${isCorrect ? 'bg-brand-emerald/10 border-brand-emerald/30 text-brand-emerald font-medium flex items-center gap-2' : 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 font-medium flex items-center gap-2'}`}>
                        {isCorrect ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                        You answered: {pickedText}
                      </div>
                      
                      {!isCorrect && (
                        <div className="p-4 rounded-lg border bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 font-medium flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                          <CheckCircle2 size={18} className="text-brand-emerald" />
                          Correct answer: {correctText}
                        </div>
                      )}
                    </div>
                    
                    <div className="pl-4 border-l-2 border-brand-emerald/30">
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {q.explanation}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button onClick={handleStart} variant="primary" className="w-full sm:w-auto">
              Retake quiz
            </Button>
            <Button asChild variant="secondary" className="w-full sm:w-auto">
              <Link href="/fun-zone">Back to Fun Zone</Link>
            </Button>
          </div>
        </div>
      </Section>
    )
  }

  const q = QUIZ_QUESTIONS[currentIndex]
  const isCorrect = selectedOptionId === q.correctOptionId

  return (
    <Section className="min-h-screen py-12 bg-neutral-50 dark:bg-brand-black">
      <div className="max-w-3xl mx-auto flex flex-col min-h-[60vh]">
        <Link 
          href="/fun-zone" 
          className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-brand-emerald transition-colors font-medium mb-6 self-start outline-none focus-visible:ring-2 focus-visible:ring-brand-emerald rounded-md"
        >
          <ArrowLeft size={20} /> Back to Fun Zone
        </Link>
        
        <Card className="flex-1 flex flex-col overflow-hidden border-brand-emerald/20">
          <div className="bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 p-6 flex items-center justify-between gap-4">
            <span className="text-brand-emerald font-semibold uppercase tracking-wider text-sm block">
              Question {currentIndex + 1} of {QUIZ_QUESTIONS.length}
            </span>
            <span className="text-xs font-bold bg-neutral-200 dark:bg-neutral-800 text-neutral-500 px-2 py-1 rounded">
              {q.category}
            </span>
          </div>

          <div className="p-6 md:p-8 flex-1 flex flex-col">
            <h2 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-white mb-8 leading-relaxed">
              {q.question}
            </h2>

            {!selectedOptionId ? (
              <div className="grid gap-4 mt-auto">
                {q.options.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelect(opt.id)}
                    className="text-left p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-brand-emerald hover:bg-brand-emerald/5 transition-all font-medium text-neutral-700 dark:text-neutral-300 outline-none focus-visible:ring-2 focus-visible:ring-brand-emerald flex gap-4 items-start group"
                  >
                    <span className="shrink-0 w-6 h-6 rounded bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-sm font-bold group-hover:bg-brand-emerald group-hover:text-white transition-colors">
                      {opt.id}
                    </span>
                    <span className="pt-0.5">{opt.text}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="mt-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className={`p-6 rounded-xl border flex gap-4 items-start ${isCorrect ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800' : 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'}`}>
                  {isCorrect ? <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" /> : <XCircle className="text-red-500 shrink-0 mt-0.5" />}
                  <div>
                    <p className={`font-bold mb-2 ${isCorrect ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
                      {isCorrect ? 'Correct!' : 'Incorrect'}
                    </p>
                    <p className="text-neutral-800 dark:text-neutral-200 leading-relaxed font-medium">
                      {q.explanation}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button onClick={handleNext} variant="primary" className="gap-2">
                    {currentIndex < QUIZ_QUESTIONS.length - 1 ? 'Next' : 'See Results'} <ArrowRight size={16} />
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

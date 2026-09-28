"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Section } from "@/components/shared/Section"
import { Card } from "@/components/shared/Card"
import { Button } from "@/components/shared/Button"
import { ArrowLeft, Brain, CheckCircle2, XCircle, Play, Square, Circle, Triangle, Star } from "lucide-react"
import { CATEGORIES, Category, Puzzle } from "@/data/fun-zone/brain-break"

export default function BrainBreak() {
  const [activeCategory, setActiveCategory] = useState<Category | null>(null)

  if (!activeCategory) {
    return (
      <Section className="min-h-screen py-12 bg-neutral-50 dark:bg-brand-black">
        <div className="max-w-4xl mx-auto">
          <Link 
            href="/fun-zone" 
            className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-purple-500 transition-colors font-medium mb-8"
          >
            <ArrowLeft size={20} /> Back to Fun Zone
          </Link>
          
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-purple-500/10 text-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Brain size={40} />
            </div>
            <h1 className="font-heading text-4xl font-bold text-neutral-900 dark:text-white mb-4">
              Brain Break
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Select a category to stretch your mental muscles.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat)}
                className="p-6 md:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-purple-500 hover:shadow-md transition-all outline-none focus-visible:ring-2 focus-visible:ring-purple-500 text-left flex flex-col items-center gap-4 group"
              >
                <div className="font-heading text-xl font-bold text-neutral-900 dark:text-white group-hover:text-purple-500 transition-colors">
                  {cat.name}
                </div>
                <div className="text-sm font-medium text-neutral-500">
                  {cat.isMemory ? "Interactive Game" : `${cat.puzzles.length} Puzzles`}
                </div>
              </button>
            ))}
          </div>
        </div>
      </Section>
    )
  }

  return (
    <Section className="min-h-screen py-12 bg-neutral-50 dark:bg-brand-black flex flex-col">
      <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col">
        <button
          onClick={() => setActiveCategory(null)}
          className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-purple-500 transition-colors font-medium mb-8 self-start outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded-md"
        >
          <ArrowLeft size={20} /> Back to Categories
        </button>

        {activeCategory.isMemory ? (
          <MemoryGame />
        ) : (
          <PuzzleFlow category={activeCategory} onExit={() => setActiveCategory(null)} />
        )}
      </div>
    </Section>
  )
}

function PuzzleFlow({ category, onExit }: { category: Category, onExit: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  
  const puzzle = category.puzzles[currentIndex]
  const isFinished = currentIndex >= category.puzzles.length

  if (isFinished) {
    return (
      <Card className="p-8 text-center border-purple-500/20 m-auto w-full">
        <CheckCircle2 size={48} className="text-purple-500 mx-auto mb-4" />
        <h2 className="font-heading text-2xl font-bold mb-2">Category Complete!</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-8">You've finished all puzzles in {category.name}.</p>
        <Button onClick={onExit} className="bg-purple-500 hover:bg-purple-600 text-white">
          Try another category
        </Button>
      </Card>
    )
  }

  const isCorrect = selectedOption === puzzle.correctOption

  return (
    <Card className="p-6 md:p-8 border-purple-500/20 flex-1 flex flex-col">
      <div className="mb-6 flex justify-between items-center text-sm font-semibold text-purple-500 uppercase tracking-wider">
        <span>{category.name}</span>
        <span>Puzzle {currentIndex + 1} of {category.puzzles.length}</span>
      </div>
      
      <h2 className="text-lg md:text-xl font-bold text-neutral-900 dark:text-white mb-8 leading-relaxed">
        {puzzle.question}
      </h2>

      {!selectedOption ? (
        <div className="grid gap-3 mt-auto">
          {puzzle.options.map((opt) => (
            <button
              key={opt}
              onClick={() => setSelectedOption(opt)}
              className="text-left p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all font-medium text-neutral-700 dark:text-neutral-300 outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
            >
              {opt}
            </button>
          ))}
        </div>
      ) : (
        <div className="mt-auto space-y-6 animate-in fade-in">
          <div className={`p-5 rounded-xl border flex gap-3 items-start ${isCorrect ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800' : 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'}`}>
            {isCorrect ? <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" /> : <XCircle className="text-red-500 shrink-0 mt-0.5" />}
            <div>
              <p className={`font-bold mb-2 ${isCorrect ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
                {isCorrect ? 'Correct!' : 'Not quite.'}
              </p>
              <p className="text-neutral-800 dark:text-neutral-200 text-sm leading-relaxed font-medium">
                {puzzle.explanation}
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-4">
            {!isCorrect && (
              <Button variant="ghost" onClick={() => setSelectedOption(null)}>Try again</Button>
            )}
            <Button onClick={() => { setSelectedOption(null); setCurrentIndex(c => c + 1) }} className="bg-purple-500 hover:bg-purple-600 text-white">
              Next Puzzle
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}

// Memory Game Components
const TILES = [
  { id: 0, color: 'bg-red-500', active: 'bg-red-300 scale-95', icon: Square, label: 'Square' },
  { id: 1, color: 'bg-blue-500', active: 'bg-blue-300 scale-95', icon: Circle, label: 'Circle' },
  { id: 2, color: 'bg-emerald-500', active: 'bg-emerald-300 scale-95', icon: Triangle, label: 'Triangle' },
  { id: 3, color: 'bg-yellow-500', active: 'bg-yellow-300 scale-95', icon: Star, label: 'Star' },
]

function MemoryGame() {
  const [sequence, setSequence] = useState<number[]>([])
  const [playerStep, setPlayerStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isShowingSequence, setIsShowingSequence] = useState(false)
  const [activeTile, setActiveTile] = useState<number | null>(null)
  const [gameOver, setGameOver] = useState(false)
  
  // Stats
  const [bestScore, setBestScore] = useState(0)

  const startGame = () => {
    setGameOver(false)
    setIsPlaying(true)
    const newSeq = Array.from({length: 3}, () => Math.floor(Math.random() * 4))
    setSequence(newSeq)
    setPlayerStep(0)
    playSequence(newSeq)
  }

  const nextRound = () => {
    const newSeq = Array.from({length: sequence.length + 1}, () => Math.floor(Math.random() * 4))
    setSequence(newSeq)
    setPlayerStep(0)
    setTimeout(() => playSequence(newSeq), 1000)
  }

  const playSequence = async (seq: number[]) => {
    setIsShowingSequence(true)
    await new Promise(r => setTimeout(r, 500))
    for (let i = 0; i < seq.length; i++) {
      setActiveTile(seq[i])
      await new Promise(r => setTimeout(r, 400))
      setActiveTile(null)
      await new Promise(r => setTimeout(r, 200))
    }
    setIsShowingSequence(false)
  }

  const handleTileClick = (id: number) => {
    if (!isPlaying || isShowingSequence || gameOver) return

    setActiveTile(id)
    setTimeout(() => setActiveTile(null), 200)

    if (id === sequence[playerStep]) {
      if (playerStep === sequence.length - 1) {
        // Round complete
        setIsShowingSequence(true) // prevent clicks
        nextRound()
      } else {
        setPlayerStep(s => s + 1)
      }
    } else {
      // Game over
      setGameOver(true)
      setIsPlaying(false)
      if (sequence.length - 1 > bestScore) {
        setBestScore(sequence.length - 1)
      }
    }
  }

  return (
    <Card className="p-6 md:p-8 border-purple-500/20 flex-1 flex flex-col items-center justify-center">
      <div className="mb-8 text-center">
        <h2 className="font-heading text-2xl font-bold mb-2">Sequence Memory</h2>
        <p className="text-neutral-500 dark:text-neutral-400">Watch the pattern, then repeat it.</p>
        
        {isPlaying && (
          <div className="mt-4 font-mono font-bold text-xl text-purple-500">
            Length: {sequence.length}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 md:gap-6 mb-8 w-full max-w-sm mx-auto">
        {TILES.map(tile => {
          const isActive = activeTile === tile.id
          return (
            <button
              key={tile.id}
              onClick={() => handleTileClick(tile.id)}
              disabled={isShowingSequence && !isActive} // disable if showing seq, unless it is the active one
              className={`aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 text-white transition-all duration-200 outline-none ${tile.color} ${isActive ? tile.active : 'opacity-80 hover:opacity-100'} ${isShowingSequence ? 'cursor-default' : 'cursor-pointer active:scale-95'}`}
              aria-label={tile.label}
            >
              <tile.icon size={48} className={isActive ? 'opacity-100' : 'opacity-90'} strokeWidth={2.5} />
            </button>
          )
        })}
      </div>

      {!isPlaying && (
        <div className="text-center animate-in fade-in">
          {gameOver && (
            <div className="mb-6 p-4 bg-neutral-100 dark:bg-neutral-900 rounded-xl">
              <p className="font-bold text-lg mb-1">Game Over!</p>
              <p className="text-neutral-600 dark:text-neutral-400 mb-1">Longest sequence: {sequence.length - 1}</p>
              <p className="text-neutral-600 dark:text-neutral-400 font-semibold">Best this session: {Math.max(bestScore, sequence.length - 1)}</p>
            </div>
          )}
          <Button onClick={startGame} className="bg-purple-500 hover:bg-purple-600 text-white gap-2 px-8 py-6 text-lg rounded-full">
            <Play size={20} /> {gameOver ? "Play Again" : "Start Game"}
          </Button>
        </div>
      )}
    </Card>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/shared/Card"
import { Image as ImageIcon, MapPin, Quote, X, Calendar } from "lucide-react"
import Image from "next/image"

type TimelineDay = {
  day_number: number
  title: string | null
  day_date: string | null
  summary: string | null
}

type TimelineEntry = {
  id: string
  day_number: number
  entry_type: 'activity' | 'milestone' | 'reflection'
  title: string
  description: string | null
  media_url: string | null
  caption: string | null
  reflection_author: string | null
  status: 'upcoming' | 'completed'
}

export function TimeCapsuleClient({ days, entries }: { days: TimelineDay[], entries: TimelineEntry[] }) {
  const [activeLightbox, setActiveLightbox] = useState<{ url: string, alt: string } | null>(null)

  // Keyboard support for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveLightbox(null)
    }
    if (activeLightbox) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeLightbox])

  const scrollToDay = (dayNum: number) => {
    const el = document.getElementById(`day-${dayNum}`)
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }

  return (
    <div className="max-w-4xl mx-auto relative">
      {/* Sticky Day Navigator */}
      <div className="sticky top-20 z-40 bg-white/90 dark:bg-brand-black/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 py-3 px-4 flex justify-center gap-4 mb-16 rounded-b-2xl md:rounded-full shadow-sm md:-mt-8 mx-auto w-fit">
        {[1, 2, 3, 4].map(num => (
          <button 
            key={num}
            onClick={() => scrollToDay(num)}
            className="text-sm font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 hover:text-brand-emerald transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand-emerald px-2 py-1 rounded"
          >
            Day {num}
          </button>
        ))}
      </div>

      <div className="space-y-24">
        {[1, 2, 3, 4].map(dayNum => {
          const dayMarker = days.find(d => d.day_number === dayNum)
          const dayEntries = entries.filter(e => e.day_number === dayNum)

          return (
            <div key={dayNum} id={`day-${dayNum}`} className="relative scroll-mt-32">
              {/* Vertical line connecting days */}
              {dayNum !== 4 && (
                <div className="absolute left-4 md:left-8 top-full w-0.5 h-24 bg-neutral-200 dark:bg-neutral-800 -translate-x-1/2"></div>
              )}

              {/* Day Chapter Marker */}
              <div className="mb-10 flex gap-4 md:gap-8 items-start">
                <div className="w-8 h-8 md:w-16 md:h-16 shrink-0 bg-brand-emerald text-white rounded-full flex items-center justify-center font-heading font-bold text-xl md:text-2xl shadow-lg z-10 relative">
                  {dayNum}
                </div>
                <div className="flex-1 pt-1 md:pt-3">
                  <h2 className="font-heading text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                    {dayMarker?.title || `Day ${dayNum}`}
                  </h2>
                  {dayMarker?.day_date && (
                    <div className="flex items-center gap-2 text-neutral-500 font-medium mb-3 uppercase text-sm tracking-wider">
                      <Calendar size={14} />
                      {new Date(dayMarker.day_date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                    </div>
                  )}
                  {dayMarker?.summary && (
                    <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-2xl">
                      {dayMarker.summary}
                    </p>
                  )}
                </div>
              </div>

              {/* Entries */}
              <div className="pl-4 md:pl-8 relative border-l-2 border-neutral-200 dark:border-neutral-800 ml-4 md:ml-8 py-2">
                {dayEntries.length === 0 ? (
                  <div className="p-8 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900/50 text-neutral-500 font-medium text-center italic ml-8 md:ml-12 max-w-lg">
                    Memories from Day {dayNum} will appear here.
                  </div>
                ) : (
                  <div className="space-y-12 pl-8 md:pl-12">
                    {dayEntries.map(entry => (
                      <div key={entry.id} className="relative group">
                        {/* Timeline dot */}
                        <div className={`absolute -left-[41px] md:-left-[57px] top-6 w-4 h-4 rounded-full border-4 border-white dark:border-brand-black shadow-sm ${entry.entry_type === 'milestone' ? 'bg-orange-500 w-5 h-5 -left-[43px] md:-left-[59px]' : entry.status === 'upcoming' ? 'bg-neutral-300 dark:bg-neutral-700' : 'bg-brand-emerald'}`}></div>

                        <div className={`transition-all duration-300 ${entry.status === 'upcoming' ? 'opacity-60 grayscale-[50%]' : ''}`}>
                          {entry.status === 'upcoming' && (
                            <span className="inline-block px-3 py-1 bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-xs font-bold uppercase tracking-wider rounded-full mb-3 ml-1">
                              Upcoming
                            </span>
                          )}

                          {entry.entry_type === 'milestone' && (
                            <div className="flex items-center gap-3">
                              <MapPin className="text-orange-500 shrink-0" size={24} />
                              <h3 className={`font-heading text-xl md:text-2xl font-bold ${entry.status === 'upcoming' ? 'text-neutral-600 dark:text-neutral-400' : 'text-neutral-900 dark:text-white'}`}>
                                {entry.title}
                              </h3>
                            </div>
                          )}

                          {entry.entry_type === 'activity' && (
                            <Card className={`overflow-hidden transition-shadow duration-300 ${entry.status === 'upcoming' ? 'border-dashed border-2 bg-neutral-50/50 dark:bg-neutral-900/50' : 'hover:shadow-lg hover:border-brand-emerald/30'}`}>
                              {/* Polaroid Image */}
                              <div className="p-4 md:p-6 pb-2">
                                <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden aspect-video relative flex items-center justify-center">
                                  {entry.media_url ? (
                                    <button 
                                      className="w-full h-full relative outline-none focus-visible:ring-4 focus-visible:ring-brand-emerald/50"
                                      onClick={() => setActiveLightbox({ url: entry.media_url!, alt: entry.caption || entry.title })}
                                    >
                                      <Image 
                                        src={entry.media_url} 
                                        alt={entry.caption || entry.title} 
                                        fill 
                                        className="object-cover transition-transform duration-500 hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, 800px"
                                      />
                                    </button>
                                  ) : (
                                    <div className="text-neutral-400 flex flex-col items-center gap-2 italic">
                                      <ImageIcon size={32} />
                                      <span className="text-sm font-medium">Photo coming soon</span>
                                    </div>
                                  )}
                                </div>
                                
                                {entry.caption && (
                                  <p className="text-center italic text-neutral-500 mt-4 font-serif text-sm">
                                    {entry.caption}
                                  </p>
                                )}
                              </div>
                              
                              <div className="p-6 md:p-8 pt-4">
                                <h3 className="font-heading text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                                  {entry.title}
                                </h3>
                                {entry.description && (
                                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                    {entry.description}
                                  </p>
                                )}
                              </div>
                            </Card>
                          )}

                          {entry.entry_type === 'reflection' && (
                            <div className="pl-6 py-2 border-l-4 border-brand-emerald bg-gradient-to-r from-brand-emerald/5 to-transparent rounded-r-xl">
                              <Quote className="text-brand-emerald/40 mb-3" size={32} />
                              <p className="text-lg md:text-xl italic font-serif text-neutral-800 dark:text-neutral-200 leading-relaxed mb-4">
                                "{entry.title}"
                              </p>
                              {entry.reflection_author && (
                                <p className="font-semibold text-brand-emerald uppercase tracking-wider text-sm">
                                  — {entry.reflection_author}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Lightbox */}
      {activeLightbox && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-200"
          onClick={() => setActiveLightbox(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors bg-black/50 p-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white"
            onClick={() => setActiveLightbox(null)}
            aria-label="Close lightbox"
          >
            <X size={24} />
          </button>
          
          <div 
            className="relative w-full max-w-5xl aspect-square md:aspect-video rounded-xl overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <Image 
              src={activeLightbox.url} 
              alt={activeLightbox.alt}
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority
            />
          </div>
          <div className="absolute bottom-6 left-0 w-full text-center text-white/70 italic text-sm pointer-events-none px-4">
            {activeLightbox.alt}
          </div>
        </div>
      )}
    </div>
  )
}

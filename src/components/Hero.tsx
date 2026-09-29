"use client"

import Link from "next/link"
import { Button } from "@/components/shared/Button"
import { Section } from "@/components/shared/Section"
import NexumBackgroundLoader from "@/components/3D-background/NexumBackgroundLoader"

export function Hero() {
  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-white dark:bg-brand-black">
      {/* Fallback gradient behind the canvas */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-100 via-white to-white dark:from-neutral-900 dark:via-brand-black dark:to-brand-black" />
      
      <NexumBackgroundLoader className="absolute inset-0 z-0" />
      
      <Section className="relative z-10 text-center py-24 flex flex-col items-center justify-center flex-1 w-full pointer-events-none">
        <div className="space-y-6 max-w-3xl fade-in-on-scroll is-visible pointer-events-auto">
          <h1 className="font-heading text-6xl md:text-8xl font-black tracking-tighter text-white uppercase drop-shadow-md">
            NEXUM
          </h1>
          <h2 className="font-heading text-xl md:text-3xl font-bold tracking-widest text-brand-emerald drop-shadow">
            CONNECT. CREATE. CONQUER.
          </h2>
          
          <p className="mt-8 text-lg md:text-xl text-neutral-200 max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
            Eight individuals. One team. Four days of learning, challenges, and growth. 
            NEXUM brings together different perspectives, personalities, and ambitions to 
            make the most of our Profile Development Program.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild variant="primary" className="w-full sm:w-auto text-base h-12 px-8">
              <Link href="/our-team">
                Explore the Team
              </Link>
            </Button>
            <Button asChild variant="secondary" className="w-full sm:w-auto text-base h-12 px-8">
              <Link href="/daily-journal">
                Explore the Journal
              </Link>
            </Button>
          </div>
        </div>
      </Section>
    </div>
  )
}

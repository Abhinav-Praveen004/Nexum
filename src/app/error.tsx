"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/shared/Button"
import { Section } from "@/components/shared/Section"
import { AlertCircle } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Global error caught:", error)
  }, [error])

  return (
    <div className="flex flex-col min-h-[70vh] items-center justify-center">
      <Section className="text-center py-16">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 mb-8">
          <AlertCircle size={40} />
        </div>
        <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4">
          Something went wrong
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-md mx-auto mb-10">
          An unexpected error occurred. Our team has been notified. Please try again or return to the homepage.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button onClick={() => reset()} variant="primary" className="w-full sm:w-auto px-8">
            Try again
          </Button>
          <Button asChild variant="secondary" className="w-full sm:w-auto px-8">
            <Link href="/">
              Return Home
            </Link>
          </Button>
        </div>
      </Section>
    </div>
  )
}

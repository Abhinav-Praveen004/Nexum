import Link from "next/link"
import { Button } from "@/components/shared/Button"
import { Section } from "@/components/shared/Section"
import { Map } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-[70vh] items-center justify-center">
      <Section className="text-center py-16">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-emerald/10 text-brand-emerald mb-8">
          <Map size={40} />
        </div>
        <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4">
          Page Not Found
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-md mx-auto mb-10">
          The page you're looking for doesn't exist or has been moved. Use the links below to find your way back.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          <Button asChild variant="outline" className="w-full">
            <Link href="/">Home</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/our-team">Our Team</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/daily-journal">Journal</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/time-capsule">Time Capsule</Link>
          </Button>
        </div>
      </Section>
    </div>
  )
}

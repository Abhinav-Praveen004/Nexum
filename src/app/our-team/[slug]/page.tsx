import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { TEAM_MEMBERS } from "@/data/team"
import { getTeamMember } from "@/lib/team"
import { Section } from "@/components/shared/Section"
import { Card } from "@/components/shared/Card"
import { Button } from "@/components/shared/Button"

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export function generateStaticParams() {
  return TEAM_MEMBERS.map((member) => ({
    slug: member.slug,
  }))
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

import Image from "next/image"

export default async function TeamMemberDetail({ params }: PageProps) {
  const { slug } = await params
  const member = await getTeamMember(slug)

  if (!member) {
    notFound()
  }

  const isLeader = member.role === "Team Captain" || member.role === "Vice-Captain"

  return (
    <Section className="py-12 md:py-16">
      <div className="max-w-4xl mx-auto fade-in-on-scroll is-visible">
        {/* Back navigation */}
        <Button asChild variant="ghost" className="mb-8 -ml-4 gap-2">
          <Link href="/our-team">
            <ArrowLeft size={16} /> Back to Team
          </Link>
        </Button>

        <Card 
          className={`overflow-hidden ${
            isLeader ? "border-t-4 border-t-brand-emerald dark:border-t-brand-emerald" : ""
          }`}
        >
          {/* Header Profile Info */}
          <div className="p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start border-b border-neutral-100 dark:border-neutral-800">
            {member.photo_url ? (
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden relative shrink-0">
                <Image src={member.photo_url} alt={`Photo of ${member.name}`} fill className="object-cover" sizes="(max-width: 768px) 96px, 128px" priority />
              </div>
            ) : (
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-3xl md:text-4xl font-heading font-bold text-neutral-500 dark:text-neutral-400 shrink-0">
                {getInitials(member.name)}
              </div>
            )}
            
            <div>
              <h1 className="font-heading text-3xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-2">
                {member.name}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
                <span className={`text-sm font-semibold uppercase tracking-wider ${isLeader ? "text-brand-emerald" : "text-neutral-600 dark:text-neutral-400"}`}>
                  {member.role}
                </span>
                <span className="text-neutral-300 dark:text-neutral-700 hidden sm:inline">&bull;</span>
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  {member.qualification}
                </span>
              </div>
              <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {member.bio}
              </p>
            </div>
          </div>

          {/* Tags */}
          {member.tags.length > 0 && (
            <div className="p-8 md:p-12 border-b border-neutral-100 dark:border-neutral-800">
              <h2 className="font-heading text-xl font-semibold text-neutral-900 dark:text-white mb-6">
                Skills & Interests
              </h2>
              <div className="flex flex-wrap gap-2">
                {member.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="px-3 py-1.5 text-xs font-medium rounded-full bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Placeholders */}
          <div className="p-8 md:p-12 space-y-12 bg-neutral-50 dark:bg-neutral-900/50">
            <div>
              <h2 className="font-heading text-xl font-semibold text-neutral-900 dark:text-white mb-4">
                My PDP Journey
              </h2>
              {member.pdp_journey ? (
                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap">
                  {member.pdp_journey}
                </p>
              ) : (
                <div className="bg-white dark:bg-brand-black border border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl p-8 text-center">
                  <p className="text-neutral-500 dark:text-neutral-400 italic">
                    This teammate hasn't shared their journey yet.
                  </p>
                </div>
              )}
            </div>

            {member.reflections && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="font-heading text-xl font-semibold text-neutral-900 dark:text-white">
                    Reflections
                  </h2>
                </div>
                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap">
                  {member.reflections}
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </Section>
  )
}

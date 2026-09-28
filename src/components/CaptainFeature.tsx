import { Section } from "@/components/shared/Section"
import { Card } from "@/components/shared/Card"
import { getTeamMembers } from "@/lib/team"
import Link from "next/link"
import Image from "next/image"

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
}

export async function CaptainFeature() {
  const members = await getTeamMembers()
  const captain = members.find((m) => m.role === "Team Captain")
  const viceCaptain = members.find((m) => m.role === "Vice-Captain")

  if (!captain || !viceCaptain) return null

  return (
    <Section className="bg-neutral-50 dark:bg-neutral-900 border-y border-neutral-200 dark:border-neutral-800">
      <div className="mb-12 text-center fade-in-on-scroll is-visible">
        <h2 className="font-heading text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Team Leadership
        </h2>
        <p className="mt-4 text-neutral-600 dark:text-neutral-400">
          Guiding the vision and strategy for NEXUM.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto fade-in-on-scroll is-visible">
        <Link href={`/our-team/${captain.slug}`} className="group outline-none flex flex-col h-full">
          <Card className="p-8 flex flex-col h-full border-t-4 border-t-brand-emerald transition-all duration-300 hover:shadow-md group-focus-visible:ring-2 group-focus-visible:ring-brand-emerald">
            <div className="mb-6">
              <div className="mb-4">
                {captain.photo_url ? (
                  <div className="w-20 h-20 rounded-full overflow-hidden relative">
                    <Image src={captain.photo_url} alt={`Photo of ${captain.name}`} fill className="object-cover" sizes="80px" />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-xl font-heading font-bold text-neutral-500 dark:text-neutral-400">
                    {getInitials(captain.name)}
                  </div>
                )}
              </div>
              <h3 className="font-heading text-2xl font-bold text-neutral-900 dark:text-white group-hover:text-brand-emerald transition-colors">
                {captain.name}
              </h3>
              <p className="text-sm font-semibold tracking-wider uppercase text-brand-emerald mt-1">
                {captain.role} &middot; {captain.qualification}
              </p>
            </div>
            <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed flex-1">
              {captain.bio}
            </p>
          </Card>
        </Link>

        <Link href={`/our-team/${viceCaptain.slug}`} className="group outline-none flex flex-col h-full">
          <Card className="p-8 flex flex-col h-full border-t-4 border-t-brand-emerald/70 transition-all duration-300 hover:shadow-md group-focus-visible:ring-2 group-focus-visible:ring-brand-emerald">
            <div className="mb-6">
              <div className="mb-4">
                {viceCaptain.photo_url ? (
                  <div className="w-20 h-20 rounded-full overflow-hidden relative">
                    <Image src={viceCaptain.photo_url} alt={`Photo of ${viceCaptain.name}`} fill className="object-cover" sizes="80px" />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-xl font-heading font-bold text-neutral-500 dark:text-neutral-400">
                    {getInitials(viceCaptain.name)}
                  </div>
                )}
              </div>
              <h3 className="font-heading text-2xl font-bold text-neutral-900 dark:text-white group-hover:text-brand-emerald transition-colors">
                {viceCaptain.name}
              </h3>
              <p className="text-sm font-semibold tracking-wider uppercase text-brand-emerald mt-1">
                {viceCaptain.role} &middot; {viceCaptain.qualification}
              </p>
            </div>
            <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed flex-1">
              {viceCaptain.bio}
            </p>
          </Card>
        </Link>
      </div>
    </Section>
  )
}

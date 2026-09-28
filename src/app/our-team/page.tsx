import Link from "next/link"
import { getTeamMembers } from "@/lib/team"
import { Section } from "@/components/shared/Section"
import { Card } from "@/components/shared/Card"

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

import Image from "next/image"

export default async function OurTeamGrid() {
  const members = await getTeamMembers()
  return (
    <Section className="flex-1 min-h-[60vh] py-16 md:py-24">
      <div className="mb-12 text-center fade-in-on-scroll is-visible">
        <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Our Team
        </h1>
        <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
          Eight individuals. One team. Meet the diverse minds driving NEXUM forward.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 fade-in-on-scroll is-visible">
        {members.map((member) => {
          const isLeader = member.role === "Team Captain" || member.role === "Vice-Captain"
          
          return (
            <Link key={member.slug} href={`/our-team/${member.slug}`} className="group outline-none flex flex-col h-full">
              <Card 
                className={`flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-600 group-focus-visible:ring-2 group-focus-visible:ring-brand-emerald
                  ${isLeader ? "border-t-4 border-t-brand-emerald dark:border-t-brand-emerald" : ""}
                `}
              >
                <div className="p-6 flex flex-col flex-1">
                  <div className="mb-4">
                    {member.photo_url ? (
                      <div className="w-16 h-16 rounded-full overflow-hidden relative">
                        <Image src={member.photo_url} alt={`Photo of ${member.name}`} fill className="object-cover" sizes="64px" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-xl font-heading font-bold text-neutral-500 dark:text-neutral-400">
                        {getInitials(member.name)}
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-4 flex-1">
                    <h2 className="font-heading text-xl font-bold text-neutral-900 dark:text-white group-hover:text-brand-emerald transition-colors">
                      {member.name}
                    </h2>
                    <p className={`text-xs font-semibold uppercase tracking-wider mt-1 ${isLeader ? "text-brand-emerald" : "text-neutral-500 dark:text-neutral-400"}`}>
                      {member.role}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                      {member.qualification}
                    </p>
                  </div>
                  
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3">
                    {member.bio}
                  </p>
                </div>
              </Card>
            </Link>
          )
        })}
      </div>
    </Section>
  )
}

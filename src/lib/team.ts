import { createClient } from "./supabase/server"
import { TEAM_MEMBERS as FALLBACK_TEAM, TeamMember as FallbackTeamMember } from "@/data/team"

export interface DbTeamMember {
  slug: string
  name: string
  role: "Team Captain" | "Vice-Captain" | "Team Member"
  qualification: string
  bio: string
  photo_url: string | null
  tags: string[]
  pdp_journey: string | null
  reflections: string | null
  sort_order: number
}

export async function getTeamMembers(): Promise<DbTeamMember[]> {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) {
      console.error("Supabase team_members fetch error:", error)
      return getFallbackData()
    }
    
    if (!data || data.length === 0) {
      return getFallbackData()
    }

    return data as DbTeamMember[]
  } catch (err) {
    console.error("Supabase team_members exception:", err)
    return getFallbackData()
  }
}

export async function getTeamMember(slug: string): Promise<DbTeamMember | null> {
  const members = await getTeamMembers()
  return members.find(m => m.slug === slug) || null
}

function getFallbackData(): DbTeamMember[] {
  return FALLBACK_TEAM.map((m, i) => ({
    slug: m.slug,
    name: m.name,
    role: m.role,
    qualification: m.qualification,
    bio: m.bio,
    photo_url: m.photoUrl || null,
    tags: m.tags,
    pdp_journey: null,
    reflections: null,
    sort_order: i + 1,
  }))
}

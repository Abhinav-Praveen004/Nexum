"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function updateTeamMember(slug: string, formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: "Unauthorized" }
  }

  const bio = formData.get("bio") as string
  const qualification = formData.get("qualification") as string
  const tagsStr = formData.get("tags") as string
  const pdp_journey = formData.get("pdp_journey") as string
  const reflections = formData.get("reflections") as string
  const photo_url = formData.get("photo_url") as string

  // Parse and validate tags
  let tags: string[] = []
  try {
    tags = JSON.parse(tagsStr)
  } catch (e) {
    tags = []
  }

  // Enforce constraints before DB to give clear errors
  if (!bio || bio.length > 2000) return { success: false, error: "Bio must be between 1 and 2000 characters" }
  if (pdp_journey && pdp_journey.length > 3000) return { success: false, error: "PDP Journey must be under 3000 characters" }
  if (reflections && reflections.length > 3000) return { success: false, error: "Reflections must be under 3000 characters" }
  if (tags.length > 12) return { success: false, error: "Maximum 12 tags allowed" }
  for (const tag of tags) {
    if (tag.length > 30) return { success: false, error: `Tag "${tag}" is too long (max 30 chars)` }
  }

  const payload: any = {
    bio,
    qualification,
    tags,
    pdp_journey: pdp_journey || null,
    reflections: reflections || null,
    photo_url: photo_url || null,
    updated_by: user.id,
    updated_at: new Date().toISOString()
  }

  const { error } = await supabase
    .from('team_members')
    .update(payload)
    .eq('slug', slug)

  if (error) {
    console.error("Team update error:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/")
  revalidatePath("/our-team")
  revalidatePath(`/our-team/${slug}`)

  return { success: true }
}

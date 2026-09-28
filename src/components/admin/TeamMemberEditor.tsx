"use client"

import { useState, useRef, useEffect } from "react"
import { DbTeamMember } from "@/lib/team"
import { Card } from "@/components/shared/Card"
import { Button } from "@/components/shared/Button"
import { updateTeamMember } from "@/app/admin/team/actions"
import { Loader2, Upload, X, CheckCircle2, AlertCircle, ImageIcon } from "lucide-react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"

export function TeamMemberEditor({ member }: { member: DbTeamMember }) {
  const [bio, setBio] = useState(member.bio)
  const [qualification, setQualification] = useState(member.qualification)
  const [pdpJourney, setPdpJourney] = useState(member.pdp_journey || "")
  const [reflections, setReflections] = useState(member.reflections || "")
  const [tags, setTags] = useState<string[]>(member.tags)
  const [photoUrl, setPhotoUrl] = useState(member.photo_url || "")
  
  const [tagInput, setTagInput] = useState("")
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const supabase = createClient()

  // Track unsaved changes
  const [hasChanges, setHasChanges] = useState(false)
  useEffect(() => {
    const changed = 
      bio !== member.bio ||
      qualification !== member.qualification ||
      pdpJourney !== (member.pdp_journey || "") ||
      reflections !== (member.reflections || "") ||
      photoUrl !== (member.photo_url || "") ||
      JSON.stringify(tags) !== JSON.stringify(member.tags)
    
    setHasChanges(changed)
    
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (changed) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [bio, qualification, pdpJourney, reflections, tags, photoUrl, member])

  const showFeedback = (type: 'success' | 'error', text: string) => {
    setFeedback({ type, text })
    if (type === 'success') {
      setTimeout(() => setFeedback(null), 4000)
    }
  }

  const handleAddTag = (e: React.KeyboardEvent | React.FocusEvent) => {
    if ((e.type === 'keydown' && (e as React.KeyboardEvent).key !== 'Enter') || !tagInput.trim()) return
    e.preventDefault()
    
    if (tags.length >= 12) {
      return showFeedback('error', 'Maximum 12 tags allowed.')
    }
    if (tagInput.trim().length > 30) {
      return showFeedback('error', 'Tag is too long (max 30 chars).')
    }
    if (!tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
    }
    setTagInput("")
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove))
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      return showFeedback('error', 'Please upload a JPEG, PNG, or WEBP image.')
    }
    if (file.size > 5 * 1024 * 1024) {
      return showFeedback('error', 'Image must be under 5MB.')
    }

    setIsUploading(true)
    setFeedback(null)

    try {
      // Very basic client-side downscale attempt using Canvas
      const img = document.createElement('img')
      img.src = URL.createObjectURL(file)
      await new Promise(resolve => { img.onload = resolve })
      
      const canvas = document.createElement('canvas')
      let { width, height } = img
      const maxDim = 1200
      
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width)
          width = maxDim
        } else {
          width = Math.round((width * maxDim) / height)
          height = maxDim
        }
      }
      
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      ctx?.drawImage(img, 0, 0, width, height)
      
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(b => b ? resolve(b) : reject(new Error('Canvas error')), 'image/webp', 0.8)
      })

      const fileName = `${member.slug}-${Date.now()}.webp`
      
      const { data, error } = await supabase.storage
        .from('team-photos')
        .upload(fileName, blob, { contentType: 'image/webp' })

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('team-photos')
        .getPublicUrl(data.path)

      setPhotoUrl(publicUrl)
      showFeedback('success', 'Photo uploaded successfully (remember to Save).')
      
      // Cleanup old photo attempt (best effort)
      if (member.photo_url) {
        const oldPath = member.photo_url.split('/').pop()
        if (oldPath) supabase.storage.from('team-photos').remove([oldPath])
      }
      
    } catch (err: any) {
      showFeedback('error', 'Upload failed: ' + err.message)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleSave = async () => {
    setIsSubmitting(true)
    setFeedback(null)

    const formData = new FormData()
    formData.append("bio", bio)
    formData.append("qualification", qualification)
    formData.append("tags", JSON.stringify(tags))
    formData.append("pdp_journey", pdpJourney)
    formData.append("reflections", reflections)
    formData.append("photo_url", photoUrl)

    try {
      const result = await updateTeamMember(member.slug, formData)
      if (!result.success) {
        throw new Error(result.error)
      }
      setHasChanges(false) // manually reset after save so beforeunload doesn't fire
      showFeedback('success', 'Profile saved and published!')
    } catch (err: any) {
      showFeedback('error', err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8 pb-24">
      {feedback && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-lg flex items-start gap-3 font-medium animate-in slide-in-from-top-4 max-w-md ${
          feedback.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {feedback.type === 'success' ? <CheckCircle2 size={24} className="shrink-0" /> : <AlertCircle size={24} className="shrink-0" />}
          <p className="leading-tight pt-0.5">{feedback.text}</p>
        </div>
      )}

      {hasChanges && (
        <div className="bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400 p-4 rounded-xl font-medium border border-orange-200 dark:border-orange-800">
          You have unsaved changes. Don't forget to save!
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Left Column - Form */}
        <div className="flex-1 w-full space-y-6">
          <Card className="p-6 md:p-8 space-y-6">
            <h2 className="font-heading text-xl font-semibold border-b border-neutral-100 dark:border-neutral-800 pb-4">
              Basic Info
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-neutral-500">Name (Read-only)</label>
                <div className="p-3 bg-neutral-100 dark:bg-neutral-800/50 rounded-lg text-neutral-700 dark:text-neutral-300">
                  {member.name}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-neutral-500">Role (Read-only)</label>
                <div className="p-3 bg-neutral-100 dark:bg-neutral-800/50 rounded-lg text-neutral-700 dark:text-neutral-300">
                  {member.role}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="qualification" className="block text-sm font-semibold mb-2">
                Qualification <span className="text-red-500">*</span>
              </label>
              <input
                id="qualification"
                type="text"
                value={qualification}
                onChange={e => setQualification(e.target.value)}
                className="w-full bg-neutral-100 dark:bg-neutral-800 border-none rounded-lg p-3 text-neutral-900 dark:text-white focus-visible:ring-2 focus-visible:ring-brand-emerald"
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-semibold mb-2">
                Bio <span className="text-red-500">*</span>
              </label>
              <textarea
                id="bio"
                rows={5}
                value={bio}
                onChange={e => setBio(e.target.value)}
                maxLength={2000}
                className="w-full bg-neutral-100 dark:bg-neutral-800 border-none rounded-lg p-3 text-neutral-900 dark:text-white focus-visible:ring-2 focus-visible:ring-brand-emerald resize-y"
              />
              <div className="text-right text-xs text-neutral-500 mt-1">{bio.length}/2000</div>
            </div>
          </Card>

          <Card className="p-6 md:p-8 space-y-6">
            <h2 className="font-heading text-xl font-semibold border-b border-neutral-100 dark:border-neutral-800 pb-4">
              Tags & Interests
            </h2>
            
            <div>
              <label htmlFor="tags" className="block text-sm font-semibold mb-2">Add Tag (Press Enter)</label>
              <input
                id="tags"
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                onBlur={handleAddTag}
                disabled={tags.length >= 12}
                placeholder={tags.length >= 12 ? "Tag limit reached (12)" : "e.g. leadership"}
                className="w-full bg-neutral-100 dark:bg-neutral-800 border-none rounded-lg p-3 text-neutral-900 dark:text-white focus-visible:ring-2 focus-visible:ring-brand-emerald disabled:opacity-50"
              />
              <div className="flex flex-wrap gap-2 mt-4">
                {tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 pl-3 pr-1 py-1 rounded-full bg-brand-emerald/10 text-brand-emerald font-medium text-sm">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="p-1 hover:bg-brand-emerald/20 rounded-full transition-colors">
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-6 md:p-8 space-y-6">
            <h2 className="font-heading text-xl font-semibold border-b border-neutral-100 dark:border-neutral-800 pb-4">
              Personal Development Plan
            </h2>
            
            <div>
              <label htmlFor="pdp" className="block text-sm font-semibold mb-2">My PDP Journey</label>
              <textarea
                id="pdp"
                rows={8}
                value={pdpJourney}
                onChange={e => setPdpJourney(e.target.value)}
                maxLength={3000}
                placeholder="Describe your PDP journey, goals, and progress..."
                className="w-full bg-neutral-100 dark:bg-neutral-800 border-none rounded-lg p-3 text-neutral-900 dark:text-white focus-visible:ring-2 focus-visible:ring-brand-emerald resize-y"
              />
              <div className="text-right text-xs text-neutral-500 mt-1">{pdpJourney.length}/3000</div>
            </div>

            <div>
              <label htmlFor="reflections" className="block text-sm font-semibold mb-2">Reflections (Optional)</label>
              <textarea
                id="reflections"
                rows={6}
                value={reflections}
                onChange={e => setReflections(e.target.value)}
                maxLength={3000}
                placeholder="Personal reflections, thoughts, and learnings..."
                className="w-full bg-neutral-100 dark:bg-neutral-800 border-none rounded-lg p-3 text-neutral-900 dark:text-white focus-visible:ring-2 focus-visible:ring-brand-emerald resize-y"
              />
              <div className="text-right text-xs text-neutral-500 mt-1">{reflections.length}/3000</div>
            </div>
          </Card>
        </div>

        {/* Right Column - Photo & Save */}
        <div className="w-full md:w-80 shrink-0 space-y-6 sticky top-24">
          <Card className="p-6">
            <h3 className="font-heading text-lg font-semibold mb-4">Profile Photo</h3>
            
            <div className="aspect-square bg-neutral-100 dark:bg-neutral-800 rounded-xl overflow-hidden relative mb-4 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center">
              {photoUrl ? (
                <Image src={photoUrl} alt="Preview" fill className="object-cover" unoptimized />
              ) : (
                <ImageIcon size={48} className="text-neutral-300 dark:text-neutral-600" />
              )}
              {isUploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Loader2 size={32} className="text-white animate-spin" />
                </div>
              )}
            </div>

            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/jpeg,image/png,image/webp"
              className="hidden" 
            />
            
            <div className="space-y-2">
              <Button 
                variant="secondary" 
                className="w-full gap-2" 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                <Upload size={16} /> Upload New
              </Button>
              {photoUrl && (
                <Button 
                  variant="outline" 
                  className="w-full text-red-500 hover:text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-900/20" 
                  onClick={() => setPhotoUrl("")}
                  disabled={isUploading}
                >
                  Remove Photo
                </Button>
              )}
            </div>
          </Card>

          <Button 
            onClick={handleSave} 
            disabled={isSubmitting || !bio || !qualification}
            className="w-full py-6 text-lg shadow-lg hover:shadow-xl bg-brand-emerald hover:bg-brand-emerald/90 text-white gap-2"
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : <CheckCircle2 />}
            Save Profile
          </Button>
        </div>
      </div>
    </div>
  )
}

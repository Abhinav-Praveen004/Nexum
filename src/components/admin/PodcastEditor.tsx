"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card } from "@/components/shared/Card"
import { Button } from "@/components/shared/Button"
import { ArrowLeft, Save, Send, Mic, Trash2 } from "lucide-react"
import Link from "next/link"

type PodcastEpisode = {
  id?: string
  title: string
  episode_number: number
  recording_date: string
  description: string
  audio_url: string
  transcript: string
  status: 'draft' | 'published'
}

export function PodcastEditor({ initialData }: { initialData?: any }) {
  const router = useRouter()
  const supabase = createClient()

  // Format initial date for input[type="date"]
  const formattedDate = initialData?.recording_date 
    ? new Date(initialData.recording_date).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0]

  const [formData, setFormData] = useState<PodcastEpisode>({
    title: initialData?.title || "",
    episode_number: initialData?.episode_number || 1,
    recording_date: formattedDate,
    description: initialData?.description || "",
    audio_url: initialData?.audio_url || "",
    transcript: initialData?.transcript || "",
    status: initialData?.status || "draft"
  })

  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)
    setSuccess(null)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `ep${formData.episode_number}_${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
      
      const { data, error: uploadError } = await supabase.storage
        .from('podcast-audio')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage.from('podcast-audio').getPublicUrl(data.path)
      
      setFormData(prev => ({ ...prev, audio_url: publicUrl }))
      setSuccess('Audio uploaded successfully. You can now save or publish the episode.')
    } catch (err: any) {
      setError(`Audio upload failed: ${err.message}`)
    } finally {
      setUploading(false)
    }
  }

  const saveEpisode = async (statusOverride?: 'draft' | 'published') => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    const finalStatus = statusOverride || formData.status
    const isNew = !initialData

    if (finalStatus === 'published' && !formData.audio_url) {
      setError("Cannot publish without an audio file.")
      setLoading(false)
      return
    }

    try {
      const payload: any = {
        title: formData.title,
        episode_number: formData.episode_number,
        recording_date: formData.recording_date,
        description: formData.description,
        audio_url: formData.audio_url,
        transcript: formData.transcript,
        status: finalStatus
      }

      let result
      if (isNew) {
        const { data: { user } } = await supabase.auth.getUser()
        payload.created_by = user?.id
        result = await supabase.from('podcast_episodes').insert(payload).select().single()
      } else {
        result = await supabase.from('podcast_episodes').update(payload).eq('id', initialData.id).select().single()
      }

      if (result.error) throw result.error

      setSuccess(`Episode successfully ${finalStatus === 'published' ? 'published' : 'saved as draft'}.`)
      
      if (isNew) {
        router.push(`/admin/podcasts/${result.data.id}`)
      } else {
        setFormData(prev => ({ ...prev, status: finalStatus }))
      }
      router.refresh()
    } catch (err: any) {
      setError(`Save failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!initialData) return
    setLoading(true)
    try {
      const { error } = await supabase.from('podcast_episodes').delete().eq('id', initialData.id)
      if (error) throw error
      router.push('/admin/podcasts')
      router.refresh()
    } catch (err: any) {
      setError(`Delete failed: ${err.message}`)
      setLoading(false)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <Button asChild variant="ghost" className="-ml-4 gap-2">
          <Link href="/admin/podcasts"><ArrowLeft size={16} /> Back to List</Link>
        </Button>
        <div className="flex items-center gap-3">
          {formData.status === 'published' ? (
            <Button variant="secondary" onClick={() => saveEpisode('draft')} disabled={loading || uploading} className="gap-2">
              Unpublish to Draft
            </Button>
          ) : (
            <Button variant="secondary" onClick={() => saveEpisode('draft')} disabled={loading || uploading} className="gap-2">
              <Save size={16} /> Save Draft
            </Button>
          )}

          <Button variant="primary" onClick={() => saveEpisode('published')} disabled={loading || uploading} className="gap-2">
            <Send size={16} /> {formData.status === 'published' ? 'Update Published' : 'Publish'}
          </Button>
        </div>
      </div>

      {error && <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-200 rounded-md">{error}</div>}
      {success && <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-md">{success}</div>}
      {uploading && <div className="mb-6 p-4 bg-blue-50 text-blue-600 border border-blue-200 rounded-md flex items-center gap-2"><div className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div> Uploading audio file, please wait...</div>}

      <Card className="p-6 md:p-8 space-y-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Episode Title</label>
            <input type="text" value={formData.title} onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))} className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-transparent" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Episode Number</label>
            <input type="number" min="1" value={formData.episode_number} onChange={(e) => setFormData(prev => ({...prev, episode_number: parseInt(e.target.value)}))} className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-transparent" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Recording Date</label>
            <input type="date" value={formData.recording_date} onChange={(e) => setFormData(prev => ({...prev, recording_date: e.target.value}))} className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-transparent dark:text-neutral-300" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Episode Description</label>
          <textarea value={formData.description} onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))} rows={3} className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-transparent resize-none" />
        </div>

        <div className="space-y-2 pt-6 border-t border-neutral-200 dark:border-neutral-800">
          <label className="text-sm font-medium flex items-center gap-2"><Mic size={16}/> Audio File Upload</label>
          <input type="file" accept="audio/*" onChange={handleUpload} disabled={uploading} className="w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-emerald/10 file:text-brand-emerald hover:file:bg-brand-emerald/20 transition-all cursor-pointer disabled:opacity-50" />
          {formData.audio_url && (
            <div className="mt-4 p-4 bg-neutral-50 dark:bg-neutral-900/50 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <p className="text-xs text-brand-emerald mb-2 font-medium">Current Audio File:</p>
              <audio controls className="w-full h-10">
                <source src={formData.audio_url} />
              </audio>
            </div>
          )}
        </div>

        <div className="space-y-2 pt-6 border-t border-neutral-200 dark:border-neutral-800">
          <label className="text-sm font-medium flex justify-between">
            Transcript / Summary
            <span className="text-neutral-400 font-normal">Optional</span>
          </label>
          <textarea value={formData.transcript} onChange={(e) => setFormData(prev => ({...prev, transcript: e.target.value}))} rows={8} placeholder="Paste the episode transcript or summary here..." className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-700 rounded-md bg-transparent" />
        </div>
        
        {initialData && (
          <div className="pt-8 mt-8 border-t border-red-200 dark:border-red-900/30 flex justify-end">
            {!showDeleteConfirm ? (
              <Button variant="ghost" onClick={() => setShowDeleteConfirm(true)} className="text-red-600 hover:bg-red-50 hover:text-red-700">
                <Trash2 size={16} className="mr-2" /> Delete Episode
              </Button>
            ) : (
              <div className="flex items-center gap-4">
                <span className="text-sm text-red-600 font-medium">Are you sure? This cannot be undone.</span>
                <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
                <Button variant="primary" className="bg-red-600 hover:bg-red-700 text-white" onClick={handleDelete} disabled={loading}>
                  Confirm Delete
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}

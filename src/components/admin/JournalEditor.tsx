"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card } from "@/components/shared/Card"
import { Button } from "@/components/shared/Button"
import { ArrowLeft, Save, Send, Image as ImageIcon, FileText, Trash2, Eye } from "lucide-react"
import Link from "next/link"

type Article = {
  id?: string
  title: string
  slug: string
  author: string
  pdp_day: number
  description: string
  content: string
  cover_image_url: string
  document_url: string
  status: 'draft' | 'published'
}

export function JournalEditor({ initialData }: { initialData?: any }) {
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState<Article>({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    author: initialData?.author || "",
    pdp_day: initialData?.pdp_day || 1,
    description: initialData?.description || "",
    content: initialData?.content || "",
    cover_image_url: initialData?.cover_image_url || "",
    document_url: initialData?.document_url || "",
    status: initialData?.status || "draft"
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'cover_image_url' | 'document_url') => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    setError(null)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
      const { data, error: uploadError } = await supabase.storage
        .from('journal-media')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage.from('journal-media').getPublicUrl(data.path)
      
      setFormData(prev => ({ ...prev, [field]: publicUrl }))
      setSuccess(`${field === 'cover_image_url' ? 'Cover image' : 'Document'} uploaded successfully.`)
    } catch (err: any) {
      setError(`Upload failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setFormData(prev => ({
      ...prev,
      title,
      // Only auto-generate slug if it's a new article and they haven't manually edited slug
      slug: !initialData && prev.slug === generateSlug(prev.title) ? generateSlug(title) : prev.slug
    }))
  }

  const saveArticle = async (statusOverride?: 'draft' | 'published') => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    const finalStatus = statusOverride || formData.status
    const isNew = !initialData

    try {
      const payload: any = {
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        author: formData.author,
        pdp_day: formData.pdp_day,
        description: formData.description,
        content: formData.content,
        cover_image_url: formData.cover_image_url,
        document_url: formData.document_url,
        status: finalStatus,
        updated_at: new Date().toISOString()
      }

      if (finalStatus === 'published' && (!initialData?.published_at)) {
        payload.published_at = new Date().toISOString()
      }

      let result
      if (isNew) {
        // Must fetch current user for created_by
        const { data: { user } } = await supabase.auth.getUser()
        payload.created_by = user?.id
        result = await supabase.from('articles').insert(payload).select().single()
      } else {
        result = await supabase.from('articles').update(payload).eq('id', initialData.id).select().single()
      }

      if (result.error) throw result.error

      setSuccess(`Article successfully ${finalStatus === 'published' ? 'published' : 'saved as draft'}.`)
      
      if (isNew) {
        router.push(`/admin/journal/${result.data.id}`)
      } else {
        setFormData(prev => ({ ...prev, status: finalStatus, slug: result.data.slug }))
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
      const { error } = await supabase.from('articles').delete().eq('id', initialData.id)
      if (error) throw error
      router.push('/admin/journal')
      router.refresh()
    } catch (err: any) {
      setError(`Delete failed: ${err.message}`)
      setLoading(false)
      setShowDeleteConfirm(false)
    }
  }

  if (previewMode) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <div className="mb-8 flex justify-between items-center p-4 bg-neutral-100 dark:bg-neutral-900 rounded-lg border border-brand-emerald">
          <p className="font-medium text-brand-emerald">PREVIEW MODE</p>
          <Button variant="secondary" onClick={() => setPreviewMode(false)}>Exit Preview</Button>
        </div>
        
        {/* Render exactly like the public page */}
        <header className="mb-12">
          <div className="flex flex-wrap items-center gap-4 text-sm font-semibold uppercase tracking-wider mb-6">
            <span className="text-brand-emerald bg-brand-emerald/10 px-3 py-1.5 rounded-md">
              Day {formData.pdp_day}
            </span>
            <span className="text-neutral-500">By {formData.author || 'Author'}</span>
          </div>
          <h1 className="font-heading text-4xl md:text-6xl font-bold text-neutral-900 dark:text-white mb-6 leading-tight">
            {formData.title || 'Untitled'}
          </h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-400 leading-relaxed">
            {formData.description || 'Description goes here...'}
          </p>
        </header>
        
        {formData.cover_image_url && (
          <div className="relative w-full aspect-video mb-16 rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={formData.cover_image_url} alt="Cover" className="w-full h-full object-cover" />
          </div>
        )}

        <div className="prose prose-lg dark:prose-invert prose-emerald max-w-none">
          {formData.document_url ? (
            <div className="my-12 p-8 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl text-center bg-neutral-50 dark:bg-neutral-900/50">
              <FileText className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
              <h3 className="font-heading text-xl font-semibold mb-2">Document Attached</h3>
              <Button asChild>
                <a href={formData.document_url} target="_blank" rel="noopener noreferrer">View Document</a>
              </Button>
            </div>
          ) : (
            <div className="whitespace-pre-wrap leading-loose">
              {formData.content || 'Content goes here...'}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <Button asChild variant="ghost" className="-ml-4 gap-2">
          <Link href="/admin/journal"><ArrowLeft size={16} /> Back to List</Link>
        </Button>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => setPreviewMode(true)} className="gap-2">
            <Eye size={16} /> Preview
          </Button>
          
          {formData.status === 'published' ? (
            <Button variant="secondary" onClick={() => saveArticle('draft')} disabled={loading} className="gap-2">
              Unpublish to Draft
            </Button>
          ) : (
            <Button variant="secondary" onClick={() => saveArticle('draft')} disabled={loading} className="gap-2">
              <Save size={16} /> Save Draft
            </Button>
          )}

          <Button variant="primary" onClick={() => saveArticle('published')} disabled={loading} className="gap-2">
            <Send size={16} /> {formData.status === 'published' ? 'Update Published' : 'Publish'}
          </Button>
        </div>
      </div>

      {error && <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-200 rounded-md">{error}</div>}
      {success && <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-md">{success}</div>}

      <Card className="p-6 md:p-8 space-y-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <input type="text" value={formData.title} onChange={handleTitleChange} className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-transparent" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Slug (URL friendly)</label>
            <input type="text" value={formData.slug} onChange={(e) => setFormData(prev => ({...prev, slug: e.target.value}))} className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-transparent text-neutral-500" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Author</label>
            <input type="text" value={formData.author} onChange={(e) => setFormData(prev => ({...prev, author: e.target.value}))} className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-transparent" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">PDP Day (1-4)</label>
            <select value={formData.pdp_day} onChange={(e) => setFormData(prev => ({...prev, pdp_day: parseInt(e.target.value)}))} className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-transparent text-neutral-900 dark:text-white">
              <option value={1} className="bg-white dark:bg-neutral-900">Day 1</option>
              <option value={2} className="bg-white dark:bg-neutral-900">Day 2</option>
              <option value={3} className="bg-white dark:bg-neutral-900">Day 3</option>
              <option value={4} className="bg-white dark:bg-neutral-900">Day 4</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Short Description</label>
          <textarea value={formData.description} onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))} rows={3} className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-transparent resize-none" />
        </div>

        <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-neutral-200 dark:border-neutral-800">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2"><ImageIcon size={16}/> Cover Image (Optional)</label>
            <input type="file" accept="image/*" onChange={(e) => handleUpload(e, 'cover_image_url')} className="w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-emerald/10 file:text-brand-emerald hover:file:bg-brand-emerald/20 transition-all cursor-pointer" />
            {formData.cover_image_url && <p className="text-xs text-brand-emerald truncate">Uploaded: {formData.cover_image_url}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2"><FileText size={16}/> Document Upload (PDF/Image Canva)</label>
            <input type="file" accept="application/pdf,image/*" onChange={(e) => handleUpload(e, 'document_url')} className="w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-emerald/10 file:text-brand-emerald hover:file:bg-brand-emerald/20 transition-all cursor-pointer" />
            <p className="text-xs text-neutral-500">Overrides text content below if uploaded.</p>
            {formData.document_url && <p className="text-xs text-brand-emerald truncate">Uploaded: {formData.document_url}</p>}
          </div>
        </div>

        <div className="space-y-2 pt-6 border-t border-neutral-200 dark:border-neutral-800">
          <label className="text-sm font-medium">Article Content (Markdown/Text)</label>
          <textarea value={formData.content} onChange={(e) => setFormData(prev => ({...prev, content: e.target.value}))} rows={12} disabled={!!formData.document_url} placeholder={formData.document_url ? "Document uploaded. Text content is disabled." : "Write your journal entry here..."} className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-700 rounded-md bg-transparent disabled:opacity-50" />
        </div>
        
        {initialData && (
          <div className="pt-8 mt-8 border-t border-red-200 dark:border-red-900/30 flex justify-end">
            {!showDeleteConfirm ? (
              <Button variant="ghost" onClick={() => setShowDeleteConfirm(true)} className="text-red-600 hover:bg-red-50 hover:text-red-700">
                <Trash2 size={16} className="mr-2" /> Delete Article
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

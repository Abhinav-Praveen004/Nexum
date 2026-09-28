"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card } from "@/components/shared/Card"
import { Button } from "@/components/shared/Button"
import { ArrowUp, ArrowDown, Edit2, Plus, Trash2, X, Image as ImageIcon, CheckCircle2, Loader2, AlertCircle } from "lucide-react"

type Day = {
  day_number: number
  title: string | null
  day_date: string | null
  summary: string | null
}

type Entry = {
  id: string
  day_number: number
  entry_type: 'activity' | 'milestone' | 'reflection'
  title: string
  description: string | null
  media_url: string | null
  caption: string | null
  reflection_author: string | null
  status: 'upcoming' | 'completed'
  entry_order: number
}

export function TimeCapsuleEditor({ initialDays, initialEntries, userId }: { initialDays: Day[], initialEntries: Entry[], userId: string }) {
  const supabase = createClient()
  
  const [days, setDays] = useState<Day[]>(initialDays)
  const [entries, setEntries] = useState<Entry[]>(initialEntries)

  const [editingDay, setEditingDay] = useState<Day | null>(null)
  
  const [editingEntry, setEditingEntry] = useState<Partial<Entry> | null>(null)
  const [entryConfirmed, setEntryConfirmed] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 3000)
  }

  // ---- Day Handlers ----
  const handleSaveDay = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingDay) return
    setLoading(true)
    
    try {
      const { error } = await supabase
        .from('timeline_days')
        .update({
          title: editingDay.title,
          day_date: editingDay.day_date || null,
          summary: editingDay.summary
        })
        .eq('day_number', editingDay.day_number)

      if (error) throw error

      setDays(prev => prev.map(d => d.day_number === editingDay.day_number ? editingDay : d))
      showMessage('success', 'Day marker updated.')
      setEditingDay(null)
    } catch (err: any) {
      showMessage('error', err.message || 'Failed to update day.')
    } finally {
      setLoading(false)
    }
  }

  // ---- Entry Handlers ----
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editingEntry) return

    setUploadingImage(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from("timeline-media")
        .upload(fileName, file)
        
      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from("timeline-media")
        .getPublicUrl(fileName)

      setEditingEntry({ ...editingEntry, media_url: publicUrl })
    } catch (err: any) {
      showMessage('error', 'Image upload failed: ' + err.message)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSaveEntry = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingEntry) return
    if (!editingEntry.title) return showMessage('error', 'Title is required.')
    
    // Status check
    const newStatus = entryConfirmed ? 'completed' : 'upcoming'
    const updateData: any = {
      ...editingEntry,
      status: newStatus,
      confirmed_at: newStatus === 'completed' ? (editingEntry.id && editingEntry.status === 'completed' ? undefined : new Date().toISOString()) : null,
      confirmed_by: newStatus === 'completed' ? (editingEntry.id && editingEntry.status === 'completed' ? undefined : userId) : null,
    }
    
    // Cleanup fields based on type
    if (updateData.entry_type !== 'reflection') updateData.reflection_author = null
    if (updateData.entry_type === 'reflection') {
      updateData.media_url = null
      updateData.caption = null
      updateData.description = null
    }
    if (updateData.entry_type === 'milestone') {
      updateData.media_url = null
      updateData.caption = null
      updateData.description = null
    }

    setLoading(true)
    try {
      if (editingEntry.id) {
        // Update
        const { error } = await supabase
          .from('timeline_entries')
          .update(updateData)
          .eq('id', editingEntry.id)
        if (error) throw error
        
        setEntries(prev => prev.map(en => en.id === editingEntry.id ? { ...en, ...updateData } : en))
        showMessage('success', 'Entry updated.')
      } else {
        // Insert
        // find max order for day
        const dayEntries = entries.filter(en => en.day_number === updateData.day_number)
        const maxOrder = dayEntries.length > 0 ? Math.max(...dayEntries.map(en => en.entry_order)) : 0
        updateData.entry_order = maxOrder + 1

        const { data, error } = await supabase
          .from('timeline_entries')
          .insert([updateData])
          .select()
          .single()
        if (error) throw error
        
        setEntries(prev => [...prev, data])
        showMessage('success', 'Entry added.')
      }
      setEditingEntry(null)
    } catch (err: any) {
      showMessage('error', err.message || 'Failed to save entry.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteEntry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) return
    setLoading(true)
    try {
      const { error } = await supabase.from('timeline_entries').delete().eq('id', id)
      if (error) throw error
      setEntries(prev => prev.filter(en => en.id !== id))
      showMessage('success', 'Entry deleted.')
    } catch (err: any) {
      showMessage('error', err.message || 'Failed to delete entry.')
    } finally {
      setLoading(false)
    }
  }

  const handleReorder = async (day_number: number, id: string, direction: 'up' | 'down') => {
    const dayEntries = [...entries.filter(e => e.day_number === day_number)].sort((a, b) => a.entry_order - b.entry_order)
    const index = dayEntries.findIndex(e => e.id === id)
    if (index === -1) return
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === dayEntries.length - 1) return

    const swapIndex = direction === 'up' ? index - 1 : index + 1
    const current = dayEntries[index]
    const swap = dayEntries[swapIndex]

    // Swap entry_order
    const currentOrder = current.entry_order
    current.entry_order = swap.entry_order
    swap.entry_order = currentOrder

    setLoading(true)
    try {
      const { error } = await supabase.from('timeline_entries').upsert([
        { id: current.id, entry_order: current.entry_order },
        { id: swap.id, entry_order: swap.entry_order }
      ])
      if (error) throw error
      
      // Update local state
      setEntries(prev => {
        const next = [...prev]
        const idx1 = next.findIndex(e => e.id === current.id)
        if (idx1 > -1) next[idx1].entry_order = current.entry_order
        const idx2 = next.findIndex(e => e.id === swap.id)
        if (idx2 > -1) next[idx2].entry_order = swap.entry_order
        return next
      })
    } catch (err: any) {
      showMessage('error', err.message || 'Failed to reorder.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Global Message */}
      {message && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 font-medium animate-in slide-in-from-top-4 ${
          message.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          {message.text}
        </div>
      )}

      {/* Editing Entry Modal */}
      {editingEntry && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-lg h-full bg-white dark:bg-brand-black overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-heading text-2xl font-bold">
                  {editingEntry.id ? 'Edit Entry' : 'New Entry'}
                </h2>
                <button 
                  onClick={() => setEditingEntry(null)}
                  className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSaveEntry} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Day</label>
                  <select 
                    value={editingEntry.day_number || 1}
                    onChange={e => setEditingEntry({...editingEntry, day_number: parseInt(e.target.value)})}
                    className="w-full bg-neutral-100 dark:bg-neutral-800 border-none rounded-lg p-3 text-neutral-900 dark:text-white"
                  >
                    {[1,2,3,4].map(d => <option key={d} value={d}>Day {d}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Entry Type</label>
                  <select 
                    value={editingEntry.entry_type || 'activity'}
                    onChange={e => setEditingEntry({...editingEntry, entry_type: e.target.value as any})}
                    className="w-full bg-neutral-100 dark:bg-neutral-800 border-none rounded-lg p-3 text-neutral-900 dark:text-white"
                  >
                    <option value="activity">Activity (Card w/ Photo)</option>
                    <option value="milestone">Milestone (Timeline Node)</option>
                    <option value="reflection">Reflection (Quote)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Title / Quote</label>
                  <input
                    type="text"
                    required
                    value={editingEntry.title || ''}
                    onChange={e => setEditingEntry({...editingEntry, title: e.target.value})}
                    placeholder={editingEntry.entry_type === 'reflection' ? "Quote text..." : "Entry title..."}
                    className="w-full bg-neutral-100 dark:bg-neutral-800 border-none rounded-lg p-3 text-neutral-900 dark:text-white"
                  />
                </div>

                {editingEntry.entry_type === 'reflection' && (
                  <div>
                    <label className="block text-sm font-semibold mb-2">Reflection Author</label>
                    <input
                      type="text"
                      value={editingEntry.reflection_author || ''}
                      onChange={e => setEditingEntry({...editingEntry, reflection_author: e.target.value})}
                      placeholder="e.g. John Doe"
                      className="w-full bg-neutral-100 dark:bg-neutral-800 border-none rounded-lg p-3 text-neutral-900 dark:text-white"
                    />
                  </div>
                )}

                {editingEntry.entry_type === 'activity' && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Description</label>
                      <textarea
                        rows={3}
                        value={editingEntry.description || ''}
                        onChange={e => setEditingEntry({...editingEntry, description: e.target.value})}
                        className="w-full bg-neutral-100 dark:bg-neutral-800 border-none rounded-lg p-3 text-neutral-900 dark:text-white resize-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold mb-2">Photo Upload</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="block w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-emerald/10 file:text-brand-emerald hover:file:bg-brand-emerald/20 transition-all cursor-pointer"
                      />
                      {uploadingImage && <p className="text-sm text-neutral-500 mt-2 flex items-center gap-2"><Loader2 size={16} className="animate-spin" /> Uploading...</p>}
                      {editingEntry.media_url && (
                        <div className="mt-4 p-2 border border-neutral-200 dark:border-neutral-800 rounded-lg inline-block relative">
                          <img src={editingEntry.media_url} alt="Preview" className="h-24 rounded object-cover" />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">Photo Caption</label>
                      <input
                        type="text"
                        value={editingEntry.caption || ''}
                        onChange={e => setEditingEntry({...editingEntry, caption: e.target.value})}
                        className="w-full bg-neutral-100 dark:bg-neutral-800 border-none rounded-lg p-3 text-neutral-900 dark:text-white"
                      />
                    </div>
                  </>
                )}

                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
                  <label className="block text-sm font-semibold mb-3">Status</label>
                  <label className="flex items-start gap-3 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={entryConfirmed}
                      onChange={e => setEntryConfirmed(e.target.checked)}
                      className="mt-1 w-4 h-4 text-brand-emerald focus:ring-brand-emerald border-gray-300 rounded"
                    />
                    <div>
                      <span className="block font-semibold text-neutral-900 dark:text-white mb-1">
                        Completed Memory
                      </span>
                      <span className="block text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        The team has confirmed this actually happened. Unchecking this sets it back to "Upcoming".
                      </span>
                    </div>
                  </label>
                </div>

                <div className="pt-6">
                  <Button type="submit" disabled={loading || uploadingImage} className="w-full bg-brand-emerald hover:bg-brand-emerald/90 text-white py-4 text-lg">
                    {loading ? <Loader2 className="animate-spin" /> : 'Save Entry'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="grid lg:grid-cols-[300px_1fr] gap-8 items-start">
        {/* Left Column: Day Markers */}
        <div className="space-y-4">
          <h2 className="font-heading text-xl font-bold mb-4">Day Chapters</h2>
          {days.map(day => (
            <Card key={day.day_number} className="p-5 border-neutral-200 dark:border-neutral-800">
              {editingDay?.day_number === day.day_number ? (
                <form onSubmit={handleSaveDay} className="space-y-3">
                  <span className="font-bold text-sm uppercase tracking-wider text-brand-emerald block">Day {day.day_number}</span>
                  <input 
                    type="text" 
                    placeholder="Title..." 
                    value={editingDay.title || ''}
                    onChange={e => setEditingDay({...editingDay, title: e.target.value})}
                    className="w-full bg-neutral-100 dark:bg-neutral-800 border-none rounded p-2 text-sm" 
                  />
                  <input 
                    type="date" 
                    value={editingDay.day_date || ''}
                    onChange={e => setEditingDay({...editingDay, day_date: e.target.value})}
                    className="w-full bg-neutral-100 dark:bg-neutral-800 border-none rounded p-2 text-sm" 
                  />
                  <textarea 
                    placeholder="Summary..." 
                    value={editingDay.summary || ''}
                    onChange={e => setEditingDay({...editingDay, summary: e.target.value})}
                    className="w-full bg-neutral-100 dark:bg-neutral-800 border-none rounded p-2 text-sm resize-none" 
                  />
                  <div className="flex gap-2 pt-2">
                    <Button type="submit" disabled={loading} size="sm" className="bg-brand-emerald text-white w-full">Save</Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => setEditingDay(null)}>Cancel</Button>
                  </div>
                </form>
              ) : (
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-bold text-lg">Day {day.day_number}</span>
                    <button onClick={() => setEditingDay(day)} className="text-neutral-400 hover:text-brand-emerald"><Edit2 size={16} /></button>
                  </div>
                  <h3 className="font-medium text-neutral-800 dark:text-neutral-200">{day.title || 'No title set'}</h3>
                  {day.day_date && <p className="text-xs text-neutral-500 mt-1">{day.day_date}</p>}
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Right Column: Entries */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-xl font-bold">Timeline Entries</h2>
            <Button onClick={() => {
              setEditingEntry({ day_number: 1, entry_type: 'activity' })
              setEntryConfirmed(false)
            }} className="bg-brand-emerald text-white gap-2">
              <Plus size={16} /> Add Entry
            </Button>
          </div>

          <div className="space-y-8">
            {[1, 2, 3, 4].map(dayNum => {
              const dayEntries = entries.filter(e => e.day_number === dayNum).sort((a,b) => a.entry_order - b.entry_order)
              
              return (
                <div key={dayNum} className="border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden bg-white dark:bg-neutral-900/50">
                  <div className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 p-4 font-semibold flex items-center justify-between">
                    <span>Day {dayNum} Entries</span>
                    <span className="text-sm font-normal text-neutral-500 bg-neutral-200 dark:bg-neutral-800 px-2 py-1 rounded-full">{dayEntries.length} items</span>
                  </div>
                  
                  {dayEntries.length === 0 ? (
                    <div className="p-8 text-center text-neutral-500 italic text-sm">
                      No entries for Day {dayNum} yet.
                    </div>
                  ) : (
                    <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                      {dayEntries.map((entry, idx) => (
                        <div key={entry.id} className="p-4 flex items-center justify-between group hover:bg-neutral-50 dark:hover:bg-neutral-900/30 transition-colors">
                          <div className="flex-1 min-w-0 pr-4">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                entry.status === 'upcoming' ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400' : 'bg-brand-emerald/10 text-brand-emerald'
                              }`}>
                                {entry.status}
                              </span>
                              <span className="text-xs font-semibold text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded capitalize">
                                {entry.entry_type}
                              </span>
                            </div>
                            <p className="font-semibold text-neutral-900 dark:text-white truncate">
                              {entry.title}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex flex-col border-r border-neutral-200 dark:border-neutral-700 pr-1 mr-1">
                              <button 
                                onClick={() => handleReorder(dayNum, entry.id, 'up')}
                                disabled={idx === 0 || loading}
                                className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white disabled:opacity-30"
                              >
                                <ArrowUp size={14} />
                              </button>
                              <button 
                                onClick={() => handleReorder(dayNum, entry.id, 'down')}
                                disabled={idx === dayEntries.length - 1 || loading}
                                className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white disabled:opacity-30"
                              >
                                <ArrowDown size={14} />
                              </button>
                            </div>
                            
                            <button 
                              onClick={() => {
                                setEditingEntry(entry)
                                setEntryConfirmed(entry.status === 'completed')
                              }}
                              className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteEntry(entry.id)}
                              disabled={loading}
                              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

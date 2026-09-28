"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card } from "@/components/shared/Card"
import { Button } from "@/components/shared/Button"
import { Check, X, Undo2, Trash2, AlertCircle, CheckCircle2, Loader2, Quote } from "lucide-react"

type Message = {
  id: string
  recipient_name: string
  message: string
  sender_name: string | null
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export function AppreciationModerator({ initialMessages, userId }: { initialMessages: Message[], userId: string }) {
  const supabase = createClient()
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending')
  
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const showFeedback = (type: 'success' | 'error', text: string) => {
    setFeedback({ type, text })
    setTimeout(() => setFeedback(null), 3000)
  }

  const handleUpdateStatus = async (id: string, status: 'pending' | 'approved' | 'rejected') => {
    setLoadingId(id)
    try {
      const { error } = await supabase
        .from('appreciation_messages')
        .update({
          status,
          moderated_by: status === 'pending' ? null : userId,
          moderated_at: status === 'pending' ? null : new Date().toISOString()
        })
        .eq('id', id)
        
      if (error) throw error

      setMessages(prev => prev.map(m => m.id === id ? { ...m, status } : m))
      showFeedback('success', `Message marked as ${status}.`)
    } catch (err: any) {
      showFeedback('error', 'Update failed: ' + err.message)
    } finally {
      setLoadingId(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this message? This cannot be undone.')) return
    setLoadingId(id)
    try {
      const { error } = await supabase.from('appreciation_messages').delete().eq('id', id)
      if (error) throw error
      setMessages(prev => prev.filter(m => m.id !== id))
      showFeedback('success', 'Message deleted permanently.')
    } catch (err: any) {
      showFeedback('error', 'Deletion failed: ' + err.message)
    } finally {
      setLoadingId(null)
    }
  }

  const displayedMessages = messages.filter(m => m.status === activeTab)

  return (
    <div>
      {feedback && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 font-medium animate-in slide-in-from-top-4 ${
          feedback.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {feedback.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          {feedback.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800 mb-8 overflow-x-auto">
        {(['pending', 'approved', 'rejected'] as const).map(tab => {
          const count = messages.filter(m => m.status === tab).length
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 font-semibold text-sm uppercase tracking-wider whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === tab 
                  ? 'border-brand-emerald text-brand-emerald' 
                  : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {tab}
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab 
                  ? 'bg-brand-emerald/10 text-brand-emerald' 
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
              }`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Message List */}
      {displayedMessages.length === 0 ? (
        <div className="p-12 text-center text-neutral-500 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-2xl">
          No {activeTab} messages.
        </div>
      ) : (
        <div className="space-y-6">
          {displayedMessages.map(msg => (
            <Card key={msg.id} className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-1 w-full min-w-0">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-block px-3 py-1 bg-brand-emerald/10 text-brand-emerald font-semibold text-sm rounded-full tracking-wide">
                    To: {msg.recipient_name}
                  </span>
                  <span className="text-sm text-neutral-500">
                    {new Date(msg.created_at).toLocaleString()}
                  </span>
                </div>
                
                <div className="relative mb-6 border-l-4 border-neutral-200 dark:border-neutral-800 pl-4">
                  <Quote size={20} className="absolute -left-3 -top-2 text-neutral-300 dark:text-neutral-700 bg-white dark:bg-brand-black" />
                  <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed font-serif text-lg whitespace-pre-wrap break-words">
                    {msg.message}
                  </p>
                </div>
                
                <div className="font-semibold text-neutral-900 dark:text-white text-sm">
                  From: {msg.sender_name || 'Anonymous'}
                </div>
              </div>

              {/* Actions Panel */}
              <div className="flex flex-row md:flex-col gap-2 shrink-0 w-full md:w-auto border-t md:border-t-0 md:border-l border-neutral-100 dark:border-neutral-800 pt-4 md:pt-0 md:pl-6">
                {activeTab === 'pending' && (
                  <>
                    <Button 
                      onClick={() => handleUpdateStatus(msg.id, 'approved')}
                      disabled={loadingId === msg.id}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2 flex-1 md:w-full justify-start"
                    >
                      {loadingId === msg.id ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} 
                      Approve
                    </Button>
                    <Button 
                      onClick={() => handleUpdateStatus(msg.id, 'rejected')}
                      disabled={loadingId === msg.id}
                      className="bg-orange-500 hover:bg-orange-600 text-white gap-2 flex-1 md:w-full justify-start"
                    >
                      {loadingId === msg.id ? <Loader2 size={16} className="animate-spin" /> : <X size={16} />} 
                      Reject
                    </Button>
                  </>
                )}

                {(activeTab === 'approved' || activeTab === 'rejected') && (
                  <>
                    <Button 
                      variant="secondary"
                      onClick={() => handleUpdateStatus(msg.id, 'pending')}
                      disabled={loadingId === msg.id}
                      className="gap-2 flex-1 md:w-full justify-start"
                    >
                      {loadingId === msg.id ? <Loader2 size={16} className="animate-spin" /> : <Undo2 size={16} />} 
                      Move to Pending
                    </Button>
                    <Button 
                      onClick={() => handleDelete(msg.id)}
                      disabled={loadingId === msg.id}
                      className="bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-500/10 dark:hover:bg-red-500/20 gap-2 flex-1 md:w-full justify-start border-none"
                    >
                      {loadingId === msg.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />} 
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

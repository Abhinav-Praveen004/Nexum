"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/shared/Card"
import { Button } from "@/components/shared/Button"
import { TEAM_MEMBERS } from "@/data/team"
import { Quote, Send, Loader2, CheckCircle2, AlertCircle, HeartHandshake } from "lucide-react"

type AppreciationMessage = {
  id: string
  recipient_name: string
  message: string
  sender_name: string | null
  created_at: string
}

export function AppreciationWallClient({ messages }: { messages: AppreciationMessage[] }) {
  const [recipientFilter, setRecipientFilter] = useState<string>("All")
  const [visibleCount, setVisibleCount] = useState(12)

  // Form State
  const [recipientSelect, setRecipientSelect] = useState("")
  const [customRecipient, setCustomRecipient] = useState("")
  const [message, setMessage] = useState("")
  const [senderName, setSenderName] = useState("")
  const [honeypot, setHoneypot] = useState("")
  const [startTime] = useState(Date.now())
  
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const filteredMessages = recipientFilter === "All" 
    ? messages 
    : messages.filter(m => m.recipient_name === recipientFilter)

  const visibleMessages = filteredMessages.slice(0, visibleCount)

  const uniqueRecipients = Array.from(new Set(messages.map(m => m.recipient_name))).sort()
  const filterOptions = ["All", ...uniqueRecipients]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Client-side validation
    const recipient = recipientSelect === "Someone else" ? customRecipient : recipientSelect
    if (!recipient.trim() || recipient.trim().length > 80) {
      return setFeedback({ type: 'error', text: 'Recipient name must be between 1 and 80 characters.' })
    }
    if (message.trim().length < 10 || message.trim().length > 600) {
      return setFeedback({ type: 'error', text: 'Message must be between 10 and 600 characters.' })
    }
    if (senderName.trim().length > 80) {
      return setFeedback({ type: 'error', text: 'Sender name is too long.' })
    }

    setSubmitting(true)
    setFeedback(null)

    try {
      const res = await fetch("/api/appreciation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient_name: recipient,
          message: message,
          sender_name: senderName,
          honeypot,
          startTime
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit.')
      }

      setFeedback({ type: 'success', text: 'Thank you! Your message will appear on the wall once a team member has reviewed it.' })
      
      // Reset form
      setRecipientSelect("")
      setCustomRecipient("")
      setMessage("")
      setSenderName("")
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-16">
      
      {/* Messages Grid */}
      <div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <h2 className="font-heading text-2xl font-bold">Public Wall</h2>
          
          {filterOptions.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {filterOptions.map(opt => (
                <button
                  key={opt}
                  onClick={() => {
                    setRecipientFilter(opt)
                    setVisibleCount(12)
                  }}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${recipientFilter === opt ? 'bg-brand-emerald text-white' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-brand-emerald/20 hover:text-brand-emerald'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>

        {messages.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-neutral-300 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-900/50">
            <HeartHandshake size={48} className="mx-auto text-neutral-300 dark:text-neutral-700 mb-4" />
            <p className="text-lg font-medium text-neutral-500">Be the first to appreciate someone! Use the form below.</p>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="p-12 text-center text-neutral-500 font-medium">
            No messages found for this filter.
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleMessages.map(msg => (
                <Card key={msg.id} className="p-6 md:p-8 flex flex-col h-full hover:shadow-md transition-shadow">
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-brand-emerald/10 text-brand-emerald font-semibold text-sm rounded-full tracking-wide">
                      To: {msg.recipient_name}
                    </span>
                  </div>
                  
                  <div className="relative flex-1">
                    <Quote size={32} className="absolute -top-2 -left-2 text-brand-emerald/20 -z-10" />
                    <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed font-serif text-lg whitespace-pre-wrap relative z-10 break-words">
                      {msg.message}
                    </p>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-sm">
                    <span className="font-semibold text-neutral-900 dark:text-white">
                      From: {msg.sender_name || 'Anonymous'}
                    </span>
                    <span className="text-neutral-500">
                      {new Date(msg.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </Card>
              ))}
            </div>

            {visibleCount < filteredMessages.length && (
              <div className="mt-8 text-center">
                <Button variant="secondary" onClick={() => setVisibleCount(prev => prev + 12)}>
                  Load more messages
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <div className="border-t border-neutral-200 dark:border-neutral-800 my-16"></div>

      {/* Submission Form */}
      <div id="submit-form" className="max-w-2xl mx-auto scroll-mt-24">
        <Card className="p-8 md:p-10 border-brand-emerald/20">
          <div className="text-center mb-8">
            <h2 className="font-heading text-3xl font-bold mb-2">Write a Message</h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              Show your appreciation. Messages are moderated before appearing on the wall.
            </p>
          </div>

          {feedback && (
            <div className={`mb-8 p-4 rounded-xl flex gap-3 items-start ${feedback.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 text-emerald-800 dark:text-emerald-300' : 'bg-red-50 dark:bg-red-900/10 border border-red-200 text-red-800 dark:text-red-300'}`}>
              {feedback.type === 'success' ? <CheckCircle2 className="shrink-0 mt-0.5" /> : <AlertCircle className="shrink-0 mt-0.5" />}
              <p className="font-medium leading-relaxed">{feedback.text}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Honeypot field - hidden from humans */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={e => setHoneypot(e.target.value)} />
            </div>

            <div>
              <label htmlFor="recipient" className="block text-sm font-semibold mb-2">
                Who are you appreciating? <span className="text-red-500">*</span>
              </label>
              <select
                id="recipient"
                required
                value={recipientSelect}
                onChange={e => setRecipientSelect(e.target.value)}
                className="w-full bg-neutral-100 dark:bg-neutral-800 border-none rounded-lg p-3 md:p-4 text-neutral-900 dark:text-white outline-none focus-visible:ring-2 focus-visible:ring-brand-emerald"
              >
                <option value="" disabled>Select someone...</option>
                <option value="The whole team">The whole team</option>
                {TEAM_MEMBERS.map(m => (
                  <option key={m.id} value={m.name}>{m.name}</option>
                ))}
                <option value="Someone else">Someone else...</option>
              </select>
            </div>

            {recipientSelect === "Someone else" && (
              <div className="animate-in fade-in slide-in-from-top-2">
                <label htmlFor="customRecipient" className="block text-sm font-semibold mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="customRecipient"
                  type="text"
                  required
                  maxLength={80}
                  value={customRecipient}
                  onChange={e => setCustomRecipient(e.target.value)}
                  placeholder="Type their name here..."
                  className="w-full bg-neutral-100 dark:bg-neutral-800 border-none rounded-lg p-3 md:p-4 text-neutral-900 dark:text-white outline-none focus-visible:ring-2 focus-visible:ring-brand-emerald"
                />
              </div>
            )}

            <div>
              <label htmlFor="message" className="block text-sm font-semibold mb-2">
                Your message <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                required
                rows={5}
                minLength={10}
                maxLength={600}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Mention something specific: a moment, a contribution, or how they helped you or the team."
                className="w-full bg-neutral-100 dark:bg-neutral-800 border-none rounded-lg p-3 md:p-4 text-neutral-900 dark:text-white outline-none focus-visible:ring-2 focus-visible:ring-brand-emerald resize-none"
              />
              <div className="flex justify-between mt-2 text-xs font-medium">
                <span className={message.trim().length < 10 && message.length > 0 ? "text-red-500" : "text-neutral-500"}>
                  Min 10 characters
                </span>
                <span className={message.length > 600 ? "text-red-500" : "text-neutral-500"}>
                  {message.length} / 600
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="sender" className="block text-sm font-semibold mb-2">
                Your name (optional)
              </label>
              <input
                id="sender"
                type="text"
                maxLength={80}
                value={senderName}
                onChange={e => setSenderName(e.target.value)}
                placeholder="Leave blank to post anonymously"
                className="w-full bg-neutral-100 dark:bg-neutral-800 border-none rounded-lg p-3 md:p-4 text-neutral-900 dark:text-white outline-none focus-visible:ring-2 focus-visible:ring-brand-emerald"
              />
            </div>

            <Button type="submit" disabled={submitting} className="w-full bg-brand-emerald hover:bg-brand-emerald/90 text-white py-4 md:py-5 text-lg gap-2">
              {submitting ? <Loader2 className="animate-spin" /> : <><Send size={20} /> Submit Message</>}
            </Button>
          </form>
        </Card>
      </div>

    </div>
  )
}

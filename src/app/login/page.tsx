"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Section } from "@/components/shared/Section"
import { Card } from "@/components/shared/Card"
import { Button } from "@/components/shared/Button"
import { Lock } from "lucide-react"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push("/admin")
      router.refresh()
    }
  }

  return (
    <Section className="flex-1 flex items-center justify-center min-h-[70vh] bg-neutral-50 dark:bg-brand-black">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-brand-emerald" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-neutral-900 dark:text-white">
            Admin Access
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
            Sign in to manage NEXUM content.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-900 dark:text-neutral-200" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-white dark:bg-brand-black text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-emerald"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-900 dark:text-neutral-200" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-white dark:bg-brand-black text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-emerald"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-md border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </Card>
    </Section>
  )
}

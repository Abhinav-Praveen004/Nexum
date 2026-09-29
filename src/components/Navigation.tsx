"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X, User as UserIcon, LogOut, LayoutDashboard } from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { User } from "@supabase/supabase-js"

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/our-team", label: "Our Team" },
  { href: "/daily-journal", label: "Daily Journal" },
  { href: "/podcasts", label: "Podcasts" },
  { href: "/decision-room", label: "Decision Room" },
  { href: "/fun-zone", label: "Fun Zone" },
  { href: "/time-capsule", label: "Time Capsule" },
  { href: "/appreciation-wall", label: "Appreciation Wall" },
]

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = React.useState(false)
  const [user, setUser] = React.useState<User | null>(null)
  const [showDropdown, setShowDropdown] = React.useState(false)
  
  const supabase = createClient()

  React.useEffect(() => {
    // Get initial session
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  React.useEffect(() => {
    setIsOpen(false)
    setShowDropdown(false)
  }, [pathname])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setShowDropdown(false)
    setIsOpen(false)
    router.push("/login")
  }

  const userDisplayName = user?.user_metadata?.display_name 
    || user?.user_metadata?.full_name 
    || user?.user_metadata?.name 
    || (user?.email ? user.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : "Account")

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-md dark:border-neutral-800 dark:bg-brand-black/80">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6 max-w-7xl">
        <Link href="/" className="flex items-center gap-2 relative h-12 w-[140px]" aria-label="NEXUM Home">
          <Image
            src="/branding/Nexum-removebg-preview.png"
            alt="NEXUM Logo"
            fill
            sizes="140px"
            className="object-contain"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-6">
          <nav className="flex items-center gap-6 mr-4">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-brand-emerald focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-emerald focus-visible:ring-offset-2 rounded-sm",
                    isActive
                      ? "text-brand-emerald"
                      : "text-neutral-600 dark:text-neutral-300"
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>
          
          {/* Desktop Auth Control */}
          <div className="relative border-l border-neutral-200 dark:border-neutral-800 pl-6 flex items-center h-8">
            {!user ? (
              <Link 
                href="/login"
                className="flex items-center gap-2 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-brand-emerald transition-colors"
              >
                <UserIcon size={16} /> Log in
              </Link>
            ) : (
              <div className="relative">
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 text-sm font-medium text-neutral-900 dark:text-white hover:text-brand-emerald transition-colors outline-none"
                >
                  <div className="w-6 h-6 rounded-full bg-brand-emerald/20 text-brand-emerald flex items-center justify-center">
                    <UserIcon size={12} />
                  </div>
                  {userDisplayName}
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-4 w-48 bg-white dark:bg-brand-black border border-neutral-200 dark:border-neutral-800 rounded-md shadow-lg py-1 z-50">
                    <Link 
                      href="/admin"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
                    >
                      <LayoutDashboard size={14} /> Admin Dashboard
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    >
                      <LogOut size={14} /> Log out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Nav Toggle */}
        <button
          className="lg:hidden p-2 text-neutral-600 dark:text-neutral-300"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav Menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-brand-black">
          <nav className="container mx-auto flex flex-col px-4 py-4 gap-4">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "block text-lg font-medium transition-colors hover:text-brand-emerald focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-emerald focus-visible:ring-offset-2 rounded-sm",
                    isActive
                      ? "text-brand-emerald"
                      : "text-neutral-600 dark:text-neutral-300"
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
            
            <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              {!user ? (
                <Link 
                  href="/login"
                  className="flex items-center gap-3 text-lg font-medium text-neutral-600 dark:text-neutral-300 hover:text-brand-emerald transition-colors"
                >
                  <UserIcon size={20} /> Log in
                </Link>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 text-lg font-medium text-neutral-900 dark:text-white">
                    <div className="w-8 h-8 rounded-full bg-brand-emerald/20 text-brand-emerald flex items-center justify-center">
                      <UserIcon size={16} />
                    </div>
                    {userDisplayName}
                  </div>
                  <Link 
                    href="/admin"
                    className="flex items-center gap-3 text-neutral-600 dark:text-neutral-300 hover:text-brand-emerald transition-colors ml-2"
                  >
                    <LayoutDashboard size={18} /> Admin Dashboard
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 text-red-600 dark:text-red-400 hover:text-red-500 transition-colors ml-2 text-left"
                  >
                    <LogOut size={18} /> Log out
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

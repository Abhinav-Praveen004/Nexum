import * as React from "react"
import Link from "next/link"
import Image from "next/image"

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

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-brand-black">
      <div className="container mx-auto px-4 py-12 md:px-6 md:py-16 max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="flex flex-col gap-6">
            <Link href="/" className="relative h-12 w-[140px]">
              <Image
                src="/branding/Nexum-removebg-preview.png"
                alt="NEXUM Logo"
                fill
                sizes="140px"
                className="object-contain"
              />
            </Link>
            <div>
              <p className="font-heading text-lg font-bold tracking-tight text-neutral-900 dark:text-white">
                CONNECT. CREATE. CONQUER.
              </p>
              <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400 max-w-xs leading-relaxed">
                Powering the next generation of visionary leaders through the 4-day Profile Development Program.
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-neutral-900 dark:text-white mb-6">
              Navigation
            </h3>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-8">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-600 transition-colors hover:text-brand-emerald dark:text-neutral-400 dark:hover:text-brand-emerald"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-neutral-200 pt-8 sm:flex-row dark:border-neutral-800">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            &copy; {new Date().getFullYear()} NEXUM. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

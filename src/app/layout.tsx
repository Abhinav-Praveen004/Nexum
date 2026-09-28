import type { Metadata } from "next"
import { Space_Grotesk, Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL('https://nexum.example.com'),
  title: {
    default: "NEXUM | CONNECT. CREATE. CONQUER.",
    template: "%s | NEXUM",
  },
  description: "Powering the next generation of visionary leaders through the Profile Development Program.",
  openGraph: {
    title: "NEXUM | CONNECT. CREATE. CONQUER.",
    description: "Powering the next generation of visionary leaders through the Profile Development Program.",
    url: "https://nexum.example.com",
    siteName: "NEXUM",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "NEXUM Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col font-sans antialiased bg-white text-neutral-900 dark:bg-brand-black dark:text-neutral-50">
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:px-4 focus:py-2 focus:bg-brand-emerald focus:text-white"
        >
          Skip to main content
        </a>
        <Navigation />
        <main id="main-content" className="flex-1 flex flex-col focus:outline-none" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}

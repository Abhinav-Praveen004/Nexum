import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-neutral-500 dark:text-neutral-400">
        <Loader2 size={32} className="animate-spin text-brand-emerald" />
        <p className="text-sm font-medium animate-pulse">Loading...</p>
      </div>
    </div>
  )
}

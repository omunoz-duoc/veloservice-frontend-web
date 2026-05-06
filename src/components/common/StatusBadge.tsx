import { cn } from "@/lib/utils"

type Tone = "good" | "warn" | "info" | "violet" | "muted" | "amber"

const TONE_CLASSES: Record<Tone, string> = {
  good:   "bg-vs-good-bg text-vs-good",
  warn:   "bg-vs-warn-bg text-vs-warn",
  info:   "bg-vs-info-bg text-vs-info",
  violet: "bg-vs-violet-bg text-vs-violet",
  muted:  "bg-vs-line-2 text-[#6b5d46]",
  amber:  "bg-[#faecd6] text-[#8c6a1e]",
}

type StatusBadgeProps = {
  label: string
  tone: Tone
  dot?: boolean
  className?: string
}

export function StatusBadge({ label, tone, dot, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[10.5px] font-semibold px-2.5 py-1 rounded-full",
        TONE_CLASSES[tone],
        className
      )}
    >
      {dot && (
        <span className="relative flex h-2 w-2 shrink-0">
          <span
            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-40"
            style={{ background: "currentColor" }}
          />
          <span
            className="relative inline-flex rounded-full h-2 w-2"
            style={{ background: "currentColor" }}
          />
        </span>
      )}
      {label}
    </span>
  )
}

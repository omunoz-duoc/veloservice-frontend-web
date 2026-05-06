import type { LucideIcon } from "lucide-react"
import { Sparkline } from "./Sparkline"

type KpiAccent = "violet" | "good" | "info" | "warn" | "ink"

const ACCENT_STYLES: Record<KpiAccent, { fg: string; bg: string }> = {
  violet: { fg: "var(--vs-violet)", bg: "var(--vs-violet-bg)" },
  good:   { fg: "var(--vs-good)",   bg: "var(--vs-good-bg)" },
  info:   { fg: "var(--vs-info)",   bg: "var(--vs-info-bg)" },
  warn:   { fg: "var(--vs-warn)",   bg: "var(--vs-warn-bg)" },
  ink:    { fg: "#111418",          bg: "#ece7de" },
}

type KpiCardProps = {
  title: string
  value: string
  delta: string
  trend: "up" | "down" | "warn"
  sub: string
  accent: KpiAccent
  icon: LucideIcon
  spark?: number[]
  progress?: number
}

export function KpiCard({
  title,
  value,
  delta,
  trend,
  sub,
  accent,
  icon: Icon,
  spark,
  progress,
}: KpiCardProps) {
  const t = ACCENT_STYLES[accent]
  const trendColor = trend === "warn" ? "var(--vs-warn)" : "var(--vs-good)"

  return (
    <div className="bg-vs-card border border-vs-line rounded-[24px] flex flex-col p-4">
      <div className="flex items-center justify-between mb-2">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: t.bg, color: t.fg }}
        >
          <Icon size={14} strokeWidth={1.8} />
        </div>
        <span
          className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full"
          style={{ background: t.bg, color: trendColor }}
        >
          {delta}
        </span>
      </div>

      <div className="text-[11.5px] text-[#8a7f70]">{title}</div>
      <div className="text-[24px] font-semibold tracking-tight mt-0.5 font-mono leading-tight">
        {value}
      </div>

      <div className="mt-2">
        {spark && <Sparkline data={spark} color={t.fg} height={18} />}
        {progress !== undefined && (
          <div className="h-1.5 rounded-full bg-vs-line-2 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${progress * 100}%`, background: t.fg }}
            />
          </div>
        )}
      </div>

      <div className="text-[10.5px] text-[#8a7f70] mt-2 flex items-center gap-1.5">
        <span className="w-1 h-1 rounded-full shrink-0" style={{ background: t.fg }} />
        <span className="truncate">{sub}</span>
      </div>
    </div>
  )
}

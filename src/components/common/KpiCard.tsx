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
  insight?: string
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
  insight,
}: KpiCardProps) {
  const t = ACCENT_STYLES[accent]
  const trendColor = trend === "warn" ? "var(--vs-warn)" : "var(--vs-good)"
  const hasInsight = Boolean(insight)

  return (
    <div className="relative bg-vs-card border border-vs-line rounded-[24px] flex flex-col p-4 overflow-hidden">
      {hasInsight && (
        <div
          className="absolute left-0 top-4 bottom-4 w-1 rounded-r-full"
          style={{ background: t.fg }}
        />
      )}
      <div className="flex items-center justify-between mb-2">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: t.bg, color: t.fg }}
        >
          <Icon size={14} strokeWidth={1.8} />
        </div>
        {delta && (
          <span
            className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: t.bg, color: trendColor }}
          >
            {delta}
          </span>
        )}
      </div>

      <div className="text-[11.5px] text-[#8a7f70]">{title}</div>
      <div className={`${hasInsight ? "text-[30px] font-bold" : "text-[24px] font-semibold"} tracking-tight mt-0.5 font-mono leading-tight`}>
        {value}
      </div>

      <div className="mt-2">
        {progress !== undefined ? (
          <div className="h-1.5 rounded-full bg-vs-line-2 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${progress * 100}%`, background: t.fg }}
            />
          </div>
        ) : insight ? (
          <div className="flex items-center gap-1.5 text-[11px] text-[#8a7f70]">
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: t.fg }} />
            <span className="truncate">{insight}</span>
          </div>
        ) : spark ? (
          <Sparkline data={spark} color={t.fg} height={18} />
        ) : null}
      </div>

      {progress !== undefined && insight ? (
        <div className="text-[10.5px] text-[#8a7f70] mt-2 flex items-center gap-1.5">
          <span className="truncate">{insight}</span>
        </div>
      ) : !insight && (
        <div className="text-[10.5px] text-[#8a7f70] mt-2 flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full shrink-0" style={{ background: t.fg }} />
          <span className="truncate">{sub}</span>
        </div>
      )}
    </div>
  )
}

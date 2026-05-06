"use client"

import { ArrowUpRight } from "lucide-react"
import { SectionHeader } from "@/components/common/SectionHeader"
import { StatusBadge } from "@/components/common/StatusBadge"
import { useOrdenesUrgentes } from "@/features/panel/hooks/useOrdenesUrgentes"

const LEVEL_DOT: Record<string, string> = {
  crit: "#c85a2a",
  warn: "#c99a2e",
}

const LEVEL_TONE = {
  crit: "warn" as const,
  warn: "amber" as const,
}

export function UrgentesCard() {
  const { data: ordenes = [], isLoading } = useOrdenesUrgentes()

  if (isLoading) {
    return (
      <div className="bg-vs-card border border-vs-line rounded-[24px] p-5 h-full animate-pulse min-h-[320px]" />
    )
  }

  const critCount = ordenes.filter(o => o.level === "crit").length

  return (
    <div className="bg-vs-card border border-vs-line rounded-[24px] p-5 flex flex-col h-full">
      <SectionHeader
        overline="Atención prioritaria"
        title="Órdenes urgentes"
        right={
          <StatusBadge label={`${critCount} OTs críticas`} tone="warn" dot />
        }
      />

      <div className="flex flex-col divide-y divide-vs-line-2 -mx-1 flex-1">
        {ordenes.map(u => (
          <div key={u.ot} className="flex items-center gap-3 py-2.5 px-1">
            <span
              className="w-1.5 h-10 rounded-full shrink-0"
              style={{ background: LEVEL_DOT[u.level] }}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[11.5px] font-mono font-semibold">{u.ot}</span>
                <span className="text-[11px] text-[#8a7f70] truncate">· {u.cliente}</span>
              </div>
              <div className="text-[11px] text-[#8a7f70] truncate">{u.bici}</div>
            </div>
            <div className="text-right shrink-0">
              <StatusBadge label={u.due} tone={LEVEL_TONE[u.level]} />
              <div className="text-[10px] text-[#a59682] mt-0.5">{u.mecanico}</div>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-3 flex items-center justify-center gap-2 bg-vs-chip text-vs-ink px-4 py-2 rounded-full text-[12px] font-medium hover:bg-[#ebe3d6] transition-colors">
        Ver todas ({ordenes.length + 5}) <ArrowUpRight size={14} />
      </button>
    </div>
  )
}

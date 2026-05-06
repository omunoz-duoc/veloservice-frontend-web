"use client"

import {
  Wrench, Coins, AlertTriangle, Plus, Users, FileText,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { SectionHeader } from "@/components/common/SectionHeader"
import { useActividadReciente } from "@/features/panel/hooks/useActividadReciente"
import type { ActividadItem } from "@/features/panel/services/dashboard.mock"

const ICON_MAP: Record<ActividadItem["iconKey"], LucideIcon> = {
  wrench: Wrench,
  coin:   Coins,
  alert:  AlertTriangle,
  plus:   Plus,
  users:  Users,
  doc:    FileText,
}

const TONE_STYLES: Record<ActividadItem["tone"], { bg: string; fg: string }> = {
  violet: { bg: "var(--vs-violet-bg)", fg: "var(--vs-violet)" },
  good:   { bg: "var(--vs-good-bg)",   fg: "var(--vs-good)" },
  warn:   { bg: "var(--vs-warn-bg)",   fg: "var(--vs-warn)" },
  info:   { bg: "var(--vs-info-bg)",   fg: "var(--vs-info)" },
}

export function ActividadCard() {
  const { data: items = [], isLoading } = useActividadReciente()

  if (isLoading) {
    return (
      <div className="bg-vs-card border border-vs-line rounded-[24px] p-5 h-full animate-pulse min-h-[320px]" />
    )
  }

  return (
    <div className="bg-vs-card border border-vs-line rounded-[24px] p-5 flex flex-col h-full">
      <SectionHeader
        overline="Tiempo real"
        title="Actividad reciente"
        right={
          <button className="bg-vs-chip text-vs-ink px-3.5 py-2 rounded-full text-[12px] font-medium hover:bg-[#ebe3d6] transition-colors">
            Filtrar
          </button>
        }
      />

      <div className="relative pl-5 flex-1">
        <div className="absolute left-[10px] top-1 bottom-1 w-px bg-vs-line-2" />
        <div className="flex flex-col gap-3">
          {items.map(item => {
            const t = TONE_STYLES[item.tone]
            const ItemIcon = ICON_MAP[item.iconKey]
            return (
              <div key={item.id} className="relative">
                <div
                  className="absolute -left-5 top-0.5 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: t.bg, color: t.fg }}
                >
                  <ItemIcon size={11} strokeWidth={2.2} />
                </div>
                <div className="pl-2">
                  <div className="text-[11.5px] leading-snug text-[#2b2f36]">
                    {item.texto}
                  </div>
                  <div className="text-[10.5px] text-[#a59682] mt-0.5 font-mono">
                    {item.tiempo}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

"use client"

import { ArrowUpRight } from "lucide-react"
import { SectionHeader } from "@/components/common/SectionHeader"
import { StatusBadge } from "@/components/common/StatusBadge"
import { useOrdenesUrgentes } from "@/features/panel/hooks/useOrdenesUrgentes"
import type { Orden } from "@/features/panel/types/ordenes.types"

function formatDue(orden: Orden): string {
  if (!orden.fechaEstimada) return "Sin fecha"
  const due = new Date(orden.fechaEstimada)
  const now = new Date()
  const diffMs = due.getTime() - now.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays < -1) return `Vencida ${Math.abs(diffDays)}d`
  if (diffDays === -1) return "Vencida 1d"
  if (diffDays === 0) {
    const h = due.getHours().toString().padStart(2, "0")
    const m = due.getMinutes().toString().padStart(2, "0")
    return `Hoy ${h}:${m}`
  }
  return `${diffDays}d restante${diffDays > 1 ? "s" : ""}`
}

function levelTone(orden: Orden): "warn" | "amber" {
  if (!orden.fechaEstimada) return "amber"
  const due = new Date(orden.fechaEstimada)
  return due < new Date() ? "warn" : "amber"
}

const LEVEL_DOT: Record<"past" | "today", string> = {
  past:  "#c85a2a",
  today: "#c99a2e",
}

function dotColor(orden: Orden): string {
  if (!orden.fechaEstimada) return LEVEL_DOT.today
  return new Date(orden.fechaEstimada) < new Date() ? LEVEL_DOT.past : LEVEL_DOT.today
}

export function UrgentesCard() {
  const { data, isLoading } = useOrdenesUrgentes()
  const ordenes = data?.ordenes ?? []

  if (isLoading) {
    return (
      <div className="bg-vs-card border border-vs-line rounded-[24px] p-5 h-full animate-pulse min-h-[320px]" />
    )
  }

  const vencidas = ordenes.filter(
    o => o.fechaEstimada && new Date(o.fechaEstimada) < new Date()
  ).length

  return (
    <div className="bg-vs-card border border-vs-line rounded-[24px] p-5 flex flex-col h-full">
      <SectionHeader
        overline="Atención prioritaria"
        title="Órdenes urgentes"
        right={
          <StatusBadge label={`${vencidas} vencidas`} tone="warn" dot />
        }
      />

      <div className="flex flex-col divide-y divide-vs-line-2 -mx-1 flex-1">
        {ordenes.map(o => (
          <div key={o.externalId} className="flex items-center gap-3 py-2.5 px-1">
            <span
              className="w-1.5 h-10 rounded-full shrink-0"
              style={{ background: dotColor(o) }}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[11.5px] font-mono font-semibold">{o.externalId}</span>
                <span className="text-[11px] text-[#8a7f70] truncate">· {o.nombreCliente}</span>
              </div>
              <div className="text-[11px] text-[#8a7f70] truncate">
                {o.bicicleta.marca} · {o.bicicleta.tipo}
              </div>
            </div>
            <div className="text-right shrink-0">
              <StatusBadge label={formatDue(o)} tone={levelTone(o)} />
              <div className="text-[10px] text-[#a59682] mt-0.5">{o.nombreMecanico}</div>
            </div>
          </div>
        ))}
      </div>

      <button className="mt-3 flex items-center justify-center gap-2 bg-vs-chip text-vs-ink px-4 py-2 rounded-full text-[12px] font-medium hover:bg-[#ebe3d6] transition-colors">
        Ver todas <ArrowUpRight size={14} />
      </button>
    </div>
  )
}

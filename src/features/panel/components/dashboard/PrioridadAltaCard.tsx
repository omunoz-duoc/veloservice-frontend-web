"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { SectionHeader } from "@/components/common/SectionHeader"
import { StatusBadge } from "@/components/common/StatusBadge"
import { useOrdenesQuery } from "@/features/panel/hooks/useOrdenes"
import type { OrdenTrabajo } from "@/features/panel/components/ordenes/ordenes.types"

function dotColor(_orden: OrdenTrabajo): string {
  return "#c99a2e"
}

export function PrioridadAltaCard() {
  const { data, isLoading } = useOrdenesQuery()
  const ordenes = (data ?? []).filter(orden => orden.prioridad === "alta")

  if (isLoading) {
    return (
      <div className="bg-vs-card border border-vs-line rounded-[24px] p-5 h-full animate-pulse min-h-[320px]" />
    )
  }

  return (
    <div className="bg-vs-card border border-vs-line rounded-[24px] p-5 flex flex-col h-full">
      <SectionHeader
        overline="Atencion prioritaria"
        title="Ordenes prioridad alta"
        right={<StatusBadge label={`${ordenes.length} alta prioridad`} tone="warn" dot />}
      />

      <div className="flex flex-col divide-y divide-vs-line-2 -mx-1 flex-1">
        {ordenes.map(orden => (
          <div key={orden.id} className="flex items-center gap-3 py-2.5 px-1">
            <span
              className="w-1.5 h-10 rounded-full shrink-0"
              style={{ background: dotColor(orden) }}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[11.5px] font-mono font-semibold">{orden.id}</span>
                <span className="text-[11px] text-[#8a7f70] truncate">· {orden.clienteNombre}</span>
              </div>
              <div className="text-[11px] text-[#8a7f70] truncate">
                {orden.biciMarca} · {orden.biciTipo}
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[10px] text-[#a59682] mt-0.5">{orden.mecanicoId}</div>
            </div>
          </div>
        ))}
      </div>

      <Link
        href="/ordenes"
        className="mt-3 flex items-center justify-center gap-2 bg-vs-chip text-vs-ink px-4 py-2 rounded-full text-[12px] font-medium hover:bg-[#ebe3d6] transition-colors"
      >
        Ver todas <ArrowUpRight size={14} />
      </Link>
    </div>
  )
}

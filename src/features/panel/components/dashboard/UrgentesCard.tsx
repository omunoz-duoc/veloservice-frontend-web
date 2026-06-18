"use client"

import { AlertTriangle } from "lucide-react"
import { useOrdenesUrgentes } from "@/features/panel/hooks/useOrdenesUrgentes"

const PRIORIDAD_LABELS: Record<string, string> = {
  alta: "Alta",
  media: "Media",
  baja: "Baja",
}

export function UrgentesCard() {
  const { data: ordenes = [], isLoading } = useOrdenesUrgentes()

  return (
    <div className="h-full min-h-[300px] min-w-0 rounded-[24px] border border-vs-line bg-vs-card p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-[#a59682]">Urgentes</div>
          <div className="text-[15px] font-semibold text-vs-ink">Ordenes prioritarias</div>
        </div>
        <div className="grid size-8 shrink-0 place-items-center rounded-full bg-vs-warn-bg text-vs-warn">
          <AlertTriangle size={16} aria-hidden="true" />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[0, 1, 2].map(i => (
            <div key={i} className="h-[86px] rounded-[14px] border border-vs-line-2 bg-white/70 animate-pulse" />
          ))}
        </div>
      ) : ordenes.length === 0 ? (
        <div className="grid min-h-[210px] place-items-center rounded-[16px] border border-dashed border-vs-line-2 bg-white/50 px-4 text-center text-[13px] font-medium text-[#8a7f70]">
          Sin órdenes urgentes
        </div>
      ) : (
        <div className="space-y-2">
          {ordenes.map(orden => (
            <div key={orden.backendId ?? orden.id} className="rounded-[14px] border border-vs-line-2 bg-white p-3 shadow-sm">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="min-w-0 truncate font-mono text-[11px] font-semibold text-vs-ink">{orden.id}</span>
                <span className="shrink-0 rounded-full bg-vs-warn px-2 py-0.5 text-[9px] font-semibold uppercase text-white">
                  {PRIORIDAD_LABELS[orden.prioridad] ?? orden.prioridad}
                </span>
              </div>
              <div className="truncate text-[12px] font-semibold text-[#4a4438]">{orden.clienteNombre}</div>
              <div className="mt-0.5 truncate text-[11px] text-[#8a7f70]">
                {orden.biciMarca} - {orden.biciTipo}
              </div>
              <div className="mt-2 text-[10px] font-medium text-[#a59682]">
                Prometida: {orden.fechaEstimada || "Sin fecha"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

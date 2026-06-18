"use client"

import { useState } from "react"
import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { ESTADO_CONFIG } from "./ordenes.constants"
import type { EstadoOT } from "./ordenes.types"
import { useBulkUpdateOrdenesMutation } from "@/features/panel/hooks/useOrdenes"

export function BulkEstadoModal({
  ids,
  onClose,
  onSuccess,
}: {
  ids: string[]
  onClose: () => void
  onSuccess: () => void
}) {
  const bulkUpdateOrdenes = useBulkUpdateOrdenesMutation()
  const [selected, setSelected] = useState<EstadoOT | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConfirm = async () => {
    console.log("CONFIRM CLICK", selected, ids)
    if (!selected) return
    setLoading(true)
    setError(null)
    try {
      await bulkUpdateOrdenes.mutateAsync({ ids, changes: { estado: selected } })
      onSuccess()
     } catch (err) {
       console.error("BULK ESTADO ERROR", err)
        setError("Error al cambiar estado. Intenta de nuevo.")
        
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-[420px] rounded-[24px] bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[15px] font-semibold text-vs-ink">
            Cambiar estado de{" "}
            <span className="font-mono">{ids.length}</span>{" "}
            {ids.length === 1 ? "orden" : "órdenes"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-vs-chip flex items-center justify-center hover:bg-[#ebe3d6] transition-colors"
          >
            <X size={14} strokeWidth={1.8} />
          </button>
        </div>

        <div className="space-y-2 mb-5">
          {(Object.entries(ESTADO_CONFIG) as [EstadoOT, (typeof ESTADO_CONFIG)[EstadoOT]][]).map(
            ([estado, cfg]) => (
              <button
                key={estado}
                onClick={() => setSelected(estado)}
                className={cn(
                  "flex items-center gap-3 w-full px-4 py-3 rounded-[14px] border-2 text-left transition-colors",
                  selected === estado
                    ? "border-vs-ink bg-vs-chip"
                    : "border-transparent bg-vs-chip hover:bg-[#ebe3d6]"
                )}
              >
                <span
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: cfg.bg, color: cfg.fg }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: cfg.dot }}
                  />
                  {cfg.label}
                </span>
                {selected === estado && (
                  <Check size={14} strokeWidth={2.5} className="ml-auto text-vs-ink" />
                )}
              </button>
            )
          )}
        </div>

        {error && <p className="text-[12px] text-red-500 mb-3">{error}</p>}

        <div className="flex gap-2">
          <button
            onClick={handleConfirm}
            disabled={!selected || loading}
            className="flex-1 bg-vs-ink text-white text-[13px] font-medium py-2.5 rounded-full hover:bg-[#1e2228] disabled:opacity-50 transition-colors"
          >
            {loading ? "Guardando…" : "Confirmar"}
          </button>
          <button
            onClick={onClose}
            className="px-5 bg-vs-chip text-vs-ink text-[13px] font-medium py-2.5 rounded-full hover:bg-[#ebe3d6] transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}

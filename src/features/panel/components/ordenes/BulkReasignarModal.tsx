"use client"

import { useState, useEffect } from "react"
import { X, Check, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Mecanico } from "@/features/panel/types/mecanicos.types"
import { mecanicosService } from "@/features/panel/services/mecanicos.provider"
import { useBulkUpdateOrdenesMutation } from "@/features/panel/hooks/useOrdenes"

export function BulkReasignarModal({
  ids,
  onClose,
  onSuccess,
}: {
  ids: string[]
  onClose: () => void
  onSuccess: () => void
}) {
  const bulkUpdateOrdenes = useBulkUpdateOrdenesMutation()
  const [mecanicos, setMecanicos] = useState<Mecanico[]>([])
  const [fetchLoading, setFetchLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [selected, setSelected] = useState<Mecanico | null>(null)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    mecanicosService
      .getMecanicosActivos()
      .then(data => {const lista = Array.isArray(data) ? data : data.mecanicos ?? []
       setMecanicos(lista)})
      .catch(() => setFetchError("No se pudo cargar la lista de mecánicos."))
      .finally(() => setFetchLoading(false))
  }, [])

  const handleConfirm = async () => {
    if (!selected) return
    setSubmitLoading(true)
    setSubmitError(null)
    try {
      await bulkUpdateOrdenes.mutateAsync({ ids, changes: { mecanicoId: selected.id } })
      onSuccess()
    } catch {
      setSubmitError("Error al reasignar. Intenta de nuevo.")
    } finally {
      setSubmitLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-[460px] rounded-[24px] bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[15px] font-semibold text-vs-ink">
            Reasignar{" "}
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

        {fetchLoading && (
          <div className="flex items-center justify-center py-10">
            <Loader2 size={20} className="animate-spin text-[#a59682]" />
          </div>
        )}

        {fetchError && (
          <p className="text-[12px] text-red-500 mb-4">{fetchError}</p>
        )}

        {!fetchLoading && !fetchError && (
          <div className="space-y-1.5 mb-5 max-h-[300px] overflow-y-auto pr-1">
            {mecanicos.map(mec => {
              const carga = mec.ordenesCursando?.length ?? 0
              const capacidad = mec.capacidad || 1
              const pct = Math.min(100, Math.round((carga / capacidad) * 100))
              return (
                <button
                  key={mec.id}
                  onClick={() => setSelected(mec)}
                  className={cn(
                    "flex items-center gap-3 w-full px-3 py-2.5 rounded-[14px] border-2 text-left transition-colors",
                    selected?.id === mec.id
                      ? "border-vs-ink bg-vs-chip"
                      : "border-transparent hover:bg-vs-chip"
                  )}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                    style={{ background: mec.color }}
                  >
                    {mec.iniciales}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-vs-ink truncate">
                      {mec.nombre} {mec.apellido}
                    </div>
                    <div className="text-[11px] text-[#a59682]">
                      {mec.especialidad ?? "Mecánico"} · {carga}/{capacidad} OTs ({pct}%)
                    </div>
                  </div>
                  {selected?.id === mec.id && (
                    <Check size={14} strokeWidth={2.5} className="text-vs-ink shrink-0" />
                  )}
                </button>
              )
            })}
          </div>
        )}

        {submitError && (
          <p className="text-[12px] text-red-500 mb-3">{submitError}</p>
        )}

        <div className="flex gap-2">
          <button
            onClick={handleConfirm}
            disabled={!selected || submitLoading || fetchLoading}
            className="flex-1 bg-vs-ink text-white text-[13px] font-medium py-2.5 rounded-full hover:bg-[#1e2228] disabled:opacity-50 transition-colors"
          >
            {submitLoading ? "Guardando…" : "Confirmar reasignación"}
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

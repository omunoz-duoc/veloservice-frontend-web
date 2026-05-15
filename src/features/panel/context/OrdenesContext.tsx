"use client"

import { createContext, useContext, useState, useMemo, useEffect, type ReactNode } from "react"
import { type OrdenTrabajo, type EstadoOT as FrontendEstadoOT } from "../components/ordenes/ordenes.mock"
import { NuevaOTModal } from "../components/ordenes/NuevaOTModal"
import { mapApiOrden, ESTADO_TO_API_MAP } from "../services/ordenes.service"
import { ordenesService } from "../services/ordenes.provider"
import type { BulkUpdateOrdenPayload } from "../types/ordenes.types"

type BulkChanges = {
  estado?: FrontendEstadoOT
  mecanicoId?: string
}

type OrdenesContextValue = {
  ordenes: OrdenTrabajo[]
  addOrden: (orden: OrdenTrabajo) => void
  updateOrden: (orden: OrdenTrabajo) => void
  bulkUpdateOrdenes: (ids: string[], changes: BulkChanges) => Promise<void>
  openNuevaOT: () => void
}

const OrdenesContext = createContext<OrdenesContextValue | null>(null)

export function OrdenesProvider({ children }: { children: ReactNode }) {
  const [ordenes, setOrdenes] = useState<OrdenTrabajo[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    ordenesService.getOrdenes()
      .then(({ ordenes }) => setOrdenes(ordenes.map(mapApiOrden)))
      .catch(() => {})
  }, [])

  const addOrden = (orden: OrdenTrabajo) => {
    setOrdenes(prev => [orden, ...prev])
    setIsOpen(false)
  }

  const updateOrden = (updated: OrdenTrabajo) =>
    setOrdenes(prev => prev.map(o => o.id === updated.id ? updated : o))

  const bulkUpdateOrdenes = async (ids: string[], changes: BulkChanges) => {
    const payload: BulkUpdateOrdenPayload = { ids }
    if (changes.estado !== undefined) payload.estado = ESTADO_TO_API_MAP[changes.estado]
    if (changes.mecanicoId !== undefined) payload.mecanicoId = changes.mecanicoId
    await ordenesService.bulkUpdateOrdenes(payload)
    setOrdenes(prev => prev.map(o =>
      ids.includes(o.id) ? { ...o, ...changes } : o
    ))
  }

  const nextId = useMemo(() => {
    const nums = ordenes.map(o => parseInt(o.id.replace(/\D/g, ""))).filter(n => !isNaN(n) && n > 0)
    const last = nums.length ? Math.max(...nums) : 343
    return `OT-${(last + 1).toString().padStart(4, "0")}`
  }, [ordenes])

  return (
    <OrdenesContext.Provider value={{ ordenes, addOrden, updateOrden, bulkUpdateOrdenes, openNuevaOT: () => setIsOpen(true) }}>
      {children}
      {isOpen && (
        <NuevaOTModal
          nextId={nextId}
          onClose={() => setIsOpen(false)}
          onCreate={addOrden}
        />
      )}
    </OrdenesContext.Provider>
  )
}

export function useOrdenes() {
  const ctx = useContext(OrdenesContext)
  if (!ctx) throw new Error("useOrdenes must be used inside OrdenesProvider")
  return ctx
}

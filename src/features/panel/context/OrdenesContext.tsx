"use client"

import { createContext, useContext, useState, useMemo, type ReactNode } from "react"
import { ORDENES_MOCK, type OrdenTrabajo } from "../components/ordenes/ordenes.mock"
import { NuevaOTModal } from "../components/ordenes/NuevaOTModal"

type OrdenesContextValue = {
  ordenes: OrdenTrabajo[]
  addOrden: (orden: OrdenTrabajo) => void
  updateOrden: (orden: OrdenTrabajo) => void
  openNuevaOT: () => void
}

const OrdenesContext = createContext<OrdenesContextValue | null>(null)

export function OrdenesProvider({ children }: { children: ReactNode }) {
  const [ordenes, setOrdenes] = useState<OrdenTrabajo[]>(ORDENES_MOCK)
  const [isOpen, setIsOpen] = useState(false)

  const addOrden = (orden: OrdenTrabajo) => {
    setOrdenes(prev => [orden, ...prev])
    setIsOpen(false)
  }

  const updateOrden = (updated: OrdenTrabajo) =>
    setOrdenes(prev => prev.map(o => o.id === updated.id ? updated : o))

  const nextId = useMemo(() => {
    const last = parseInt(ordenes[0]?.id?.split("-")[1] ?? "0343")
    return `OT-0${(last + 1).toString().padStart(4, "0")}`
  }, [ordenes])

  return (
    <OrdenesContext.Provider value={{ ordenes, addOrden, updateOrden, openNuevaOT: () => setIsOpen(true) }}>
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

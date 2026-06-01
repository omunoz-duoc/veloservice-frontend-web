"use client"

import { createContext, useContext, useEffect, useState, useMemo, type ReactNode } from "react"
import { useQuery } from "@tanstack/react-query"
import { usePathname } from "next/navigation"
import type { OrdenTrabajo } from "../components/ordenes/ordenes.mock"
import { NuevaOTModal } from "../components/ordenes/NuevaOTModal"
import { ordenesService } from "@/features/panel/services/ordenes.service"

type OrdenesContextValue = {
  ordenes: OrdenTrabajo[]
  isLoading: boolean
  isError: boolean
  error: Error | null
  addOrden: (orden: OrdenTrabajo) => void
  updateOrden: (orden: OrdenTrabajo) => void
  openNuevaOT: () => void
}

const OrdenesContext = createContext<OrdenesContextValue | null>(null)

export function OrdenesProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const shouldFetchOrdenes = pathname === "/ordenes"
  const [ordenes, setOrdenes] = useState<OrdenTrabajo[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["ordenes"],
    queryFn: ordenesService.list,
    enabled: shouldFetchOrdenes,
  })

  useEffect(() => {
    if (data) setOrdenes(data)
  }, [data])

  const addOrden = (orden: OrdenTrabajo) => {
    setOrdenes(prev => [orden, ...prev])
    setIsOpen(false)
  }

  const updateOrden = (updated: OrdenTrabajo) =>
    setOrdenes(prev => prev.map(o => {
      const currentKey = o.backendId ?? o.id
      const updatedKey = updated.backendId ?? updated.id
      return currentKey === updatedKey ? updated : o
    }))

  const nextId = useMemo(() => {
    const last = parseInt(ordenes[0]?.id?.match(/\d+/)?.[0] ?? "0")
    return `OT-0${(last + 1).toString().padStart(4, "0")}`
  }, [ordenes])

  return (
    <OrdenesContext.Provider value={{ ordenes, isLoading, isError, error, addOrden, updateOrden, openNuevaOT: () => setIsOpen(true) }}>
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

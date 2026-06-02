"use client"

import { createContext, useContext, useMemo, useState, type ReactNode } from "react"
import { NuevaOTModal } from "../components/ordenes/NuevaOTModal"
import { nextOrdenId, useCreateOrdenCacheMutation, useOrdenesQuery } from "../hooks/useOrdenes"

type OrdenesContextValue = {
  openNuevaOT: () => void
}

const OrdenesContext = createContext<OrdenesContextValue | null>(null)

export function OrdenesProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const { data: ordenes = [] } = useOrdenesQuery()
  const createOrdenCache = useCreateOrdenCacheMutation()

  const nextId = useMemo(() => {
    return nextOrdenId(ordenes)
  }, [ordenes])

  return (
    <OrdenesContext.Provider value={{ openNuevaOT: () => setIsOpen(true) }}>
      {children}
      {isOpen && (
        <NuevaOTModal
          nextId={nextId}
          onClose={() => setIsOpen(false)}
          onCreate={(orden) => {
            createOrdenCache.mutate(orden)
            setIsOpen(false)
          }}
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

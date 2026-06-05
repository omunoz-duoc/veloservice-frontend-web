"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { NuevaOTModal } from "../components/ordenes/NuevaOTModal"
import { useInvalidateOrdenes } from "../hooks/useOrdenes"

type OrdenesContextValue = {
  openNuevaOT: () => void
}

const OrdenesContext = createContext<OrdenesContextValue | null>(null)

export function OrdenesProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const invalidateOrdenes = useInvalidateOrdenes()

  return (
    <OrdenesContext.Provider value={{ openNuevaOT: () => setIsOpen(true) }}>
      {children}
      {isOpen && (
        <NuevaOTModal
          onClose={() => setIsOpen(false)}
          onCreate={() => {
            invalidateOrdenes()
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

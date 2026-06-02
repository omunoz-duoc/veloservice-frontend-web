import { useQuery } from "@tanstack/react-query"
import { ordenesService } from "@/features/panel/services/ordenes.provider"
import type { BoardData } from "react-kanban-kit"
import type { OrdenTrabajo } from "@/features/panel/types/ordenes.types"

type KanbanColumna = {
  key: string
  label: string
  color: string
  estado: string
}

const COLUMNAS: KanbanColumna[] = [
  { key: "col-recibido",  label: "Recibido",    color: "#a59682", estado: "recibido" },
  { key: "col-proceso",   label: "En proceso",  color: "#6b5bd1", estado: "proceso" },
  { key: "col-listo",     label: "Listo",       color: "#2f7d4f", estado: "listo" },
  { key: "col-entregado", label: "Entregado",   color: "#3a6ea5", estado: "entregado" },
]

function ordenesToBoardData(ordenes: OrdenTrabajo[]): BoardData {
  const byEstado: Record<string, OrdenTrabajo[]> = {}
  for (const col of COLUMNAS) byEstado[col.estado] = []
  for (const o of ordenes) {
    if (byEstado[o.estado]) byEstado[o.estado].push(o)
  }

  const data: BoardData = {
    root: {
      id: "root",
      title: "Órdenes",
      children: COLUMNAS.map(c => c.key),
      totalChildrenCount: COLUMNAS.length,
      parentId: null,
    },
  }

  for (const col of COLUMNAS) {
    const items = byEstado[col.estado]
    const cardIds = items.map(o => `card-${o.numeroOrden}`)

    data[col.key] = {
      id: col.key,
      title: col.label,
      children: cardIds,
      totalChildrenCount: cardIds.length,
      parentId: "root",
    }

    for (const o of items) {
      const id = `card-${o.numeroOrden}`
      data[id] = {
        id,
        title: o.numeroOrden ?? "",
        children: [],
        totalChildrenCount: 0,
        parentId: col.key,
        type: "card",
        content: {
          cliente: o.cliente,
          bici: `${o.bicicleta.marca} · ${o.bicicleta.tipo}`,
          mecanico: o.mecanico,
          prioridad: o.prioridad,
          color: col.color,
        },
      }
    }
  }

  return data
}

export function useOrdenesKanban() {
  return useQuery({
    queryKey: ["ordenes", "kanban"],
    queryFn: async () => {
      const res = await ordenesService.getOrdenes()
      return ordenesToBoardData(res.ordenes)
    },
    staleTime: 60 * 1000,
  })
}

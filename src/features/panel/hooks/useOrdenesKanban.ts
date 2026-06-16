import { useQuery } from "@tanstack/react-query"
import { ordenesService } from "@/features/panel/services/ordenes.provider"
import { mapApiOrden } from "@/features/panel/services/ordenes.service"
import { getActiveSucursalId } from "@/lib/sucursales"
import type { BoardData } from "react-kanban-kit"
import type { EstadoOT, OrdenTrabajo } from "@/features/panel/components/ordenes/ordenes.types"

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

function estadoKanban(estado: EstadoOT) {
  if (estado === "recibido") return "recibido"
  if (estado === "listo") return "listo"
  if (estado === "entregado") return "entregado"
  if (estado === "diagnostico" || estado === "espera" || estado === "proceso" || estado === "calidad") {
    return "proceso"
  }
  return null
}

function ordenesToBoardData(ordenes: OrdenTrabajo[]): BoardData {
  const byEstado: Record<string, OrdenTrabajo[]> = {}
  for (const col of COLUMNAS) byEstado[col.estado] = []
  for (const o of ordenes) {
    const estado = estadoKanban(o.estado)
    if (estado && byEstado[estado]) byEstado[estado].push(o)
  }

  const data: BoardData = {
    root: {
      id: "root",
      title: "Ordenes",
      children: COLUMNAS.map(c => c.key),
      totalChildrenCount: COLUMNAS.length,
      parentId: null,
    },
  }

  for (const col of COLUMNAS) {
    const items = byEstado[col.estado]
    const cardIds = items.map(o => `card-${o.id}`)

    data[col.key] = {
      id: col.key,
      title: col.label,
      children: cardIds,
      totalChildrenCount: cardIds.length,
      parentId: "root",
    }

    for (const o of items) {
      const id = `card-${o.id}`
      data[id] = {
        id,
        title: o.id,
        children: [],
        totalChildrenCount: 0,
        parentId: col.key,
        type: "card",
        content: {
          ordenId: o.backendId ?? o.id,
          cliente: o.clienteNombre,
          bici: `${o.biciMarca} - ${o.biciTipo}`,
          mecanico: o.mecanicoId,
          prioridad: o.prioridad,
          estado: o.estado,
          color: col.color,
        },
      }
    }
  }

  return data
}

export function useOrdenesKanban() {
  const sucursalId = getActiveSucursalId()

  return useQuery({
    queryKey: ["ordenes", "kanban", sucursalId],
    queryFn: async () => {
      const res = await ordenesService.getOrdenes()
      return ordenesToBoardData(res.ordenes.map(mapApiOrden))
    },
    staleTime: 60 * 1000,
  })
}

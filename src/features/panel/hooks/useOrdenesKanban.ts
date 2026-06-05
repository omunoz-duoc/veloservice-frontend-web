import { useQuery } from "@tanstack/react-query"
import { ordenesService } from "@/features/panel/services/ordenes.provider"
import type { BoardData } from "react-kanban-kit"
import type { OrdenTrabajo } from "@/features/panel/components/ordenes/ordenes.types"
import type { OrdenCatalogoItem } from "@/features/panel/types/ordenes.types"
import { ESTADO_COLORS, ORDEN_CATALOGOS_FALLBACK } from "@/features/panel/services/ordenes.catalogos"
import { mapApiOrden } from "@/features/panel/services/ordenes.service"

type KanbanColumna = {
  key: string
  label: string
  color: string
  estado: string
}

function columnasFromCatalog(estados: OrdenCatalogoItem[]): KanbanColumna[] {
  return estados.map(estado => ({
    key: `col-${estado.codigo}`,
    label: estado.nombre,
    color: ESTADO_COLORS[estado.codigo as keyof typeof ESTADO_COLORS]?.dot ?? "#a59682",
    estado: estado.codigo,
  }))
}

function ordenesToBoardData(ordenes: OrdenTrabajo[], estados: OrdenCatalogoItem[]): BoardData {
  const columnas = columnasFromCatalog(estados.length ? estados : ORDEN_CATALOGOS_FALLBACK.estados)
  const byEstado: Record<string, OrdenTrabajo[]> = {}
  for (const col of columnas) byEstado[col.estado] = []
  for (const orden of ordenes) {
    if (byEstado[orden.estado]) byEstado[orden.estado].push(orden)
  }

  const data: BoardData = {
    root: {
      id: "root",
      title: "Ordenes",
      children: columnas.map(col => col.key),
      totalChildrenCount: columnas.length,
      parentId: null,
    },
  }

  for (const col of columnas) {
    const items = byEstado[col.estado]
    const cardIds = items.map(orden => `card-${orden.id}`)

    data[col.key] = {
      id: col.key,
      title: col.label,
      children: cardIds,
      totalChildrenCount: cardIds.length,
      parentId: "root",
    }

    for (const orden of items) {
      const id = `card-${orden.id}`
      data[id] = {
        id,
        title: orden.id,
        children: [],
        totalChildrenCount: 0,
        parentId: col.key,
        type: "card",
        content: {
          cliente: orden.clienteNombre,
          bici: `${orden.biciMarca} · ${orden.biciTipo}`,
          mecanico: orden.mecanicoId,
          prioridad: orden.prioridad,
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
      const [res, estados] = await Promise.all([
        ordenesService.getOrdenes(),
        ordenesService.getEstadosOrden().catch(() => ORDEN_CATALOGOS_FALLBACK.estados),
      ])
      return ordenesToBoardData(res.ordenes.map(mapApiOrden), estados)
    },
    staleTime: 60 * 1000,
  })
}

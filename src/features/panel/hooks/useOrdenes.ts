"use client"

import { useCallback } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ordenesService } from "@/features/panel/services/ordenes.provider"
import { ESTADO_TO_API_MAP, mapApiOrden } from "@/features/panel/services/ordenes.service"
import type {
  BulkUpdateOrdenPayload,
  UpdateOrdenPayload,
} from "@/features/panel/types/ordenes.types"
import type { EstadoOT, OrdenTrabajo, Prioridad, TipoOT } from "@/features/panel/components/ordenes/ordenes.types"

export const ordenesQueryKey = ["ordenes", "list"] as const

export const ordenDetalleQueryKey = (ordenId: string) => ["ordenes", "detalle", ordenId] as const

type BulkChanges = {
  estado?: EstadoOT
  mecanicoId?: string
}

const TIPO_TO_API_MAP: Record<TipoOT, string> = {
  personalizacion: "revision",
  mantencion: "mantencion",
  reparacion: "reparacion",
  revision: "revision",
  diagnostico: "diagnostico",
  overhaul: "overhaul",
  garantia: "garantia",
  armado: "armado",
}

const PRIORIDAD_TO_API_MAP: Record<Prioridad, string> = {
  baja: "baja",
  media: "media",
  alta: "alta",
  urgente: "urgente",
}

function toUpdatePayload(orden: OrdenTrabajo): UpdateOrdenPayload {
  return {
    estadoCodigo: ESTADO_TO_API_MAP[orden.estado],
    estadoObservacion: "Cambio de estado desde panel web",
    tipoCodigo: orden.tipo?.codigo ? TIPO_TO_API_MAP[orden.tipo.codigo as TipoOT] : undefined,
    prioridad: PRIORIDAD_TO_API_MAP[orden.prioridad],
    mecanicoId: orden.mecanicoId,
  }
}

export function nextOrdenId(ordenes: OrdenTrabajo[]) {
  const nums = ordenes
    .map(o => parseInt(o.id.replace(/\D/g, ""), 10))
    .filter(n => !Number.isNaN(n) && n > 0)
  const last = nums.length ? Math.max(...nums) : 343
  return `OT-${(last + 1).toString().padStart(4, "0")}`
}

export function useOrdenesQuery() {
  return useQuery({
    queryKey: ordenesQueryKey,
    queryFn: async () => {
      const { ordenes } = await ordenesService.getOrdenes()
      return ordenes.map(mapApiOrden)
    },
    staleTime: 30_000,
  })
}

export function useOrdenDetalleQuery(ordenId: string) {
  return useQuery({
    queryKey: ordenDetalleQueryKey(ordenId),
    queryFn: () => ordenesService.getOrdenById(ordenId),
    staleTime: 30_000,
    enabled: !!ordenId,
  })
}

/**
 * Returns a callback that invalidates every ordenes query (list + kanban + detalle),
 * forcing a refetch. Used after creating an OT so all subscribed views update.
 */
export function useInvalidateOrdenes() {
  const queryClient = useQueryClient()
  return useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ["ordenes"] })
  }, [queryClient])
}

export function useCreateOrdenCacheMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (orden: OrdenTrabajo) => orden,
    onSuccess: orden => {
      queryClient.setQueryData<OrdenTrabajo[]>(ordenesQueryKey, current => {
        const ordenes = current ?? []
        return ordenes.some(o => o.id === orden.id) ? ordenes : [orden, ...ordenes]
      })
      void queryClient.invalidateQueries({ queryKey: ordenesQueryKey })
    },
  })
}

export function useUpdateOrdenMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (orden: OrdenTrabajo) => {
      await ordenesService.updateOrden(orden.backendId ?? orden.id, toUpdatePayload(orden))
      return orden
    },
    onSuccess: updated => {
      const updatedLookupId = updated.backendId ?? updated.id
      queryClient.setQueryData<OrdenTrabajo[]>(ordenesQueryKey, current =>
        (current ?? []).map(o => {
          const lookupId = o.backendId ?? o.id
          return lookupId === updatedLookupId || o.id === updated.id ? { ...o, ...updated } : o
        })
      )
      void queryClient.invalidateQueries({ queryKey: ordenesQueryKey })
      void queryClient.invalidateQueries({ queryKey: ordenDetalleQueryKey(updatedLookupId) })
      if (updatedLookupId !== updated.id) {
        void queryClient.invalidateQueries({ queryKey: ordenDetalleQueryKey(updated.id) })
      }
    },
  })
}

export function useChangeOrdenEstadoMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (orden: Pick<OrdenTrabajo, "id" | "backendId" | "estado">) => {
      const lookupId = orden.backendId ?? orden.id
      await ordenesService.cambiarEstado(lookupId, {
        codigo: ESTADO_TO_API_MAP[orden.estado],
        observacion: "Cambio de estado desde panel web",
      })
      return orden
    },
    onSuccess: updated => {
      const updatedLookupId = updated.backendId ?? updated.id
      queryClient.setQueryData<OrdenTrabajo[]>(ordenesQueryKey, current =>
        (current ?? []).map(o => {
          const lookupId = o.backendId ?? o.id
          return lookupId === updatedLookupId || o.id === updated.id ? { ...o, estado: updated.estado } : o
        })
      )
      void queryClient.invalidateQueries({ queryKey: ordenesQueryKey })
      void queryClient.invalidateQueries({ queryKey: ordenDetalleQueryKey(updatedLookupId) })
      if (updatedLookupId !== updated.id) {
        void queryClient.invalidateQueries({ queryKey: ordenDetalleQueryKey(updated.id) })
      }
    },
  })
}

export function useBulkUpdateOrdenesMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ ids, changes }: { ids: string[]; changes: BulkChanges }) => {
      const payload: BulkUpdateOrdenPayload = { ids }
      if (changes.estado !== undefined) payload.estado = ESTADO_TO_API_MAP[changes.estado]
      if (changes.mecanicoId !== undefined) payload.mecanicoId = changes.mecanicoId
      await ordenesService.bulkUpdateOrdenes(payload)
      return { ids, changes }
    },
    onSuccess: ({ ids, changes }) => {
      queryClient.setQueryData<OrdenTrabajo[]>(ordenesQueryKey, current =>
        (current ?? []).map(o => ids.includes(o.id) ? { ...o, ...changes } : o)
      )
      void queryClient.invalidateQueries({ queryKey: ordenesQueryKey })
    },
  })
}

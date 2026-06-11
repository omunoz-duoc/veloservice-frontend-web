"use client"

import { useCallback } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ordenesService } from "@/features/panel/services/ordenes.provider"
import { ESTADO_TO_API_MAP, mapApiOrden } from "@/features/panel/services/ordenes.service"
import type {
  OrdenProductoCambioPayload,
  OrdenServicioCambioPayload,
  UpdateOrdenPayload,
} from "@/features/panel/types/ordenes.types"
import type { EstadoOT, OrdenTrabajo, Prioridad } from "@/features/panel/components/ordenes/ordenes.types"

export const ordenesQueryKey = ["ordenes", "list"] as const

export const ordenDetalleQueryKey = (ordenId: string) => ["ordenes", "detalle", ordenId] as const

type BulkChanges = {
  estado?: EstadoOT
  mecanicoId?: string
}

type UpdateOrdenDraft = OrdenTrabajo & {
  productosCambios?: OrdenProductoCambioPayload[]
  serviciosCambios?: OrdenServicioCambioPayload[]
}

const TIPO_TO_API_MAP: Record<string, string> = {
  personalizacion: "revision",
  mantencion: "mantencion",
  reparacion: "reparacion",
  revision: "revision",
  diagnostico: "revision",
  overhaul: "revision",
  garantia: "garantia",
  armado: "armado",
}

const PRIORIDAD_TO_API_MAP: Record<Prioridad, string> = {
  baja: "baja",
  media: "media",
  alta: "alta",
}

function isUuid(value: string | null | undefined) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value ?? "")
}

function toUpdatePayload(orden: UpdateOrdenDraft): UpdateOrdenPayload {
  const payload: UpdateOrdenPayload = {
    tipoCodigo: orden.tipo?.codigo ? TIPO_TO_API_MAP[orden.tipo.codigo] ?? "revision" : undefined,
    prioridad: PRIORIDAD_TO_API_MAP[orden.prioridad],
  }
  if (isUuid(orden.mecanicoId)) payload.mecanicoId = orden.mecanicoId
  if (orden.serviciosCambios && orden.serviciosCambios.length > 0) payload.serviciosCambios = orden.serviciosCambios
  if (orden.productosCambios && orden.productosCambios.length > 0) payload.productosCambios = orden.productosCambios
  return payload
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
    mutationFn: async (orden: UpdateOrdenDraft) => {
      await ordenesService.updateOrden(orden.backendId ?? orden.id, toUpdatePayload(orden))
      const { productosCambios, serviciosCambios, ...updated } = orden
      void productosCambios
      void serviciosCambios
      return updated
    },
    onSuccess: updated => {
      const updatedLookupId = updated.backendId ?? updated.id
      queryClient.setQueryData<OrdenTrabajo[]>(ordenesQueryKey, current =>
        (current ?? []).map(o => {
          const lookupId = o.backendId ?? o.id
          return lookupId === updatedLookupId || o.id === updated.id ? { ...o, ...updated } : o
        })
      )
      void queryClient.invalidateQueries({ queryKey: ["ordenes"] })
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
      await Promise.all(
        ids.map(id => {
          if (changes.estado !== undefined) {
            return ordenesService.cambiarEstado(id, {
              codigo: ESTADO_TO_API_MAP[changes.estado],
              observacion: "Cambio de estado desde panel web",
            })
          }

          if (changes.mecanicoId !== undefined) {
            return ordenesService.updateOrden(id, {
              mecanicoId: changes.mecanicoId,
            })
          }

          return Promise.resolve()
        })
      )

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

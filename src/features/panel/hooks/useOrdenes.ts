"use client"

import { useCallback } from "react"
import { useMutation, useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query"
import { ordenesService } from "@/features/panel/services/ordenes.provider"
import { ESTADO_TO_API_MAP, mapApiOrden } from "@/features/panel/services/ordenes.service"
import type {
  OrdenTrabajoDetalle,
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
  estadoOriginal?: EstadoOT
  productosCambios?: OrdenProductoCambioPayload[]
  serviciosCambios?: OrdenServicioCambioPayload[]
}

type UpdateOrdenMutationInput = {
  draft: UpdateOrdenDraft
  original: OrdenTrabajo
}

const ESTADO_CHANGE_OBSERVATION = "Cambio de estado desde panel web"

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

export function hasUpdateOrdenPayloadChanges(payload: UpdateOrdenPayload) {
  return (
    payload.estadoCodigo !== undefined ||
    payload.tipoCodigo !== undefined ||
    payload.prioridad !== undefined ||
    payload.mecanicoId !== undefined ||
    (payload.serviciosCambios?.length ?? 0) > 0 ||
    (payload.productosCambios?.length ?? 0) > 0
  )
}

export function buildUpdateOrdenPayload(draft: UpdateOrdenDraft, original: OrdenTrabajo): UpdateOrdenPayload {
  const payload: UpdateOrdenPayload = {}

  if (draft.estado !== original.estado) {
    payload.estadoCodigo = ESTADO_TO_API_MAP[draft.estado]
    payload.estadoObservacion = ESTADO_CHANGE_OBSERVATION
  }

  const draftTipoCodigo = draft.tipo?.codigo
  if (draftTipoCodigo && draftTipoCodigo !== original.tipo?.codigo) {
    payload.tipoCodigo = TIPO_TO_API_MAP[draftTipoCodigo] ?? "revision"
  }

  if (draft.prioridad !== original.prioridad) {
    payload.prioridad = PRIORIDAD_TO_API_MAP[draft.prioridad]
  }

  if (draft.mecanicoId !== original.mecanicoId && isUuid(draft.mecanicoId)) {
    payload.mecanicoId = draft.mecanicoId
  }

  if (draft.serviciosCambios && draft.serviciosCambios.length > 0) payload.serviciosCambios = draft.serviciosCambios
  if (draft.productosCambios && draft.productosCambios.length > 0) payload.productosCambios = draft.productosCambios
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
    mutationFn: async ({ draft, original }: UpdateOrdenMutationInput) => {
      const payload = buildUpdateOrdenPayload(draft, original)
      const { productosCambios, serviciosCambios, ...updated } = draft
      void productosCambios
      void serviciosCambios

      if (!hasUpdateOrdenPayloadChanges(payload)) {
        return { updated }
      }

      const detail = await ordenesService.updateOrden(draft.backendId ?? draft.id, payload)
      return { updated, detail }
    },
    onSuccess: ({ updated, detail }) => {
      const updatedLookupId = updated.backendId ?? updated.id
      const listOrden = detail ? mapApiOrden(detail, 0) : updated

      if (detail) {
        setOrdenDetalleCache(queryClient, updatedLookupId, detail)
      }

      queryClient.setQueryData<OrdenTrabajo[]>(ordenesQueryKey, current =>
        (current ?? []).map(o => {
          return isSameCachedOrden(o, updatedLookupId, listOrden)
            ? { ...o, ...listOrden }
            : o
        })
      )
      queryClient.setQueryData<OrdenTrabajo[]>(["ordenes", "urgentes"], current => {
        if (!current) return current
        const hasOrden = current.some(o => isSameCachedOrden(o, updatedLookupId, listOrden))
        if (listOrden.prioridad !== "alta") {
          return current.filter(o => !isSameCachedOrden(o, updatedLookupId, listOrden))
        }
        if (!hasOrden) return [listOrden, ...current]
        return current.map(o => isSameCachedOrden(o, updatedLookupId, listOrden) ? { ...o, ...listOrden } : o)
      })
    },
  })
}

function isSameCachedOrden(orden: OrdenTrabajo, updatedLookupId: string, listOrden: OrdenTrabajo) {
  const lookupId = orden.backendId ?? orden.id
  const listLookupId = listOrden.backendId ?? listOrden.id
  return lookupId === updatedLookupId || lookupId === listLookupId || orden.id === listOrden.id
}

function setOrdenDetalleCache(
  queryClient: QueryClient,
  requestedId: string,
  detail: OrdenTrabajoDetalle
) {
  queryClient.setQueryData(ordenDetalleQueryKey(requestedId), detail)
  if (detail.id !== requestedId) {
    queryClient.setQueryData(ordenDetalleQueryKey(detail.id), detail)
  }
  if (detail.numeroOrden !== requestedId && detail.numeroOrden !== detail.id) {
    queryClient.setQueryData(ordenDetalleQueryKey(detail.numeroOrden), detail)
  }
}

export function useChangeOrdenEstadoMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (orden: Pick<OrdenTrabajo, "id" | "backendId" | "estado">) => {
      const lookupId = orden.backendId ?? orden.id
      await ordenesService.cambiarEstado(lookupId, {
        codigo: ESTADO_TO_API_MAP[orden.estado],
        observacion: ESTADO_CHANGE_OBSERVATION,
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
      void queryClient.invalidateQueries({ queryKey: ["ordenes", "urgentes"] })
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
              observacion: ESTADO_CHANGE_OBSERVATION,
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
      void queryClient.invalidateQueries({ queryKey: ["ordenes", "urgentes"] })
    },
  })
}

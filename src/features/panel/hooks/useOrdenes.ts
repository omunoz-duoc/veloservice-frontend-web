"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ordenesService } from "@/features/panel/services/ordenes.provider"
import { mapApiOrden } from "@/features/panel/services/ordenes.service"
import { ORDEN_CATALOGOS_FALLBACK } from "@/features/panel/services/ordenes.catalogos"
import type { BulkUpdateOrdenPayload, OrdenProductoAddPayload, OrdenProductoCambioPayload, UpdateOrdenPayload } from "@/features/panel/types/ordenes.types"
import type { EstadoOT, OrdenTrabajo } from "@/features/panel/components/ordenes/ordenes.types"

export const ordenesQueryKey = ["ordenes", "list"] as const
export const ordenDetalleQueryKey = (ordenId: string) => ["ordenes", "detalle", ordenId] as const

type BulkChanges = {
  estado?: EstadoOT
  mecanicoId?: string
}

type UpdateOrdenDraft = OrdenTrabajo & {
  original?: OrdenTrabajo
  productosCambios?: OrdenProductoCambioPayload[]
  productosAgregar?: OrdenProductoAddPayload[]
}

export function toUpdatePayload(orden: UpdateOrdenDraft): UpdateOrdenPayload {
  const payload: UpdateOrdenPayload = {}
  const original = orden.original
  if (!original || original.estado !== orden.estado) {
    payload.estadoCodigo = orden.estado
    payload.estadoObservacion = "Cambio de estado desde panel web"
  }
  if (!original || original.tipo.codigo !== orden.tipo.codigo) payload.tipoCodigo = orden.tipo.codigo
  if (!original || original.prioridad !== orden.prioridad) payload.prioridad = orden.prioridad
  if ((!original || original.mecanicoId !== orden.mecanicoId) && orden.mecanicoId.trim()) payload.mecanicoId = orden.mecanicoId
  if (orden.productosCambios && orden.productosCambios.length > 0) payload.productosCambios = orden.productosCambios
  if (orden.productosAgregar && orden.productosAgregar.length > 0) payload.productosAgregar = orden.productosAgregar
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

export function useOrdenCatalogosQuery() {
  return useQuery({
    queryKey: ["ordenes", "catalogos"] as const,
    queryFn: async () => {
      const [estados, tipos, prioridades] = await Promise.all([
        ordenesService.getEstadosOrden(),
        ordenesService.getTiposOrden(),
        ordenesService.getPrioridadesOrden(),
      ])
      return {
        estados: estados.length ? estados : ORDEN_CATALOGOS_FALLBACK.estados,
        tipos: tipos.length ? tipos : ORDEN_CATALOGOS_FALLBACK.tipos,
        prioridades: prioridades.length ? prioridades : ORDEN_CATALOGOS_FALLBACK.prioridades,
      }
    },
    staleTime: 5 * 60_000,
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
      const { original, productosCambios, productosAgregar, ...updated } = orden
      void original
      void productosCambios
      void productosAgregar
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
      void queryClient.invalidateQueries({ queryKey: ordenesQueryKey })
      void queryClient.invalidateQueries({ queryKey: ordenDetalleQueryKey(updatedLookupId) })
      if (updatedLookupId !== updated.id) {
        void queryClient.invalidateQueries({ queryKey: ordenDetalleQueryKey(updated.id) })
      }
    },
  })
}

export function useAddOrdenProductosMutation(ordenId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: OrdenProductoAddPayload[]) => {
      await ordenesService.addProductos(ordenId, payload)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ordenDetalleQueryKey(ordenId) })
      void queryClient.invalidateQueries({ queryKey: ordenesQueryKey })
    },
  })
}

export function useBulkUpdateOrdenesMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ ids, changes }: { ids: string[]; changes: BulkChanges }) => {
      const payload: BulkUpdateOrdenPayload = { ids }
      if (changes.estado !== undefined) payload.estado = changes.estado
      if (changes.mecanicoId !== undefined && changes.mecanicoId.trim()) payload.mecanicoId = changes.mecanicoId
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

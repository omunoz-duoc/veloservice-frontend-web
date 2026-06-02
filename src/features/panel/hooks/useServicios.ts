"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { serviciosService } from "@/features/panel/services/servicios.provider"
import type { Servicio } from "@/features/panel/types/servicios.types"

export const serviciosQueryKey = ["servicios", "list"] as const

export function useServiciosQuery() {
  return useQuery({
    queryKey: serviciosQueryKey,
    queryFn: async () => {
      const { servicios } = await serviciosService.getServicios()
      return servicios
    },
    staleTime: 30_000,
  })
}

export function useCreateServicioMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (servicio: Servicio) => {
      await serviciosService.createServicio(servicio)
      return servicio
    },
    onSuccess: servicio => {
      queryClient.setQueryData<Servicio[]>(serviciosQueryKey, current => [...(current ?? []), servicio])
      void queryClient.invalidateQueries({ queryKey: serviciosQueryKey })
    },
  })
}

export function useUpdateServicioCacheMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (servicio: Servicio) => servicio,
    onSuccess: servicio => {
      queryClient.setQueryData<Servicio[]>(serviciosQueryKey, current =>
        (current ?? []).map(s => s.id === servicio.id ? servicio : s)
      )
    },
  })
}

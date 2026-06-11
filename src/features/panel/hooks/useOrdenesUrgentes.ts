import { useQuery } from "@tanstack/react-query"
import { ordenesService } from "@/features/panel/services/ordenes.provider"
import { mapApiOrden } from "@/features/panel/services/ordenes.service"

export const ordenesUrgentesQueryKey = ["ordenes", "urgentes"] as const

export function useOrdenesUrgentes() {
  return useQuery({
    queryKey: ordenesUrgentesQueryKey,
    queryFn: async () => {
      const { ordenes } = await ordenesService.getOrdenesUrgentes()
      return ordenes.map(mapApiOrden)
    },
    staleTime: 30_000,
  })
}

import { useQuery } from "@tanstack/react-query"
import { ordenesService } from "@/features/panel/services/ordenes.provider"
import { getActiveSucursalId } from "@/lib/sucursales"

export function useOrdenesKpis() {
  const sucursalId = getActiveSucursalId()

  return useQuery({
    queryKey: ["ordenes", "metricas", sucursalId],
    queryFn: async () => {
      const metricas = await ordenesService.getOrdenesMetricas()

      const activas =
        (metricas.recibidas ?? 0) +
        (metricas.enProceso ?? 0)

      const listas = metricas.listas ?? 0

      return { activas, listas }
    },
    staleTime: 5 * 60 * 1000,
  })
}

import { useQuery } from "@tanstack/react-query"
import { finanzasService } from "@/features/panel/services/finanzas.provider"
import { getActiveSucursalId } from "@/lib/sucursales"

export function useFinanzasMetricas() {
  const sucursalId = getActiveSucursalId()

  return useQuery({
    queryKey: ["finanzas", "metricas", sucursalId],
    queryFn: () => finanzasService.getMetricas(),
    staleTime: 5 * 60 * 1000,
  })
}

import { useQuery } from "@tanstack/react-query"
import { inventarioService } from "@/features/panel/services/inventario.provider"

export function useInventarioMetricas() {
  return useQuery({
    queryKey: ["inventario", "metricas"],
    queryFn: () => inventarioService.getMetricas(),
    staleTime: 5 * 60 * 1000,
  })
}

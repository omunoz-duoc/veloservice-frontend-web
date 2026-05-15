import { useQuery } from "@tanstack/react-query"
import { finanzasService } from "@/features/panel/services/finanzas.provider"

export function useFinanzasMetricas() {
  return useQuery({
    queryKey: ["finanzas", "metricas"],
    queryFn: () => finanzasService.getMetricas(),
    staleTime: 5 * 60 * 1000,
  })
}

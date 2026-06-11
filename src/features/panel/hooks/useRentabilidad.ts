import { useQuery } from "@tanstack/react-query"
import { finanzasService } from "@/features/panel/services/finanzas.provider"

export function useRentabilidad() {
  return useQuery({
    queryKey: ["finanzas", "rentabilidad"],
    queryFn: () => finanzasService.getRentabilidad(),
    staleTime: 5 * 60 * 1000,
  })
}
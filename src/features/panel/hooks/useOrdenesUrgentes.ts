import { useQuery } from "@tanstack/react-query"
import { ordenesService } from "@/features/panel/services/ordenes.provider"

export function useOrdenesUrgentes() {
  return useQuery({
    queryKey: ["ordenes", "urgentes"],
    queryFn: () => ordenesService.getOrdenesUrgentes(),
    staleTime: 60 * 1000,
  })
}

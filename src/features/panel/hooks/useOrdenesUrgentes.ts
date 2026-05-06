import { useQuery } from "@tanstack/react-query"
import { getOrdenesUrgentes } from "@/features/panel/services/dashboard.mock"

export function useOrdenesUrgentes() {
  return useQuery({
    queryKey: ["ordenes", "urgentes"],
    queryFn: getOrdenesUrgentes,
    staleTime: 60 * 1000,
  })
}

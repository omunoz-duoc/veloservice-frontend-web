import { useQuery } from "@tanstack/react-query"
import { getPipelineSummary } from "@/features/panel/services/dashboard.mock"

export function usePipelineSummary() {
  return useQuery({
    queryKey: ["ordenes", "pipeline"],
    queryFn: getPipelineSummary,
    staleTime: 60 * 1000,
  })
}

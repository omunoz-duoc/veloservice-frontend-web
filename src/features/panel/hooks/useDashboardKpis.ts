import { useQuery } from "@tanstack/react-query"
import { getDashboardKpis } from "@/features/panel/services/dashboard.mock"

export function useDashboardKpis() {
  return useQuery({
    queryKey: ["dashboard", "kpis"],
    queryFn: getDashboardKpis,
    staleTime: 5 * 60 * 1000,
  })
}

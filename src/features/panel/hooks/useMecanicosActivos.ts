import { useQuery } from "@tanstack/react-query"
import { getMecanicosActivos } from "@/features/panel/services/dashboard.mock"

export function useMecanicosActivos() {
  return useQuery({
    queryKey: ["mecanicos", "activos"],
    queryFn: getMecanicosActivos,
    staleTime: 2 * 60 * 1000,
  })
}

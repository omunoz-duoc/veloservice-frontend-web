import { useQuery } from "@tanstack/react-query"
import { mecanicosService } from "@/features/panel/services/mecanicos.provider"

export function useMecanicosActivos() {
  return useQuery({
    queryKey: ["mecanicos", "activos"],
    queryFn: () => mecanicosService.getMecanicosActivos(),
    staleTime: 2 * 60 * 1000,
  })
}

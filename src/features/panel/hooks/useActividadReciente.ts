import { useQuery } from "@tanstack/react-query"
import { getActividadReciente } from "@/features/panel/services/dashboard.mock"

export function useActividadReciente() {
  return useQuery({
    queryKey: ["actividad", "reciente"],
    queryFn: getActividadReciente,
    staleTime: 30 * 1000,
  })
}

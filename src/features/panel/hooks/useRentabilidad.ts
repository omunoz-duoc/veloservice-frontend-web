import { useQuery } from "@tanstack/react-query"
import { finanzasService } from "@/features/panel/services/finanzas.provider"
import { getActiveSucursalId } from "@/lib/sucursales"

export function useRentabilidad() {
  const sucursalId = getActiveSucursalId()

  return useQuery({
    queryKey: ["finanzas", "rentabilidad", sucursalId],
    queryFn: () => finanzasService.getRentabilidad(),
    staleTime: 5 * 60 * 1000,
  })
}

import { useQuery } from "@tanstack/react-query"
import { finanzasService } from "@/features/panel/services/finanzas.provider"
import { getActiveSucursalId } from "@/lib/sucursales"

export function useMovimientos() {
  const sucursalId = getActiveSucursalId()

  return useQuery({
    queryKey: ["finanzas", "movimientos", sucursalId],
    queryFn: () => finanzasService.getMovimientos(),
    staleTime: 5 * 60 * 1000,
  })
}

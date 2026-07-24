import { useQuery } from "@tanstack/react-query"
import { finanzasService } from "@/features/panel/services/finanzas.provider"
import { getActiveSucursalId } from "@/lib/sucursales"

export function useComposicion() {
  const sucursalId = getActiveSucursalId()

  return useQuery({
    queryKey: ["finanzas", "composicion", sucursalId],
    queryFn: () => finanzasService.getComposicion(),
    staleTime: 5 * 60 * 1000,
  })
}

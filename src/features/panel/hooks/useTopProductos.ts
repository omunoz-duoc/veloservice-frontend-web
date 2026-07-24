import { useQuery } from "@tanstack/react-query"
import { finanzasService } from "@/features/panel/services/finanzas.provider"
import { getActiveSucursalId } from "@/lib/sucursales"

export function useTopProductos() {
  const sucursalId = getActiveSucursalId()

  return useQuery({
    queryKey: ["finanzas", "top-productos", sucursalId],
    queryFn: () => finanzasService.getTopProductos(),
    staleTime: 5 * 60 * 1000,
  })
}

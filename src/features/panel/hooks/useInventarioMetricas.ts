import { useQuery } from "@tanstack/react-query"
import { inventarioService } from "@/features/panel/services/inventario.provider"
import { getActiveSucursalId } from "@/lib/sucursales"

export function useInventarioMetricas() {
  const sucursalId = getActiveSucursalId()

  return useQuery({
    queryKey: ["productos", "stock-bajo", sucursalId],
    queryFn: async () => {
      const data = await inventarioService.getStockBajo()
      return { stockBajo: data.total ?? data.productos?.length ?? 0 }
    },
    staleTime: 5 * 60 * 1000,
  })
}

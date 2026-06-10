import { useQuery } from "@tanstack/react-query"
import { inventarioService } from "@/features/panel/services/inventario.provider"

export function useInventarioMetricas() {
  return useQuery({
    queryKey: ["productos", "stock-bajo"],
    queryFn: async () => {
      const data = await inventarioService.getStockBajo()
      return { stockBajo: data.total ?? data.productos?.length ?? 0 }
    },
    staleTime: 5 * 60 * 1000,
  })
}
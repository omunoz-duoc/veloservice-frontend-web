import { useQuery } from "@tanstack/react-query"
import { ordenesService } from "@/features/panel/services/ordenes.provider"

export function useOrdenesKpis() {
  return useQuery({
    queryKey: ["ordenes", "kpis"],
    queryFn: async () => {
      const { ordenes } = await ordenesService.getOrdenes()
      const activas = ordenes.reduce(
        (n, o) => (o.estado === "recibido" || o.estado === "proceso" ? n + 1 : n),
        0,
      )
      const listas = ordenes.reduce(
        (n, o) => (o.estado === "listo" ? n + 1 : n),
        0,
      )
      return { activas, listas }
    },
    staleTime: 5 * 60 * 1000,
  })
}

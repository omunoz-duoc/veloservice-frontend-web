import { useQuery } from "@tanstack/react-query"
import { ordenesService } from "@/features/panel/services/ordenes.provider"
import { mapApiOrden } from "@/features/panel/services/ordenes.service"

export function useOrdenesKpis() {
  return useQuery({
    queryKey: ["ordenes", "kpis"],
    queryFn: async () => {
      const { ordenes } = await ordenesService.getOrdenes()
      const mapped = ordenes.map(mapApiOrden)
      const activas = mapped.reduce((n, o) => (
        o.estado === "recibida" ||
        o.estado === "en_diagnostico" ||
        o.estado === "esperando_repuestos" ||
        o.estado === "en_reparacion" ||
        o.estado === "control_calidad"
          ? n + 1
          : n
      ), 0)
      const listas = mapped.reduce((n, o) => (o.estado === "lista_para_entrega" ? n + 1 : n), 0)
      return { activas, listas }
    },
    staleTime: 5 * 60 * 1000,
  })
}

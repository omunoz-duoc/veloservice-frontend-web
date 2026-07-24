import { useQuery } from "@tanstack/react-query"
import { finanzasService } from "@/features/panel/services/finanzas.provider"
import { getActiveSucursalId } from "@/lib/sucursales"

export function useProyeccion() {
  const sucursalId = getActiveSucursalId()

  return useQuery({
    queryKey: ["finanzas", "proyeccion", sucursalId],
    queryFn: () => finanzasService.getProyeccion(),
    staleTime: 5 * 60 * 1000,
  })
}

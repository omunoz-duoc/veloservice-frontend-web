import { useQuery } from "@tanstack/react-query"
import { finanzasService } from "@/features/panel/services/finanzas.provider"
import { getActiveSucursalId } from "@/lib/sucursales"

export function useMediosPago() {
  const sucursalId = getActiveSucursalId()

  return useQuery({
    queryKey: ["finanzas", "medios-pago", sucursalId],
    queryFn: () => finanzasService.getMediosPago(),
    staleTime: 5 * 60 * 1000,
  })
}

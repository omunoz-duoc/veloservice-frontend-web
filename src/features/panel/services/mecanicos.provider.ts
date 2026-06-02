import { useMockServices } from "@/lib/api/service-mode"
import type { IMecanicosService } from "../types/mecanicos.types"

async function loadMecanicosService(): Promise<IMecanicosService> {
  if (useMockServices) {
    const { mecanicosMock } = await import("./mecanicos.mock")
    return mecanicosMock
  }

  const { mecanicosService } = await import("./mecanicos.service")
  return mecanicosService
}

export const mecanicosService: IMecanicosService = {
  async getMecanicosActivos() {
    return (await loadMecanicosService()).getMecanicosActivos()
  },
  async cambiarEstado(id, payload) {
    return (await loadMecanicosService()).cambiarEstado(id, payload)
  },
  async cambiarRol(id, payload) {
    return (await loadMecanicosService()).cambiarRol(id, payload)
  },
}

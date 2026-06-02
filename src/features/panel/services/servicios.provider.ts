import { useMockServices } from "@/lib/api/service-mode"
import type { IServiciosService } from "../types/servicios.types"

async function loadServiciosService(): Promise<IServiciosService> {
  if (useMockServices) {
    const { serviciosMock } = await import("./servicios.mock")
    return serviciosMock
  }

  const { serviciosService } = await import("./servicios.service")
  return serviciosService
}

export const serviciosService: IServiciosService = {
  async getServicios() {
    return (await loadServiciosService()).getServicios()
  },
  async createServicio(payload) {
    return (await loadServiciosService()).createServicio(payload)
  },
}

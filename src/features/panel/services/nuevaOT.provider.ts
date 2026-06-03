import { useMockServices } from "@/lib/api/service-mode"
import type { INuevaOTService } from "./nuevaOT.types"

async function loadNuevaOTService(): Promise<INuevaOTService> {
  if (useMockServices) {
    const { nuevaOTMock } = await import("./nuevaOT.mock")
    return nuevaOTMock
  }

  const { nuevaOTService } = await import("./nuevaOT.service")
  return nuevaOTService
}

export const nuevaOTService: INuevaOTService = {
  async getClientes() {
    return (await loadNuevaOTService()).getClientes()
  },
  async getBicicletas(clienteId) {
    return (await loadNuevaOTService()).getBicicletas(clienteId)
  },
  async getTipos() {
    return (await loadNuevaOTService()).getTipos()
  },
  async getMecanicos() {
    return (await loadNuevaOTService()).getMecanicos()
  },
  async getProductos() {
    return (await loadNuevaOTService()).getProductos()
  },
  async createOrden(payload) {
    return (await loadNuevaOTService()).createOrden(payload)
  },
}

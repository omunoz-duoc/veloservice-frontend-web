import { useMockServices } from "@/lib/api/service-mode"
import type { IOrdenesService } from "../types/ordenes.types"

async function loadOrdenesService(): Promise<IOrdenesService> {
  if (useMockServices) {
    const { ordenesMock } = await import("./ordenes.mock")
    return ordenesMock
  }

  const { ordenesService } = await import("./ordenes.service")
  return ordenesService
}

export const ordenesService: IOrdenesService = {
  async getOrdenes() {
    return (await loadOrdenesService()).getOrdenes()
  },
  async getOrdenesMetricas() {
    return (await loadOrdenesService()).getOrdenesMetricas()
  },
  async getEstadosOrden() {
    return (await loadOrdenesService()).getEstadosOrden()
  },
  async getTiposOrden() {
    return (await loadOrdenesService()).getTiposOrden()
  },
  async getPrioridadesOrden() {
    return (await loadOrdenesService()).getPrioridadesOrden()
  },
  async createOrden(payload) {
    return (await loadOrdenesService()).createOrden(payload)
  },
  async getOrdenById(id) {
    return (await loadOrdenesService()).getOrdenById(id)
  },
  async updateOrden(id, payload) {
    return (await loadOrdenesService()).updateOrden(id, payload)
  },
  async addProductos(id, payload) {
    return (await loadOrdenesService()).addProductos(id, payload)
  },
  async bulkUpdateOrdenes(payload) {
    return (await loadOrdenesService()).bulkUpdateOrdenes(payload)
  },
  async deleteOrden(id) {
    return (await loadOrdenesService()).deleteOrden(id)
  },
}

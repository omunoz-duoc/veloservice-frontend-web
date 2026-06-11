import type { IOrdenesService } from "../types/ordenes.types"
import { ordenesService as realOrdenesService } from "./ordenes.service"

export const ordenesService: IOrdenesService = {
  async getOrdenes() {
    return realOrdenesService.getOrdenes()
  },
  async getOrdenesMetricas() {
    return realOrdenesService.getOrdenesMetricas()
  },
  async createOrden(payload) {
    return realOrdenesService.createOrden(payload)
  },
  async getOrdenById(id) {
    return realOrdenesService.getOrdenById(id)
  },
  async updateOrden(id, payload) {
    return realOrdenesService.updateOrden(id, payload)
  },

  async cambiarEstado(id, payload) {
  return realOrdenesService.cambiarEstado(id, payload)
   },

  async bulkUpdateOrdenes(payload) {
    return realOrdenesService.bulkUpdateOrdenes(payload)
  },
  async deleteOrden(id) {
    return realOrdenesService.deleteOrden(id)
  },
}

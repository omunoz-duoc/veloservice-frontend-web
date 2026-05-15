import type { IOrdenesService, OrdenesListResponse, OrdenesMetricas } from "../types/ordenes.types"
import ordenesData from "./ordenes.mock.data.json"
import metricasData from "./ordenes.metricas.mock.data.json"

async function mockFetch<T>(data: T, delayMs = 250): Promise<T> {
  await new Promise(r => setTimeout(r, delayMs))
  return data
}

export const ordenesMock: IOrdenesService = {
  async getOrdenes() {
    return mockFetch(ordenesData as OrdenesListResponse)
  },
  async getOrdenesUrgentes() {
    const urgentes = ordenesData.ordenes.filter(o => o.prioridad === "Alta")
    return mockFetch({ total: urgentes.length, ordenes: urgentes } as OrdenesListResponse)
  },
  async getOrdenesMetricas() {
    return mockFetch(metricasData as OrdenesMetricas)
  },
  async createOrden(_payload) {
    return mockFetch(undefined as void)
  },
  async getOrdenById(_id) {
    return mockFetch(ordenesData.ordenes[0] as Awaited<ReturnType<IOrdenesService["getOrdenById"]>>)
  },
  async updateOrden(_id, _payload) {
    return mockFetch(ordenesData.ordenes[0] as Awaited<ReturnType<IOrdenesService["updateOrden"]>>)
  },
  async deleteOrden(_id) {
    return mockFetch(undefined as void)
  },
  async bulkUpdateOrdenes(_payload) {
    return mockFetch(undefined as void)
  },
}

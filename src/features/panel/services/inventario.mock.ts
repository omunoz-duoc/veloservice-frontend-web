import type { IInventarioService, ProductosListResponse, InventarioMetricas, CreateProductoPayload } from "../types/inventario.types"
import productosData from "./inventario.mock.data.json"
import metricasData from "./inventario.metricas.mock.data.json"

async function mockFetch<T>(data: T, delayMs = 250): Promise<T> {
  await new Promise(r => setTimeout(r, delayMs))
  return data
}

export const inventarioMock: IInventarioService = {
  async getProductos() {
    return mockFetch(productosData as ProductosListResponse)
  },
  async getMetricas() {
    return mockFetch(metricasData as InventarioMetricas)
  },
  async createProducto(_payload: CreateProductoPayload) {
    return mockFetch(undefined as void)
  },
}

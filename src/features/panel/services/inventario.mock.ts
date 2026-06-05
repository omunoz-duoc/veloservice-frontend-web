import type { IInventarioService, ProductosListResponse, InventarioMetricas, CreateProductoPayload } from "../types/inventario.types"
import productosData from "./inventario.mock.data.json"
import metricasData from "./inventario.metricas.mock.data.json"

async function mockFetch<T>(data: T, delayMs = 250): Promise<T> {
  await new Promise(r => setTimeout(r, delayMs))
  return data
}

export const inventarioMock: IInventarioService = {
  async getProductos(_sucursalId?: string) {
    return mockFetch(productosData as ProductosListResponse)
  },
  async buscarProductos(search: string, _sucursalId?: string) {
    const q = search.trim().toLowerCase()
    const data = productosData as ProductosListResponse
    const productos = q
      ? data.productos.filter(producto =>
          [producto.nombre, producto.sku, producto.categoria].join(" ").toLowerCase().includes(q)
        )
      : data.productos
    return mockFetch({ total: productos.length, productos })
  },
  async getMetricas() {
    return mockFetch(metricasData as InventarioMetricas)
  },
  async createProducto(_payload: CreateProductoPayload) {
    return mockFetch(undefined as void)
  },
}

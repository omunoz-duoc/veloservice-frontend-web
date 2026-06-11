import type { IInventarioService, ProductosListResponse, InventarioMetricas, ProductoWritePayload, Producto } from "../types/inventario.types"
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

  async getStockBajo() {
  const { productos } = await this.getProductos()
  const bajos = productos.filter(p => p.stock <= 5)
  return mockFetch({ total: bajos.length, productos: bajos })
  },
  async getMetricas() {
    return mockFetch(metricasData as InventarioMetricas)
  },
  async createProducto(payload: ProductoWritePayload) {
    return mockFetch({
      id: crypto.randomUUID(),
      nombre: payload.nombre,
      sku: payload.sku,
      marca: payload.marca,
      categoria: "",
      precioCosto: payload.precioCosto,
      precioVenta: payload.precioVenta,
      stock: payload.stock,
      stockMinimo: payload.stockMinimo,
    } as Producto)
  },
  async updateProducto(id: string, payload: ProductoWritePayload) {
    return mockFetch({
      id,
      nombre: payload.nombre,
      sku: payload.sku,
      marca: payload.marca,
      categoria: "",
      precioCosto: payload.precioCosto,
      precioVenta: payload.precioVenta,
      stock: payload.stock,
      stockMinimo: payload.stockMinimo,
    } as Producto)
  },
}

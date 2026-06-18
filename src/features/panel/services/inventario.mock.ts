import type {
  IInventarioService,
  ProductosListResponse,
  InventarioMetricas,
  ProductoWritePayload,
  Producto,
  MovimientoStockRequest,
  MovimientoStockResponse,
} from "../types/inventario.types"
import productosData from "./inventario.mock.data.json"
import metricasData from "./inventario.metricas.mock.data.json"

const productosState = productosData as ProductosListResponse

async function mockFetch<T>(data: T, delayMs = 250): Promise<T> {
  await new Promise(r => setTimeout(r, delayMs))
  return data
}

export const inventarioMock: IInventarioService = {
  async getProductos() {
    return mockFetch(productosState)
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
  async ajustarStock(productoId: string, payload: MovimientoStockRequest) {
    const producto = productosState.productos.find(p => p.id === productoId)
    if (!producto) throw new Error("Producto no encontrado")

    const stockAnterior = producto.stock ?? 0
    const stockPosterior = payload.tipo === "entrada"
      ? stockAnterior + payload.cantidad
      : stockAnterior - payload.cantidad

    if (payload.cantidad <= 0 || !Number.isInteger(payload.cantidad)) {
      throw new Error("Cantidad debe ser mayor que cero")
    }
    if (stockPosterior < 0) {
      throw new Error("Stock negativo no permitido")
    }

    producto.stock = stockPosterior

    return mockFetch({
      id: crypto.randomUUID(),
      productoId,
      tipo: payload.tipo,
      cantidad: payload.cantidad,
      stockAnterior,
      stockPosterior,
      motivo: payload.motivo,
      createdAt: new Date().toISOString(),
    } satisfies MovimientoStockResponse)
  },
}

import { httpClient } from "@/lib/api/http-client"
import type {
  IInventarioService,
  ProductosListResponse,
  InventarioMetricas,
  ProductoWritePayload,
  Producto,
  MovimientoStockRequest,
  MovimientoStockResponse,
} from "../types/inventario.types"

export const inventarioService: IInventarioService = {
  async getProductos() {
    return httpClient.get<ProductosListResponse>("productos")
  },
  async getMetricas() {
    return httpClient.get<InventarioMetricas>("productos/metricas")
  },
  async getStockBajo() {
    return httpClient.get<ProductosListResponse>("productos/stock-bajo")
  },
  async createProducto(payload: ProductoWritePayload) {
    return httpClient.post<Producto>("productos", payload)
  },
  async updateProducto(id: string, payload: ProductoWritePayload) {
    return httpClient.put<Producto>(`productos/${id}`, payload)
  },
  async ajustarStock(productoId: string, payload: MovimientoStockRequest) {
    return httpClient.post<MovimientoStockResponse>(`productos/${productoId}/movimientos-stock`, payload)
  },
}


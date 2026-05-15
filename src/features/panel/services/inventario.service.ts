import { httpClient } from "@/lib/api/http-client"
import type { IInventarioService, ProductosListResponse, InventarioMetricas, CreateProductoPayload } from "../types/inventario.types"

export const inventarioService: IInventarioService = {
  async getProductos() {
    return httpClient.get<ProductosListResponse>("productos")
  },
  async getMetricas() {
    return httpClient.get<InventarioMetricas>("productos/metricas")
  },
  async createProducto(payload: CreateProductoPayload) {
    return httpClient.post("productos", payload)
  },
}

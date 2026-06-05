import { httpClient } from "@/lib/api/http-client"
import type { IInventarioService, ProductosListResponse, InventarioMetricas, CreateProductoPayload } from "../types/inventario.types"

type BackendProducto = {
  id: string
  nombre: string
  sku: string
  categoria: string
  costo_unitario?: number
  costoUnitario?: number
  precio_costo?: number
  precioCosto?: number
  precio_asignado?: number
  precioAsignado?: number
  precio_venta?: number
  precioVenta?: number
  stock: number
}

type BackendProductosListResponse = {
  total: number
  productos: BackendProducto[]
}

type RawProductosResponse =
  | BackendProductosListResponse
  | BackendProducto[]
  | { data?: BackendProductosListResponse | BackendProducto[] }
  | { content?: BackendProducto[]; total?: number }

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function normalizeProductosResponse(response: RawProductosResponse): BackendProductosListResponse {
  if (Array.isArray(response)) {
    return { total: response.length, productos: response }
  }

  if (!isRecord(response)) {
    return { total: 0, productos: [] }
  }

  const responseRecord = response as Record<string, unknown>
  const data = responseRecord["data"]
  if (Array.isArray(data)) {
    return { total: data.length, productos: data as BackendProducto[] }
  }

  if (isRecord(data)) {
    const productos = Array.isArray(data.productos) ? data.productos as BackendProducto[] : []
    const total = typeof data.total === "number" ? data.total : productos.length
    return { total, productos }
  }

  const productosValue = responseRecord["productos"]
  const totalValue = responseRecord["total"]
  if (Array.isArray(productosValue)) {
    const productos = productosValue as BackendProducto[]
    const total = typeof totalValue === "number" ? totalValue : productos.length
    return { total, productos }
  }

  const contentValue = responseRecord["content"]
  if (Array.isArray(contentValue)) {
    const productos = contentValue as BackendProducto[]
    const total = typeof totalValue === "number" ? totalValue : productos.length
    return { total, productos }
  }

  return { total: 0, productos: [] }
}

export function mapProductosResponse(response: RawProductosResponse): ProductosListResponse {
  const normalized = normalizeProductosResponse(response)

  return {
    total: normalized.total,
    productos: normalized.productos.map(producto => ({
      id: producto.id,
      nombre: producto.nombre,
      sku: producto.sku,
      categoria: producto.categoria,
      costoUnitario: producto.costo_unitario ?? producto.costoUnitario ?? producto.precio_costo ?? producto.precioCosto ?? 0,
      precioAsignado: producto.precio_asignado ?? producto.precioAsignado ?? producto.precio_venta ?? producto.precioVenta ?? 0,
      stock: producto.stock,
    })),
  }
}

function buildProductosUrl(search?: string, sucursalId?: string) {
  const params = new URLSearchParams()
  const trimmedSearch = search?.trim()
  const trimmedSucursalId = sucursalId?.trim()

  if (trimmedSearch) {
    params.set("search", trimmedSearch)
  }

  if (trimmedSucursalId) {
    params.set("sucursalId", trimmedSucursalId)
  }

  const queryString = params.toString()
  return queryString ? `productos?${queryString}` : "productos"
}

export const inventarioService: IInventarioService = {
  async getProductos(sucursalId?: string) {
    const response = await httpClient.get<RawProductosResponse>(buildProductosUrl(undefined, sucursalId))
    return mapProductosResponse(response)
  },
  async buscarProductos(search: string, sucursalId?: string) {
    const response = await httpClient.get<RawProductosResponse>(buildProductosUrl(search, sucursalId))
    return mapProductosResponse(response)
  },
  async getMetricas() {
    return httpClient.get<InventarioMetricas>("productos/metricas")
  },
  async createProducto(payload: CreateProductoPayload) {
    return httpClient.post("productos", payload)
  },
}

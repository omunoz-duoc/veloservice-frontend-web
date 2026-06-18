export interface IInventarioService {
  getProductos(): Promise<ProductosListResponse>
  getMetricas(): Promise<InventarioMetricas>
  getStockBajo(): Promise<ProductosListResponse>
  createProducto(payload: ProductoWritePayload): Promise<Producto>
  updateProducto(id: string, payload: ProductoWritePayload): Promise<Producto>
  ajustarStock(productoId: string, payload: MovimientoStockRequest): Promise<MovimientoStockResponse>
}


export type Producto = {
  id: string
  nombre: string
  sku: string
  marca?: string | null
  categoria: string
  costoUnitario?: number | null
  costo_unitario?: number | null
  precioCosto?: number | null
  precioAsignado?: number | null
  precio_asignado?: number | null
  precioVenta?: number | null
  stock: number | null
  stockMinimo?: number | null
  stock_minimo?: number | null
}

export type ProductosListResponse = { total: number; productos: Producto[] }

export type InventarioMetricas = {
  valorInventario: number
  enStock: number
  stockBajo: number
  agotados: number
}

export type ProductoWritePayload = {
  nombre: string
  sku: string
  marca?: string | null
  unidadMedida: string
  precioCosto: number
  precioVenta: number
  stock: number
  stockMinimo: number
  categoriaId?: string | null
  activo?: boolean
}

export type MovimientoStockTipo = "entrada" | "salida"

export type MovimientoStockRequest = {
  tipo: MovimientoStockTipo
  cantidad: number
  motivo: string
}

export type MovimientoStockResponse = {
  id: string
  productoId: string
  tipo: MovimientoStockTipo
  cantidad: number
  stockAnterior: number
  stockPosterior: number
  motivo: string
  createdAt: string
}

export interface IInventarioService {
  getProductos(): Promise<ProductosListResponse>
  getMetricas(): Promise<InventarioMetricas>
  getStockBajo(): Promise<ProductosListResponse>
  createProducto(payload: CreateProductoPayload): Promise<void>
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

export type CreateProductoPayload = Omit<Producto, "id">

export interface IInventarioService {
  getProductos(): Promise<ProductosListResponse>
  getMetricas(): Promise<InventarioMetricas>
  createProducto(payload: CreateProductoPayload): Promise<void>
}

export type Producto = {
  id: string
  nombre: string
  sku: string
  categoria: string
  costoUnitario: number
  precioAsignado: number
  stock: number
}

export type ProductosListResponse = { total: number; productos: Producto[] }

export type InventarioMetricas = {
  valorInventario: number
  enStock: number
  stockBajo: number
  agotados: number
}

export type CreateProductoPayload = Omit<Producto, "id">

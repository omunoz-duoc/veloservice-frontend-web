import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { inventarioService } from "@/features/panel/services/inventario.provider"
import type { CatKey, Producto } from "../components/inventario/inventario.mock"
import type { MovimientoStockRequest, Producto as ServiceProducto, ProductoWritePayload } from "../types/inventario.types"

const CAT_MAP: Record<string, CatKey> = {
  neumaticos: "ruedas",
  cockpit: "accesorios",
}

function toNumber(value: number | null | undefined): number {
  return Number.isFinite(value) ? Number(value) : 0
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

function productoToPayload(producto: Producto): ProductoWritePayload {
  return {
    nombre: producto.nombre.trim(),
    sku: producto.ref.trim(),
    marca: producto.prov?.trim() || null,
    unidadMedida: "unidad",
    precioCosto: producto.costo,
    precioVenta: producto.precio,
    stock: producto.stock,
    stockMinimo: producto.min,
    categoriaId: isUuid(producto.cat) ? producto.cat : null,
    activo: true,
  }
}

function toProductoUI(s: ServiceProducto): Producto {
  const cat = (CAT_MAP[s.categoria] ?? s.categoria) as CatKey
  const costo = toNumber(s.costoUnitario ?? s.costo_unitario ?? s.precioCosto)
  const precio = toNumber(s.precioAsignado ?? s.precio_asignado ?? s.precioVenta)
  const stock = toNumber(s.stock)
  const min = toNumber(s.stockMinimo ?? s.stock_minimo)

  return {
    id: s.id,
    nombre: s.nombre,
    ref: s.sku,
    cat,
    costo,
    precio,
    stock,
    min,
    prov: s.marca ?? "",
    ubic: "",
  }
}

export function useInventarioProductos() {
  return useQuery({
    queryKey: ["inventario", "productos"],
    queryFn: async () => {
      const res = await inventarioService.getProductos()
      return res.productos.map(toProductoUI)
    },
    staleTime: 30_000,
  })
}

export function useCreateProducto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (producto: Producto) => inventarioService.createProducto(productoToPayload(producto)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventario", "productos"] })
      queryClient.invalidateQueries({ queryKey: ["productos", "stock-bajo"] })
    },
  })
}

export function useUpdateProducto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (producto: Producto) => inventarioService.updateProducto(producto.id, productoToPayload(producto)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventario", "productos"] })
      queryClient.invalidateQueries({ queryKey: ["productos", "stock-bajo"] })
    },
  })
}

export function useAjustarStockProducto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ productoId, payload }: { productoId: string; payload: MovimientoStockRequest }) =>
      inventarioService.ajustarStock(productoId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventario", "productos"] })
      queryClient.invalidateQueries({ queryKey: ["productos", "stock-bajo"] })
      queryClient.invalidateQueries({ queryKey: ["inventario", "metricas"] })
    },
  })
}

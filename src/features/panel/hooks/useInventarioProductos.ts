import { useQuery } from "@tanstack/react-query"
import { inventarioService } from "@/features/panel/services/inventario.provider"
import type { CatKey, Producto } from "../components/inventario/inventario.mock"
import type { Producto as ServiceProducto } from "../types/inventario.types"

const CAT_MAP: Record<string, CatKey> = {
  neumaticos: "ruedas",
  cockpit: "accesorios",
}

function toNumber(value: number | null | undefined): number {
  return Number.isFinite(value) ? Number(value) : 0
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

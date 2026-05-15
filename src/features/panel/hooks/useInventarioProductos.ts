import { useQuery } from "@tanstack/react-query"
import { inventarioService } from "@/features/panel/services/inventario.provider"
import type { CatKey, Producto } from "../components/inventario/inventario.mock"
import type { Producto as ServiceProducto } from "../types/inventario.types"

const CAT_MAP: Record<string, CatKey> = {
  neumaticos: "ruedas",
  cockpit: "accesorios",
}

function toProductoUI(s: ServiceProducto): Producto {
  const cat = (CAT_MAP[s.categoria] ?? s.categoria) as CatKey
  return {
    id: s.id,
    nombre: s.nombre,
    ref: s.sku,
    cat,
    costo: s.costoUnitario,
    precio: s.precioAsignado,
    stock: s.stock,
    min: 5,
    prov: "",
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

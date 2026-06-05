import { useMockServices } from "@/lib/api/service-mode"
import type { IInventarioService } from "../types/inventario.types"

async function loadInventarioService(): Promise<IInventarioService> {
  if (useMockServices) {
    const { inventarioMock } = await import("./inventario.mock")
    return inventarioMock
  }

  const { inventarioService } = await import("./inventario.service")
  return inventarioService
}

export const inventarioService: IInventarioService = {
  async getProductos(sucursalId?: string) {
    return (await loadInventarioService()).getProductos(sucursalId)
  },
  async buscarProductos(search: string, sucursalId?: string) {
    return (await loadInventarioService()).buscarProductos(search, sucursalId)
  },
  async getMetricas() {
    return (await loadInventarioService()).getMetricas()
  },
  async createProducto(payload) {
    return (await loadInventarioService()).createProducto(payload)
  },
}

import { httpClient } from "@/lib/api/http-client"
import type {
  IFinanzasService,
  FinanzasMetricas,
  RentabilidadResponse,
  ComposicionResponse,
  TopProducto,
  MedioPago,
  ProyeccionResponse,
  Movimiento,
} from "../types/finanzas.types"

export const finanzasService: IFinanzasService = {
  async getMetricas() {
    return httpClient.get<FinanzasMetricas>("finanzas/metricas")
  },
  async getRentabilidad() {
    return httpClient.get<RentabilidadResponse>("finanzas/rentabilidad")
  },
  async getComposicion() {
    return httpClient.get<ComposicionResponse>("finanzas/composicion")
  },
  async getTopProductos() {
    return httpClient.get<TopProducto[]>("finanzas/top-productos")
  },
  async getMediosPago() {
    return httpClient.get<MedioPago[]>("finanzas/medios-pago")
  },
  async getProyeccion() {
    return httpClient.get<ProyeccionResponse>("finanzas/proyeccion")
  },
  async getMovimientos() {
    return httpClient.get<Movimiento[]>("finanzas/movimientos")
  },
}

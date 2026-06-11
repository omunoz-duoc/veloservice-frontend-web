import { httpClient } from "@/lib/api/http-client"
import type { IFinanzasService, FinanzasMetricas, RentabilidadResponse } from "../types/finanzas.types"

export const finanzasService: IFinanzasService = {
  async getMetricas() {
    return httpClient.get<FinanzasMetricas>("finanzas/metricas")
  },
  async getRentabilidad() {
    return httpClient.get<RentabilidadResponse>("finanzas/rentabilidad")
  },
}
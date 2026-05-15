import { httpClient } from "@/lib/api/http-client"
import type { IFinanzasService, FinanzasMetricas } from "../types/finanzas.types"

export const finanzasService: IFinanzasService = {
  async getMetricas() {
    return httpClient.get<FinanzasMetricas>("finanzas/metricas")
  },
}

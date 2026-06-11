import type { IFinanzasService, FinanzasMetricas, RentabilidadResponse } from "../types/finanzas.types"
import metricasData from "./finanzas.metricas.mock.data.json"

async function mockFetch<T>(data: T, delayMs = 250): Promise<T> {
  await new Promise(r => setTimeout(r, delayMs))
  return data
}

export const finanzasMock: IFinanzasService = {
  async getMetricas() {
    return mockFetch(metricasData as FinanzasMetricas)
  },
  async getRentabilidad() {
    return mockFetch({
      ingresos: 0,
      costos: 0,
      margen: 0,
      historico: [],
    } satisfies RentabilidadResponse)
  },
}
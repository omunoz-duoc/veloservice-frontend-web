export interface IFinanzasService {
  getMetricas(): Promise<FinanzasMetricas>
  getRentabilidad(): Promise<RentabilidadResponse>
}

export type FinanzasMetricas = { cobrosDelDia: number }

export type RentabilidadPunto = {
  periodo: string
  ingresos: number
  costos: number
}

export type RentabilidadResponse = {
  ingresos: number
  costos: number
  margen: number
  historico: RentabilidadPunto[]
}
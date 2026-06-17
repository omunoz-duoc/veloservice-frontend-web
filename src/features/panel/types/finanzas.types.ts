export interface IFinanzasService {
  getMetricas(): Promise<FinanzasMetricas>
  getRentabilidad(): Promise<RentabilidadResponse>
}

export type FinanzasMetricas = {
  cobrosDelDia?: number
  cobros_del_dia?: number
  cantidadCobrosDia?: number
  cantidad_cobros_dia?: number
}

export type RentabilidadPunto = {
  periodo: string
  ingresos: number
  costos: number
  cantidadCobros?: number
}

export type RentabilidadResponse = {
  ingresos: number
  costos: number
  margen: number
  cantidadCobros?: number
  ticketPromedio?: number
  historico: RentabilidadPunto[]
}

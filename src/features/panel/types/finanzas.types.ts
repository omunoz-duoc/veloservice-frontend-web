export interface IFinanzasService {
  getMetricas(): Promise<FinanzasMetricas>
  getRentabilidad(): Promise<RentabilidadResponse>
  getComposicion(): Promise<ComposicionResponse>
  getTopProductos(): Promise<TopProducto[]>
  getMediosPago(): Promise<MedioPago[]>
  getProyeccion(): Promise<ProyeccionResponse>
  getMovimientos(): Promise<Movimiento[]>
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

/**
 * Revenue split for the current period. Sourced backend-side from confirmed
 * (delivered) orders: `servicios` = labor/service lines, `productos` = parts sold.
 * Endpoint: GET finanzas/composicion
 */
export type ComposicionResponse = {
  servicios: number
  productos: number
}

/**
 * A product ranked by how much it sold in the period.
 * Endpoint: GET finanzas/top-productos
 */
export type TopProducto = {
  productoId: string
  nombre: string
  sku: string
  cantidadVendida: number
  ingresos: number
}

/**
 * Revenue collected per payment method in the period.
 * Endpoint: GET finanzas/medios-pago
 */
export type MedioPago = {
  medio: string
  monto: number
  cantidad: number
}

export type ProyeccionPunto = {
  periodo: string
  valor: number
  /** true when the point is a backend forecast rather than realized revenue. */
  esProyeccion: boolean
}

/**
 * Forward-looking revenue: realized + forecast points, the monthly goal, and the
 * end-of-month projection. Endpoint: GET finanzas/proyeccion
 */
export type ProyeccionResponse = {
  metaMensual: number
  proyectado: number
  puntos: ProyeccionPunto[]
}

/**
 * A recent cash movement (a collected order or an expense) for the movements table.
 * Endpoint: GET finanzas/movimientos
 */
export type Movimiento = {
  id: string
  fecha: string
  tipo: "ingreso" | "egreso"
  descripcion: string
  contraparte: string
  medio: string
  monto: number
}

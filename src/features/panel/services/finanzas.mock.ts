import type {
  IFinanzasService,
  FinanzasMetricas,
  RentabilidadResponse,
  RentabilidadPunto,
  ComposicionResponse,
  TopProducto,
  MedioPago,
  ProyeccionResponse,
  Movimiento,
} from "../types/finanzas.types"
import metricasData from "./finanzas.metricas.mock.data.json"

async function mockFetch<T>(data: T, delayMs = 250): Promise<T> {
  await new Promise(r => setTimeout(r, delayMs))
  return data
}

// ─── Rentabilidad: 12 months of income vs cost ──────────────────────────────
const MESES = [
  "May", "Jun", "Jul", "Ago", "Sep", "Oct",
  "Nov", "Dic", "Ene", "Feb", "Mar", "Abr",
]
const INGRESOS = [
  9_870_000, 10_240_000, 11_180_000, 10_620_000, 12_050_000, 12_890_000,
  13_420_000, 15_890_000, 11_760_000, 12_310_000, 13_680_000, 14_820_000,
]
const COSTOS = [
  6_120_000, 6_380_000, 6_940_000, 6_610_000, 7_280_000, 7_610_000,
  7_980_000, 9_040_000, 7_120_000, 7_390_000, 8_020_000, 8_540_000,
]

const historico: RentabilidadPunto[] = MESES.map((periodo, i) => ({
  periodo,
  ingresos: INGRESOS[i],
  costos: COSTOS[i],
  cantidadCobros: 40 + Math.round(INGRESOS[i] / 320_000),
}))

const ultimoIngreso = INGRESOS[INGRESOS.length - 1]
const ultimoCosto = COSTOS[COSTOS.length - 1]

const rentabilidad: RentabilidadResponse = {
  ingresos: ultimoIngreso,
  costos: ultimoCosto,
  margen: (ultimoIngreso - ultimoCosto) / ultimoIngreso,
  cantidadCobros: historico[historico.length - 1].cantidadCobros,
  ticketPromedio: Math.round(ultimoIngreso / (historico[historico.length - 1].cantidadCobros ?? 1)),
  historico,
}

// ─── Composición: services vs products revenue ──────────────────────────────
const composicion: ComposicionResponse = {
  servicios: Math.round(ultimoIngreso * 0.62),
  productos: Math.round(ultimoIngreso * 0.38),
}

// ─── Top products sold ──────────────────────────────────────────────────────
const topProductos: TopProducto[] = [
  { productoId: "p-01", nombre: "Cadena Shimano HG601 11v", sku: "TRX-CAD-601", cantidadVendida: 84, ingresos: 1_512_000 },
  { productoId: "p-02", nombre: "Pastillas freno hidráulico", sku: "FRN-PAS-004", cantidadVendida: 132, ingresos: 1_188_000 },
  { productoId: "p-03", nombre: "Neumático MTB 29\" Tubeless", sku: "RDA-NEU-29T", cantidadVendida: 61, ingresos: 1_037_000 },
  { productoId: "p-04", nombre: "Kit transmisión GX Eagle 12v", sku: "TRX-KIT-GX12", cantidadVendida: 12, ingresos: 984_000 },
  { productoId: "p-05", nombre: "Cámara 700c Presta", sku: "RDA-CAM-700", cantidadVendida: 148, ingresos: 592_000 },
  { productoId: "p-06", nombre: "Aceite sellante Tubeless 1L", sku: "LUB-SEL-1000", cantidadVendida: 44, ingresos: 396_000 },
]

// ─── Payment methods ────────────────────────────────────────────────────────
const mediosPago: MedioPago[] = [
  { medio: "Tarjeta", monto: Math.round(ultimoIngreso * 0.48), cantidad: 96 },
  { medio: "Transferencia", monto: Math.round(ultimoIngreso * 0.34), cantidad: 41 },
  { medio: "Efectivo", monto: Math.round(ultimoIngreso * 0.18), cantidad: 33 },
]

// ─── Projection: realized so far + forecast for the running month ───────────
const proyeccion: ProyeccionResponse = {
  metaMensual: 16_000_000,
  proyectado: 15_240_000,
  puntos: [
    { periodo: "Sem 1", valor: 3_180_000, esProyeccion: false },
    { periodo: "Sem 2", valor: 6_940_000, esProyeccion: false },
    { periodo: "Sem 3", valor: 10_610_000, esProyeccion: false },
    { periodo: "Sem 4", valor: 15_240_000, esProyeccion: true },
  ],
}

// ─── Recent movements ───────────────────────────────────────────────────────
const movimientos: Movimiento[] = [
  { id: "OT-2041", fecha: "22 Abr 2026", tipo: "ingreso", descripcion: "Servicio full + cambio transmisión", contraparte: "Camila Rojas", medio: "Tarjeta", monto: 189_000 },
  { id: "OT-2039", fecha: "22 Abr 2026", tipo: "ingreso", descripcion: "Mantención básica", contraparte: "Diego Fuentes", medio: "Efectivo", monto: 42_000 },
  { id: "EGR-0117", fecha: "21 Abr 2026", tipo: "egreso", descripcion: "Compra repuestos proveedor", contraparte: "Distribuidora BikeParts", medio: "Transferencia", monto: 1_240_000 },
  { id: "OT-2036", fecha: "21 Abr 2026", tipo: "ingreso", descripcion: "Cambio pastillas + sangrado frenos", contraparte: "Valentina Soto", medio: "Transferencia", monto: 76_000 },
  { id: "OT-2034", fecha: "20 Abr 2026", tipo: "ingreso", descripcion: "Armado bicicleta nueva", contraparte: "Ignacio Pérez", medio: "Tarjeta", monto: 145_000 },
  { id: "EGR-0116", fecha: "20 Abr 2026", tipo: "egreso", descripcion: "Arriendo local Abril", contraparte: "Inmobiliaria Centro", medio: "Transferencia", monto: 850_000 },
  { id: "OT-2031", fecha: "19 Abr 2026", tipo: "ingreso", descripcion: "Neumáticos tubeless + sellante", contraparte: "María Torres", medio: "Efectivo", monto: 98_000 },
]

export const finanzasMock: IFinanzasService = {
  async getMetricas() {
    return mockFetch(metricasData as FinanzasMetricas)
  },
  async getRentabilidad() {
    return mockFetch(rentabilidad)
  },
  async getComposicion() {
    return mockFetch(composicion)
  },
  async getTopProductos() {
    return mockFetch(topProductos)
  },
  async getMediosPago() {
    return mockFetch(mediosPago)
  },
  async getProyeccion() {
    return mockFetch(proyeccion)
  },
  async getMovimientos() {
    return mockFetch(movimientos)
  },
}

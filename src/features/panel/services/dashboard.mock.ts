// ─── Types ────────────────────────────────────────────────────────────────────

export type KpiAccent = "violet" | "good" | "info" | "warn"
export type KpiIconKey = "ordenes" | "listas" | "cobros" | "stock"

export type DashboardKpi = {
  id: string
  title: string
  value: string
  delta: string
  trend: "up" | "down" | "warn"
  sub: string
  accent: KpiAccent
  iconKey: KpiIconKey
  spark?: number[]
  progress?: number
}

export type PipelineItem = {
  ot: string
  tipo: string
  modelo: string
  cliente: string
  pct?: number
}

export type PipelineColumn = {
  key: string
  label: string
  count: number
  color: string
  items: PipelineItem[]
}

export type OrdenUrgente = {
  ot: string
  cliente: string
  bici: string
  due: string
  level: "crit" | "warn"
  mecanico: string
}

export type MecanicoActivo = {
  id: string
  nombre: string
  iniciales: string
  color: string
  especialidad: string
  bahia: string
  horas: string
  estado: "activo" | "saturado" | "pausa"
  otsCursando: string[]
  capacidad: number
}

export type ActividadItem = {
  id: string
  texto: string  // plain string — HTML prototype used JSX bold; flattened here
  tiempo: string
  tone: "violet" | "good" | "warn" | "info"
  iconKey: "wrench" | "coin" | "alert" | "plus" | "users" | "doc"
}

export type RentabRow = {
  m: string
  ing: number
  cost: number
}

// ─── Async wrapper ─────────────────────────────────────────────────────────────

async function mockFetch<T>(data: T, delayMs = 250): Promise<T> {
  await new Promise(r => setTimeout(r, delayMs))
  return data
}

// ─── Mock data ─────────────────────────────────────────────────────────────────

const KPI_DATA: DashboardKpi[] = [
  {
    id: "ordenes-activas",
    title: "Órdenes activas",
    value: "14",
    delta: "+3",
    trend: "up",
    sub: "vs. ayer 11",
    accent: "violet",
    iconKey: "ordenes",
    spark: [4, 5, 5, 6, 8, 7, 9, 10, 11, 12, 13, 14],
  },
  {
    id: "bicis-listas",
    title: "Bicis listas para retiro",
    value: "06",
    delta: "+2",
    trend: "up",
    sub: "2 sin retirar > 48h",
    accent: "good",
    iconKey: "listas",
    spark: [1, 2, 2, 3, 4, 4, 5, 5, 6, 6, 6, 6],
  },
  {
    id: "cobros-dia",
    title: "Cobros del día",
    value: "$ 842.300",
    delta: "+24%",
    trend: "up",
    sub: "meta $ 1.100.000",
    accent: "info",
    iconKey: "cobros",
    progress: 0.76,
  },
  {
    id: "stock-bajo",
    title: "Stock bajo mínimo",
    value: "05",
    delta: "2 críticos",
    trend: "warn",
    sub: "cadenas, pastillas disco",
    accent: "warn",
    iconKey: "stock",
    spark: [1, 2, 2, 3, 3, 4, 4, 4, 5, 5, 5, 5],
  },
]

const PIPELINE_DATA: PipelineColumn[] = [
  {
    key: "recibido",
    label: "Recibido",
    count: 5,
    color: "#a59682",
    items: [
      { ot: "OT-0341", tipo: "MTB · Trek", modelo: "Marlin 7 2024", cliente: "P. Mora" },
      { ot: "OT-0342", tipo: "Ruta · Giant", modelo: "Contend AR 3", cliente: "C. Reyes" },
      { ot: "OT-0343", tipo: "Urbana · Scott", modelo: "Sub Cross 40", cliente: "M. Díaz" },
    ],
  },
  {
    key: "proceso",
    label: "En proceso",
    count: 6,
    color: "#6b5bd1",
    items: [
      { ot: "OT-0330", tipo: "MTB · Specialized", modelo: "Rockhopper Comp", cliente: "F. Tapia", pct: 0.62 },
      { ot: "OT-0331", tipo: "Gravel · Canyon", modelo: "Grail CF SL 7", cliente: "L. Pinto", pct: 0.35 },
      { ot: "OT-0333", tipo: "eBike · Orbea", modelo: "Rise H30", cliente: "A. Vera", pct: 0.88 },
    ],
  },
  {
    key: "listo",
    label: "Listo",
    count: 3,
    color: "#2f7d4f",
    items: [
      { ot: "OT-0315", tipo: "BMX · Haro", modelo: "Downtown DLX", cliente: "S. Núñez" },
      { ot: "OT-0318", tipo: "Ruta · Cannondale", modelo: "CAAD13 Disc 105", cliente: "R. Lagos" },
    ],
  },
  {
    key: "entregado",
    label: "Entregado",
    count: 4,
    color: "#3a6ea5",
    items: [
      { ot: "OT-0301", tipo: "MTB · Trek", modelo: "Fuel EX 7", cliente: "I. Soto" },
      { ot: "OT-0303", tipo: "Urbana · Kona", modelo: "Dew Plus", cliente: "T. Álvarez" },
    ],
  },
]

const URGENTES_DATA: OrdenUrgente[] = [
  { ot: "OT-0299", cliente: "Paulina Mora", bici: "Trek Marlin 7 · MTB", due: "Vencida 2d", level: "crit", mecanico: "R. Soto" },
  { ot: "OT-0304", cliente: "José Contreras", bici: "Specialized Allez · Ruta", due: "Vencida 1d", level: "crit", mecanico: "J. Bravo" },
  { ot: "OT-0312", cliente: "Fernanda Díaz", bici: "Giant Talon 1 · MTB", due: "Hoy 18:00", level: "warn", mecanico: "P. Herrera" },
  { ot: "OT-0320", cliente: "Rodrigo Vidal", bici: "Cannondale Topstone · Gravel", due: "Hoy 19:30", level: "warn", mecanico: "R. Soto" },
]

const MECANICOS_DATA: MecanicoActivo[] = [
  {
    id: "m-soto",
    nombre: "Rodrigo Soto",
    iniciales: "RS",
    color: "#6b5bd1",
    especialidad: "Frenos / Transmisión",
    bahia: "B-01",
    horas: "6.2h",
    estado: "activo",
    otsCursando: ["OT-0330", "OT-0299", "OT-0320", "OT-0312"],
    capacidad: 5,
  },
  {
    id: "m-bravo",
    nombre: "Javier Bravo",
    iniciales: "JB",
    color: "#2f7d4f",
    especialidad: "Ruedas / Alineación",
    bahia: "B-02",
    horas: "5.8h",
    estado: "activo",
    otsCursando: ["OT-0331", "OT-0304", "OT-0315"],
    capacidad: 5,
  },
  {
    id: "m-herrera",
    nombre: "Pablo Herrera",
    iniciales: "PH",
    color: "#c85a2a",
    especialidad: "Suspensión / eBike",
    bahia: "B-03",
    horas: "7.1h",
    estado: "saturado",
    otsCursando: ["OT-0333", "OT-0318", "OT-0341", "OT-0342", "OT-0343"],
    capacidad: 5,
  },
]

const ACTIVIDAD_DATA: ActividadItem[] = [
  { id: "a1", texto: "R. Soto terminó sangrado de frenos en OT-0333", tiempo: "hace 2 min", tone: "violet", iconKey: "wrench" },
  { id: "a2", texto: "Pago recibido $ 92.500 — Transferencia · OT-0318", tiempo: "hace 14 min", tone: "good", iconKey: "coin" },
  { id: "a3", texto: "Stock bajo: Cadena Shimano HG601 11v", tiempo: "hace 28 min", tone: "warn", iconKey: "alert" },
  { id: "a4", texto: "Nueva OT creada · Giant Contend AR 3", tiempo: "10:42", tone: "violet", iconKey: "plus" },
  { id: "a5", texto: "J. Bravo inició overhaul en OT-0331", tiempo: "10:15", tone: "info", iconKey: "wrench" },
  { id: "a6", texto: "Paulina Mora confirmó retiro 18:30", tiempo: "09:58", tone: "info", iconKey: "users" },
  { id: "a7", texto: "Boleta emitida · B-01284", tiempo: "09:12", tone: "good", iconKey: "doc" },
]

export const RENTAB_DATA: RentabRow[] = [
  { m: "Sem 15", ing: 28, cost: 16 },
  { m: "Sem 16", ing: 32, cost: 19 },
  { m: "Sem 17", ing: 26, cost: 17 },
  { m: "Sem 18", ing: 36, cost: 21 },
  { m: "Sem 19", ing: 40, cost: 22 },
  { m: "Sem 20", ing: 34, cost: 20 },
  { m: "Sem 21", ing: 42, cost: 23 },
  { m: "Sem 22", ing: 38, cost: 22 },
]

// ─── Service functions ─────────────────────────────────────────────────────────

export async function getDashboardKpis(): Promise<DashboardKpi[]> {
  return mockFetch(KPI_DATA)
}

export async function getPipelineSummary(): Promise<PipelineColumn[]> {
  return mockFetch(PIPELINE_DATA)
}

export async function getOrdenesUrgentes(): Promise<OrdenUrgente[]> {
  return mockFetch(URGENTES_DATA)
}

export async function getMecanicosActivos(): Promise<MecanicoActivo[]> {
  return mockFetch(MECANICOS_DATA)
}

export async function getActividadReciente(): Promise<ActividadItem[]> {
  return mockFetch(ACTIVIDAD_DATA, 150)
}

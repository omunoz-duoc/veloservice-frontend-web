// ─── Types ────────────────────────────────────────────────────────────────────

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


export async function getActividadReciente(): Promise<ActividadItem[]> {
  return mockFetch(ACTIVIDAD_DATA, 150)
}

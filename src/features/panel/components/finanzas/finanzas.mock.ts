// ─── Types ─────────────────────────────────────────────────────────────────────

export type CatPie = {
  k: string
  label: string
  val: number
  color: string
}

export type Movimiento = {
  id: string
  fecha: string
  tipo: "in" | "out"
  cat: string
  desc: string
  cliente: string
  metodo: string
  monto: number
}

export type ToneKey = "good" | "warn" | "violet" | "info"

// ─── Data ──────────────────────────────────────────────────────────────────────

export const MESES = ["May","Jun","Jul","Ago","Sep","Oct","Nov","Dic","Ene","Feb","Mar","Abr"]

export const SERIE_ING = [10240, 9870, 11320, 12450, 11890, 13420, 14580, 15890, 12340, 11780, 13560, 14820]
export const SERIE_EGR = [ 6420, 6890,  7150,  7980,  7320,  8120,  8560,  9420,  7890,  7210,  8330,  8940]

export const PREV_ING = [ 8120, 8540,  9210,  9870,  9540, 10720, 11890, 12890, 10120, 9890, 11320, 12410]
export const PREV_EGR = [ 5320, 5610,  5980,  6420,  6210,  6890,  7320,  7890,  6420, 6120,  6890,  7320]

export const ING_CATS: CatPie[] = [
  { k: "servicios", label: "Servicios de taller", val: 0.46, color: "#6b5bd1" },
  { k: "productos", label: "Venta de repuestos",  val: 0.31, color: "#3a6ea5" },
  { k: "ebike",     label: "Servicios E-bike",    val: 0.14, color: "#c85a2a" },
  { k: "otros",     label: "Otros",               val: 0.09, color: "#8c6a1e" },
]

export const EGR_CATS: CatPie[] = [
  { k: "compras",  label: "Compras a proveedores", val: 0.42, color: "#c85a2a" },
  { k: "sueldos",  label: "Sueldos y honorarios",  val: 0.34, color: "#6b5d46" },
  { k: "arriendo", label: "Arriendo y servicios",  val: 0.13, color: "#3a6ea5" },
  { k: "otros",    label: "Otros gastos",          val: 0.11, color: "#8c6a1e" },
]

export const MOVS: Movimiento[] = [
  { id: "MV-3982", fecha: "24 Abr · 17:42", tipo: "in",  cat: "Servicios", desc: "Cobro OT-0343 · Mantención Premium",       cliente: "P. Mora",      metodo: "Transferencia", monto:   68500 },
  { id: "MV-3981", fecha: "24 Abr · 16:10", tipo: "in",  cat: "Productos", desc: "Venta mostrador · Cadena KMC X11",          cliente: "Cliente paso", metodo: "Tarjeta",       monto:   32900 },
  { id: "MV-3980", fecha: "24 Abr · 14:25", tipo: "out", cat: "Compras",   desc: "OC-0042 · Bicisport SpA",                   cliente: "Bicisport SpA", metodo: "Transferencia", monto: 184200 },
  { id: "MV-3979", fecha: "24 Abr · 12:00", tipo: "in",  cat: "Servicios", desc: "Cobro OT-0341 · Centrado carbono",          cliente: "M. Díaz",      metodo: "Tarjeta",       monto:   25000 },
  { id: "MV-3978", fecha: "24 Abr · 10:48", tipo: "in",  cat: "E-bike",    desc: "Cobro OT-0340 · Inspección motor Bosch",    cliente: "A. Vera",      metodo: "Transferencia", monto:   30000 },
  { id: "MV-3977", fecha: "23 Abr · 19:00", tipo: "out", cat: "Sueldos",   desc: "Anticipo quincena · Mecánicos",             cliente: "Nómina",       metodo: "Transferencia", monto:  920000 },
  { id: "MV-3976", fecha: "23 Abr · 16:30", tipo: "in",  cat: "Servicios", desc: "Cobro OT-0339 · Overhaul completo",         cliente: "F. Tapia",     metodo: "Efectivo",      monto:  120000 },
  { id: "MV-3975", fecha: "23 Abr · 15:10", tipo: "out", cat: "Arriendo",  desc: "Boleta SEC · Electricidad Abril",           cliente: "Enel",         metodo: "PAT",           monto:  142800 },
  { id: "MV-3974", fecha: "23 Abr · 13:25", tipo: "in",  cat: "Productos", desc: "Venta · Pastillas Shimano J03A x2",         cliente: "Cliente paso", metodo: "Efectivo",      monto:   29800 },
  { id: "MV-3973", fecha: "23 Abr · 11:00", tipo: "in",  cat: "Servicios", desc: "Cobro OT-0338 · Mantención básica",         cliente: "L. Pinto",     metodo: "Tarjeta",       monto:   35000 },
  { id: "MV-3972", fecha: "22 Abr · 18:40", tipo: "out", cat: "Compras",   desc: "OC-0041 · Maxxis Andina",                   cliente: "Maxxis Andina", metodo: "Transferencia", monto: 326400 },
  { id: "MV-3971", fecha: "22 Abr · 14:55", tipo: "in",  cat: "Servicios", desc: "Cobro OT-0337 · Recarga tubeless x2",       cliente: "S. Núñez",     metodo: "Transferencia", monto:   20000 },
]

// ─── Derived constants ─────────────────────────────────────────────────────────

export const ULT_MES_ING  = SERIE_ING[SERIE_ING.length - 1]! * 1000
export const ULT_MES_EGR  = SERIE_EGR[SERIE_EGR.length - 1]! * 1000
export const ULT_PREV_ING = PREV_ING[PREV_ING.length - 1]! * 1000
export const ULT_PREV_EGR = PREV_EGR[PREV_EGR.length - 1]! * 1000

export const TOTAL_ING = SERIE_ING.reduce((a, b) => a + b, 0) * 1000
export const TOTAL_EGR = SERIE_EGR.reduce((a, b) => a + b, 0) * 1000

// ─── Utils ─────────────────────────────────────────────────────────────────────

export function fmt(n: number): string {
  return "$ " + n.toLocaleString("es-CL")
}

export function fmtMK(n: number): string {
  if (n >= 1_000_000) return "$" + (n / 1_000_000).toFixed(1) + "M"
  if (n >= 1_000)     return "$" + (n / 1_000).toFixed(0) + "K"
  return "$" + n
}

export function delta(curr: number, prev: number): { val: string; positive: boolean; sign: string } {
  const d = ((curr - prev) / prev) * 100
  return { val: Math.abs(d).toFixed(1), positive: d >= 0, sign: d >= 0 ? "+" : "−" }
}

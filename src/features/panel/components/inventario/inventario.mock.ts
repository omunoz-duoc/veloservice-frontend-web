// ─── Types ─────────────────────────────────────────────────────────────────────

export type CatKey = "transmision" | "frenos" | "ruedas" | "suspension" | "accesorios" | "lubricantes" | "ebike" | "herramientas"

export type Categoria = {
  key: CatKey
  label: string
  fg: string
  bg: string
}

export type StockEstado = "ok" | "low" | "out"

export type Producto = {
  id: string
  nombre: string
  ref: string
  cat: CatKey
  costo: number
  precio: number
  stock: number
  min: number
  prov: string
  ubic: string
}

export type Movimiento = {
  texto: string
  fecha: string
  qty: number
}

export type NuevoProductoPayload = {
  nombre: string
  ref: string
  cat: CatKey
  costo: string
  precio: string
  stock: string
  min: string
  prov: string
  ubic: string
}

// ─── Config ────────────────────────────────────────────────────────────────────

export const CATEGORIAS: Categoria[] = [
  { key: "transmision",  label: "Transmisión",  fg: "#6b5bd1", bg: "#ebe7fa" },
  { key: "frenos",       label: "Frenos",       fg: "#c85a2a", bg: "#fbeadd" },
  { key: "ruedas",       label: "Ruedas",       fg: "#3a6ea5", bg: "#e4eaf2" },
  { key: "suspension",   label: "Suspensión",   fg: "#8c6a1e", bg: "#faecd6" },
  { key: "accesorios",   label: "Accesorios",   fg: "#6b5d46", bg: "#efe9df" },
  { key: "lubricantes",  label: "Lubricantes",  fg: "#2f7d4f", bg: "#e4f1e8" },
  { key: "ebike",        label: "eBike",        fg: "#111418", bg: "#ece7de" },
  { key: "herramientas", label: "Herramientas", fg: "#3a6ea5", bg: "#e4eaf2" },
]

// ─── Mock data ─────────────────────────────────────────────────────────────────

export const PRODUCTOS_MOCK: Producto[] = [
  { id: "P-0120", nombre: "Cadena Shimano CN-HG701",                    ref: "SH-CN-HG701-11V",   cat: "transmision",  costo: 18900,  precio: 27900,  stock: 14, min: 6,  prov: "Bicisport SpA",   ubic: "A-03-12" },
  { id: "P-0121", nombre: "Pastillas freno Shimano J03A",               ref: "SH-J03A-MT",         cat: "frenos",       costo: 9200,   precio: 14900,  stock: 28, min: 10, prov: "Bicisport SpA",   ubic: "B-01-04" },
  { id: "P-0122", nombre: "Neumático Maxxis Minion DHF 29×2.5",         ref: "MX-DHF-29-25",       cat: "ruedas",       costo: 32400,  precio: 48900,  stock: 6,  min: 4,  prov: "Cyclemax",        ubic: "C-02-01" },
  { id: "P-0123", nombre: "Cámara Continental Race 28 700x25-32",       ref: "CT-RC28-PV",         cat: "ruedas",       costo: 4100,   precio: 6900,   stock: 48, min: 20, prov: "Cyclemax",        ubic: "C-01-07" },
  { id: "P-0124", nombre: "Kit servicio Fox 34 Lowers",                 ref: "FX-34-LOW-SRV",      cat: "suspension",   costo: 38700,  precio: 54900,  stock: 3,  min: 2,  prov: "Fox Racing CL",   ubic: "D-02-03" },
  { id: "P-0125", nombre: "Aceite Motorex Racing Oil 5wt",              ref: "MTX-RACE-5W-1L",     cat: "lubricantes",  costo: 12800,  precio: 18900,  stock: 9,  min: 5,  prov: "Motorex Chile",   ubic: "E-04-02" },
  { id: "P-0126", nombre: "Pastillas metálicas Shimano B05S",           ref: "SH-B05S-MT",         cat: "frenos",       costo: 10400,  precio: 15900,  stock: 2,  min: 8,  prov: "Bicisport SpA",   ubic: "B-01-05" },
  { id: "P-0127", nombre: "Casete SRAM PG-1210 11-50T",                ref: "SR-PG1210-11-50",    cat: "transmision",  costo: 44900,  precio: 64900,  stock: 5,  min: 3,  prov: "SRAM Andina",     ubic: "A-04-02" },
  { id: "P-0128", nombre: "Grip Ergon GA3",                             ref: "ERG-GA3-BK",         cat: "accesorios",   costo: 11200,  precio: 17900,  stock: 22, min: 10, prov: "Ergon LatAm",     ubic: "F-01-11" },
  { id: "P-0129", nombre: "Batería Bosch PowerTube 625Wh",              ref: "BCH-PT-625",         cat: "ebike",        costo: 489000, precio: 649000, stock: 1,  min: 1,  prov: "Bosch eBike",     ubic: "G-01-01" },
  { id: "P-0130", nombre: "Lubricante cadena Squirt 120ml",             ref: "SQT-LUBE-120",       cat: "lubricantes",  costo: 6400,   precio: 9900,   stock: 0,  min: 10, prov: "Squirt Chile",    ubic: "E-03-04" },
  { id: "P-0131", nombre: "Llave de bujes par Park Tool HCW-17",        ref: "PKT-HCW-17",         cat: "herramientas", costo: 22800,  precio: 34900,  stock: 4,  min: 2,  prov: "Park Tool Chile", ubic: "H-02-01" },
  { id: "P-0132", nombre: "Rotor Shimano RT66 180mm",                   ref: "SH-RT66-180",        cat: "frenos",       costo: 15400,  precio: 22900,  stock: 7,  min: 4,  prov: "Bicisport SpA",   ubic: "B-02-03" },
  { id: "P-0133", nombre: "Cadena KMC X11 EL Gold",                     ref: "KMC-X11EL-GLD",      cat: "transmision",  costo: 21700,  precio: 32900,  stock: 11, min: 5,  prov: "KMC LatAm",       ubic: "A-03-09" },
]

export const MOVIMIENTOS_MOCK: Movimiento[] = [
  { texto: "Salida · OT-0339 (Overhaul Rockhopper)", fecha: "22 Abr · 15:20", qty: -2 },
  { texto: "Entrada · OC-0042 (Bicisport SpA)",      fecha: "18 Abr · 10:00", qty: +12 },
  { texto: "Salida · OT-0322",                        fecha: "12 Abr · 17:30", qty: -1 },
]

// ─── Utils ─────────────────────────────────────────────────────────────────────

export function fmt(n: number): string {
  return "$ " + n.toLocaleString("es-CL")
}

export function margen(precio: number, costo: number): number {
  return Math.round(((precio - costo) / precio) * 100)
}

export function stockEstado(stock: number, min: number): StockEstado {
  if (stock === 0) return "out"
  if (stock < min) return "low"
  return "ok"
}

export function nextProductoId(productos: Producto[]): string {
  const nums = productos.map(p => parseInt(p.id.split("-")[1] ?? "0"))
  return `P-${(Math.max(...nums, 133) + 1).toString().padStart(4, "0")}`
}

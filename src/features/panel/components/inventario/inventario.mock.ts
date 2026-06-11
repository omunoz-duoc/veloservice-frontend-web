// ─── Types ─────────────────────────────────────────────────────────────────────

export type CatKey = "transmision" | "frenos" | "ruedas" | "suspension" | "accesorios" | "lubricantes" | "ebike" | "herramientas"

export type Categoria = {
  key: CatKey
  label: string
  fg: string
  bg: string
}

export type CategoriaConfig = Categoria | {
  key: string
  label: string
  fg: string
  bg: string
}

export type StockEstado = "ok" | "low" | "out"

export type Producto = {
  id: string
  nombre: string
  ref: string
  cat: string
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

export function getCategoriaConfig(categoria?: string | null): CategoriaConfig {
  return CATEGORIAS.find(c => c.key === categoria) ?? {
    key: categoria || "sin_categoria",
    label: categoria || "Sin categoría",
    bg: "#efe9df",
    fg: "#6b5d46",
  }
}

// ─── Mock data ─────────────────────────────────────────────────────────────────
export const MOVIMIENTOS_MOCK: Movimiento[] = [
  { texto: "Salida · OT-0339 (Overhaul Rockhopper)", fecha: "22 Abr · 15:20", qty: -2 },
  { texto: "Entrada · OC-0042 (Bicisport SpA)",      fecha: "18 Abr · 10:00", qty: +12 },
  { texto: "Salida · OT-0322",                        fecha: "12 Abr · 17:30", qty: -1 },
]

// ─── Utils ─────────────────────────────────────────────────────────────────────

export function fmt(n?: number | null): string {
  const value = Number.isFinite(n) ? Number(n) : 0
  return "$ " + value.toLocaleString("es-CL")
}

export function margen(precio: number, costo: number): number {
  if (!Number.isFinite(precio) || !Number.isFinite(costo) || precio <= 0) return 0
  return Math.round(((precio - costo) / precio) * 100)
}

export function stockEstado(stock: number, min: number): StockEstado {
  if (stock === 0) return "out"
  if (stock < min) return "low"
  return "ok"
}

export function productoVisibleId(producto: Pick<Producto, "id" | "ref">): string {
  if (producto.ref?.trim()) return producto.ref
  return producto.id.length > 12 ? `${producto.id.slice(0, 8)}...` : producto.id
}

export function nextProductoId(productos: Producto[]): string {
  const nums = productos.map(p => parseInt(p.id.split("-")[1] ?? "0"))
  return `P-${(Math.max(...nums, 133) + 1).toString().padStart(4, "0")}`
}

import type { EstadoOT, OrdenCatalogoItem, Prioridad, TipoOT } from "../types/ordenes.types"

export type OrdenCatalogos = {
  estados: OrdenCatalogoItem[]
  tipos: OrdenCatalogoItem[]
  prioridades: OrdenCatalogoItem[]
}

export const ESTADOS_ORDEN_FALLBACK: OrdenCatalogoItem[] = [
  { codigo: "recibida", nombre: "Recibida" },
  { codigo: "en_diagnostico", nombre: "En diagnostico" },
  { codigo: "esperando_repuestos", nombre: "Esperando repuestos" },
  { codigo: "en_reparacion", nombre: "En reparacion" },
  { codigo: "control_calidad", nombre: "Control calidad" },
  { codigo: "lista_para_entrega", nombre: "Lista para entrega" },
  { codigo: "entregada", nombre: "Entregada" },
  { codigo: "cancelada", nombre: "Cancelada" },
]

export const TIPOS_ORDEN_FALLBACK: OrdenCatalogoItem[] = [
  { codigo: "mantencion", nombre: "Mantencion" },
  { codigo: "reparacion", nombre: "Reparacion" },
  { codigo: "revision", nombre: "Revision" },
  { codigo: "armado", nombre: "Armado" },
  { codigo: "garantia", nombre: "Garantia" },
  { codigo: "personalizacion", nombre: "Personalizacion" },
]

export const PRIORIDADES_ORDEN_FALLBACK: OrdenCatalogoItem[] = [
  { codigo: "baja", nombre: "Baja" },
  { codigo: "media", nombre: "Media" },
  { codigo: "alta", nombre: "Alta" },
]

export const ORDEN_CATALOGOS_FALLBACK: OrdenCatalogos = {
  estados: ESTADOS_ORDEN_FALLBACK,
  tipos: TIPOS_ORDEN_FALLBACK,
  prioridades: PRIORIDADES_ORDEN_FALLBACK,
}

const ESTADOS_VALIDOS = new Set(ESTADOS_ORDEN_FALLBACK.map(item => item.codigo))
const TIPOS_VALIDOS = new Set(TIPOS_ORDEN_FALLBACK.map(item => item.codigo))
const PRIORIDADES_VALIDAS = new Set(PRIORIDADES_ORDEN_FALLBACK.map(item => item.codigo))

export const ESTADO_COLORS: Record<EstadoOT, { fg: string; bg: string; dot: string }> = {
  recibida: { fg: "#6b5d46", bg: "#efe9df", dot: "#a59682" },
  en_diagnostico: { fg: "#3a6ea5", bg: "#e4eaf2", dot: "#3a6ea5" },
  esperando_repuestos: { fg: "#c85a2a", bg: "#fbeadd", dot: "#c85a2a" },
  en_reparacion: { fg: "#6b5bd1", bg: "#ebe7fa", dot: "#6b5bd1" },
  control_calidad: { fg: "#8c6a1e", bg: "#faecd6", dot: "#8c6a1e" },
  lista_para_entrega: { fg: "#2f7d4f", bg: "#e4f1e8", dot: "#2f7d4f" },
  entregada: { fg: "#3a6ea5", bg: "#e4eaf2", dot: "#3a6ea5" },
  cancelada: { fg: "#6b5d46", bg: "#ece7de", dot: "#6b5d46" },
}

export const TIPO_COLORS: Record<TipoOT, { fg: string; bg: string }> = {
  mantencion: { fg: "#6b5bd1", bg: "#ebe7fa" },
  reparacion: { fg: "#c85a2a", bg: "#fbeadd" },
  revision: { fg: "#111418", bg: "#ece7de" },
  armado: { fg: "#8c6a1e", bg: "#faecd6" },
  garantia: { fg: "#2f7d4f", bg: "#e4f1e8" },
  personalizacion: { fg: "#3a6ea5", bg: "#e4eaf2" },
}

export const PRIORIDAD_COLORS: Record<Prioridad, { fg: string; bg: string }> = {
  baja: { fg: "#6b5d46", bg: "#efe9df" },
  media: { fg: "#3a6ea5", bg: "#e4eaf2" },
  alta: { fg: "#c85a2a", bg: "#fbeadd" },
}

export function normalizeCatalogCode(value: string | null | undefined) {
  return (value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_")
}

function normalizeCatalogItem(item: unknown): OrdenCatalogoItem | null {
  if (!item || typeof item !== "object") return null
  const value = item as { id?: unknown; codigo?: unknown; nombre?: unknown; name?: unknown; label?: unknown }
  const codigo = normalizeCatalogCode(typeof value.codigo === "string" ? value.codigo : "")
  if (!codigo) return null
  const nombre = typeof value.nombre === "string"
    ? value.nombre
    : typeof value.label === "string"
      ? value.label
      : typeof value.name === "string"
        ? value.name
        : codigo
  return {
    id: typeof value.id === "string" ? value.id : undefined,
    codigo,
    nombre,
  }
}

export function normalizeCatalogResponse(payload: unknown, key: "estados" | "tipos" | "prioridades") {
  const raw = Array.isArray(payload)
    ? payload
    : payload && typeof payload === "object" && Array.isArray((payload as Record<string, unknown>)[key])
      ? (payload as Record<string, unknown>)[key] as unknown[]
      : []
  return raw.map(normalizeCatalogItem).filter((item): item is OrdenCatalogoItem => item !== null)
}

export function normalizeEstadoOrden(value: string | null | undefined): EstadoOT {
  const code = normalizeCatalogCode(value)
  return (ESTADOS_VALIDOS.has(code) ? code : "recibida") as EstadoOT
}

export function normalizeTipoOrden(value: string | null | undefined): TipoOT {
  const code = normalizeCatalogCode(value)
  return (TIPOS_VALIDOS.has(code) ? code : "mantencion") as TipoOT
}

export function normalizePrioridadOrden(value: string | null | undefined): Prioridad {
  const code = normalizeCatalogCode(value)
  return (PRIORIDADES_VALIDAS.has(code) ? code : "media") as Prioridad
}

export function catalogLabel(items: OrdenCatalogoItem[], codigo: string) {
  return items.find(item => item.codigo === codigo)?.nombre ?? codigo
}

export function catalogOptions<TCode extends string>(items: OrdenCatalogoItem[]) {
  return items.map(item => ({ value: item.codigo as TCode, label: item.nombre }))
}

import type { TipoOT, EstadoOT, Prioridad, TipoBici } from "./ordenes.types"

export const TIPO_CONFIG: Record<TipoOT, { label: string; fg: string; bg: string }> = {
  personalizacion: { label: "Personalización", fg: "#3a6ea5", bg: "#e4eaf2" },
  mantencion:  { label: "Mantención",  fg: "#6b5bd1", bg: "#ebe7fa" },
  reparacion:  { label: "Reparación",  fg: "#c85a2a", bg: "#fbeadd" },
  revision:    { label: "Revisión",    fg: "#111418", bg: "#ece7de" },
  garantia:    { label: "Garantía",    fg: "#2f7d4f", bg: "#e4f1e8" },
  armado:      { label: "Armado",      fg: "#8c6a1e", bg: "#faecd6" },
}

export const ESTADO_CONFIG: Record<EstadoOT, { label: string; fg: string; bg: string; dot: string }> = {
  recibido:  { label: "Recibido",      fg: "#6b5d46", bg: "#efe9df", dot: "#a59682" },
  proceso:   { label: "En proceso",    fg: "#6b5bd1", bg: "#ebe7fa", dot: "#6b5bd1" },
  espera:    { label: "Esp. repuesto", fg: "#c85a2a", bg: "#fbeadd", dot: "#c85a2a" },
  listo:     { label: "Listo",         fg: "#2f7d4f", bg: "#e4f1e8", dot: "#2f7d4f" },
  entregado: { label: "Entregado",     fg: "#3a6ea5", bg: "#e4eaf2", dot: "#3a6ea5" },
}

export const PRIORIDAD_CONFIG: Record<Prioridad, { label: string; fg: string; bg: string }> = {
  baja:  { label: "Baja",  fg: "#6b5d46", bg: "#efe9df" },
  media: { label: "Media", fg: "#3a6ea5", bg: "#e4eaf2" },
  alta:  { label: "Alta",  fg: "#c85a2a", bg: "#fbeadd" },
}

export const TIPOS_BICI: TipoBici[] = [
  "MTB", "MTB Full", "Ruta", "Gravel", "Urbana", "BMX", "eBike MTB", "eBike Urbana", "Otro",
]

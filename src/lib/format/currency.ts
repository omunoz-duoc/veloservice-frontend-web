const clpFormatter = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
})

const numberFormatter = new Intl.NumberFormat("es-CL", {
  maximumFractionDigits: 0,
})

/** Formats a number as Chilean pesos, e.g. 1234567 -> "$1.234.567". */
export function formatCLP(value: number): string {
  return clpFormatter.format(Number.isFinite(value) ? value : 0)
}

/** Formats a plain integer with es-CL thousands separators, e.g. 1234 -> "1.234". */
export function formatNumber(value: number): string {
  return numberFormatter.format(Number.isFinite(value) ? value : 0)
}

/**
 * Compact peso formatting for axis ticks / dense chips, e.g.
 * 1_250_000 -> "$1,3M", 84_000 -> "$84k".
 */
export function formatCLPCompact(value: number): string {
  const v = Number.isFinite(value) ? value : 0
  const abs = Math.abs(v)
  const sign = v < 0 ? "-" : ""
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1).replace(".", ",")}M`
  if (abs >= 1_000) return `${sign}$${Math.round(abs / 1_000)}k`
  return `${sign}$${Math.round(abs)}`
}

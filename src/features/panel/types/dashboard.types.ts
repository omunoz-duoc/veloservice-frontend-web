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

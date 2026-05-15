import type { DashboardKpi } from "@/features/panel/types/dashboard.types"
import { useFinanzasMetricas } from "./useFinanzasMetricas"
import { useInventarioMetricas } from "./useInventarioMetricas"
import { useOrdenesKpis } from "./useOrdenesKpis"

export function useDashboardKpis(): { data: DashboardKpi[]; isLoading: boolean } {
  const finanzas = useFinanzasMetricas()
  const inventario = useInventarioMetricas()
  const ordenes = useOrdenesKpis()

  const isLoading = finanzas.isLoading || inventario.isLoading || ordenes.isLoading

  const cobros = finanzas.data?.cobrosDelDia ?? 0
  const stockBajo = inventario.data?.stockBajo ?? 0
  const activas = ordenes.data?.activas ?? 0
  const listas = ordenes.data?.listas ?? 0

  const data: DashboardKpi[] = [
    {
      id: "ordenes-activas",
      title: "Órdenes activas",
      value: String(activas).padStart(2, "0"),
      delta: "",
      trend: "up",
      sub: `${activas} en curso`,
      accent: "violet",
      iconKey: "ordenes",
      spark: [4, 5, 5, 6, 8, 7, 9, 10, 11, 12, 13, activas],
    },
    {
      id: "bicis-listas",
      title: "Bicis listas para retiro",
      value: String(listas).padStart(2, "0"),
      delta: "",
      trend: "up",
      sub: `${listas} esperando retiro`,
      accent: "good",
      iconKey: "listas",
      spark: [1, 2, 2, 3, 4, 4, 5, 5, 6, 6, 6, listas],
    },
    {
      id: "cobros-dia",
      title: "Cobros del día",
      value: `$ ${cobros.toLocaleString("es-CL")}`,
      delta: "",
      trend: "up",
      sub: "meta $ 1.100.000",
      accent: "info",
      iconKey: "cobros",
      progress: Math.min(cobros / 1_100_000, 1),
    },
    {
      id: "stock-bajo",
      title: "Stock bajo mínimo",
      value: String(stockBajo).padStart(2, "0"),
      delta: "",
      trend: "warn",
      sub: "productos bajo mínimo",
      accent: "warn",
      iconKey: "stock",
      spark: [1, 2, 2, 3, 3, 4, 4, 4, 5, 5, 5, stockBajo],
    },
  ]

  return { data, isLoading }
}

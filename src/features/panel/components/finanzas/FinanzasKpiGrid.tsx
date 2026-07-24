"use client"

import { Banknote, Percent, Receipt, Wallet } from "lucide-react"
import { KpiCard } from "@/components/common/KpiCard"
import { useRentabilidad } from "@/features/panel/hooks/useRentabilidad"
import { useFinanzasMetricas } from "@/features/panel/hooks/useFinanzasMetricas"
import type { FinanzasMetricas } from "@/features/panel/types/finanzas.types"
import { formatCLP, formatNumber } from "@/lib/format/currency"

function cobrosDelDia(m: FinanzasMetricas | undefined): number {
  return Number(m?.cobrosDelDia ?? m?.cobros_del_dia ?? 0)
}
function cantidadCobrosDia(m: FinanzasMetricas | undefined): number {
  return Number(m?.cantidadCobrosDia ?? m?.cantidad_cobros_dia ?? 0)
}

function Skeletons() {
  return (
    <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-[148px] animate-pulse rounded-[24px] border border-vs-line bg-vs-card" />
      ))}
    </div>
  )
}

export function FinanzasKpiGrid() {
  const { data: rent, isLoading: loadingRent } = useRentabilidad()
  const { data: metricas, isLoading: loadingMetricas } = useFinanzasMetricas()

  if (loadingRent || loadingMetricas) return <Skeletons />

  const historico = rent?.historico ?? []
  const spark = historico.map(p => p.ingresos)
  const ultimo = historico[historico.length - 1]?.ingresos ?? Number(rent?.ingresos ?? 0)
  const anterior = historico[historico.length - 2]?.ingresos ?? 0
  const mom = anterior > 0 ? ((ultimo - anterior) / anterior) * 100 : null

  const ingresos = Number(rent?.ingresos ?? ultimo)
  const margenPct = Number(rent?.margen ?? 0) * 100
  const ticket = Number(rent?.ticketPromedio ?? 0)

  const momLabel = mom === null ? "" : `${mom >= 0 ? "+" : ""}${mom.toFixed(1)}%`

  return (
    <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        title="Ingresos del mes"
        value={formatCLP(ingresos)}
        delta={momLabel}
        trend={mom !== null && mom < 0 ? "warn" : "up"}
        sub="Último mes cerrado"
        accent="violet"
        icon={Banknote}
        spark={spark.length > 1 ? spark : undefined}
      />
      <KpiCard
        title="Margen"
        value={`${margenPct.toFixed(1)}%`}
        delta=""
        trend="up"
        sub="Ingresos menos costos"
        accent="good"
        icon={Percent}
        progress={Math.max(0, Math.min(margenPct / 100, 1))}
        insight={`Utilidad ${formatCLP(ingresos - Number(rent?.costos ?? 0))}`}
      />
      <KpiCard
        title="Ticket promedio"
        value={formatCLP(ticket)}
        delta=""
        trend="up"
        sub={`${formatNumber(Number(rent?.cantidadCobros ?? 0))} cobros`}
        accent="info"
        icon={Receipt}
      />
      <KpiCard
        title="Cobros de hoy"
        value={formatCLP(cobrosDelDia(metricas))}
        delta=""
        trend="up"
        sub={`${formatNumber(cantidadCobrosDia(metricas))} transacciones`}
        accent="warn"
        icon={Wallet}
      />
    </div>
  )
}

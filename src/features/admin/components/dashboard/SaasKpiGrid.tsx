"use client"

import { useMemo } from "react"
import {
  Building2,
  TrendingUp,
  UserPlus,
  TrendingDown,
  CalendarClock,
} from "lucide-react"
import { KpiCard } from "@/components/common/KpiCard"
import type { SaasKpis } from "@/features/admin/services/admin.types"
import { Sparkline } from "@/components/common/Sparkline"

type Accent = "violet" | "good" | "info" | "warn" | "ink"

function kpiItems(kpis: SaasKpis) {
  return [
    {
      title: "Total Talleres",
      value: kpis.totalTalleres.toString(),
      delta: `${kpis.talleresActivos} activos`,
      trend: "up" as const,
      sub: "Registrados en la plataforma",
      accent: "ink" as Accent,
      icon: Building2,
      spark: [12, 14, 13, 15, 16, 18, 17, 19, 20, 22, 21, 23],
    },
    {
      title: "MRR Total",
      value: `$${(kpis.mrrTotal / 1000).toFixed(0)}k`,
      delta: kpis.mrrDelta,
      trend: "up" as const,
      sub: "Ingreso recurrente mensual",
      accent: "good" as Accent,
      icon: TrendingUp,
      spark: [180, 195, 210, 225, 240, 255, 270, 290, 310, 335, 360, 390],
    },
    {
      title: "Talleres Nuevos (Mes)",
      value: kpis.talleresNuevosMes.toString(),
      delta: "Este mes",
      trend: "up" as const,
      sub: "Registros en el mes actual",
      accent: "violet" as Accent,
      icon: UserPlus,
      spark: [1, 0, 1, 2, 1, 1, 2, 1, 2, 1, 2, 0],
    },
    {
      title: "Churn Rate",
      value: kpis.churnRate,
      delta: kpis.trialToPaidRate + " trial → paid",
      trend: "warn" as const,
      sub: "Tasa de cancelación mensual",
      accent: "warn" as Accent,
      icon: TrendingDown,
      spark: [0, 0, 0, 4.5, 0, 2.1, 0, 3.0, 0, 1.5, 0, 2.3],
    },
    {
      title: "Suscripciones por Vencer",
      value: "3",
      delta: "< 30 días",
      trend: "warn" as const,
      sub: "Requieren atención de renovación",
      accent: "info" as Accent,
      icon: CalendarClock,
      progress: 0.25,
    },
  ]
}

export function SaasKpiGrid({ kpis }: { kpis: SaasKpis }) {
  const items = useMemo(() => kpiItems(kpis), [kpis])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-6">
      {items.map((item) => (
        <KpiCard
          key={item.title}
          title={item.title}
          value={item.value}
          delta={item.delta}
          trend={item.trend}
          sub={item.sub}
          accent={item.accent}
          icon={item.icon}
          spark={item.spark}
          progress={item.progress}
        />
      ))}
    </div>
  )
}

"use client"

import {
  ClipboardList, CheckCircle2, Coins, AlertTriangle,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { KpiCard } from "@/components/common/KpiCard"
import { useDashboardKpis } from "@/features/panel/hooks/useDashboardKpis"
import type { KpiIconKey } from "@/features/panel/types/dashboard.types"

const ICON_MAP: Record<KpiIconKey, LucideIcon> = {
  ordenes: ClipboardList,
  listas:  CheckCircle2,
  cobros:  Coins,
  stock:   AlertTriangle,
}

export function KpiGrid() {
  const { data: kpis = [], isLoading } = useDashboardKpis()

  if (isLoading) {
    return (
      <div className="mb-4 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            className="bg-vs-card border border-vs-line rounded-[24px] p-4 h-[148px] animate-pulse"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="mb-4 grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map(kpi => (
        <KpiCard
          key={kpi.id}
          title={kpi.title}
          value={kpi.value}
          delta={kpi.delta}
          trend={kpi.trend}
          sub={kpi.sub}
          accent={kpi.accent}
          icon={ICON_MAP[kpi.iconKey]}
          spark={kpi.spark}
          progress={kpi.progress}
        />
      ))}
    </div>
  )
}

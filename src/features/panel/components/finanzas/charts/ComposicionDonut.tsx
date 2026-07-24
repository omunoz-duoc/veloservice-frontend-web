"use client"

import { useMemo } from "react"
import { Doughnut } from "react-chartjs-2"
import type { ChartData } from "chart.js"
import { SectionHeader } from "@/components/common/SectionHeader"
import { useComposicion } from "@/features/panel/hooks/useComposicion"
import { formatCLP } from "@/lib/format/currency"
import "./registerCharts"
import { VS, doughnutOptions } from "./chartTheme"

const SEGMENTS = [
  { key: "servicios" as const, label: "Servicios", color: VS.violet },
  { key: "productos" as const, label: "Productos", color: VS.info },
]

export function ComposicionDonut() {
  const { data, isLoading, isError } = useComposicion()

  const total = (data?.servicios ?? 0) + (data?.productos ?? 0)

  const chartData = useMemo<ChartData<"doughnut">>(() => ({
    labels: SEGMENTS.map(s => s.label),
    datasets: [
      {
        data: SEGMENTS.map(s => data?.[s.key] ?? 0),
        backgroundColor: SEGMENTS.map(s => s.color),
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  }), [data])

  const isEmpty = !isLoading && !isError && total === 0

  return (
    <div className="flex min-w-0 flex-col rounded-[24px] border border-vs-line bg-vs-card p-5">
      <SectionHeader overline="Origen de ingresos" title="Composición" />

      {isLoading && <div className="h-[180px] rounded-[18px] bg-vs-chip animate-pulse" />}
      {isError && (
        <div className="flex h-[180px] items-center justify-center text-[12px] text-vs-warn">
          No se pudo cargar la composición.
        </div>
      )}
      {isEmpty && (
        <div className="flex h-[180px] items-center justify-center text-[12px] text-[#8a7f70]">
          Sin ingresos en el periodo.
        </div>
      )}

      {!isLoading && !isError && total > 0 && (
        <div className="flex items-center gap-5">
          <div className="relative h-[150px] w-[150px] shrink-0">
            <Doughnut data={chartData} options={doughnutOptions()} />
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[10px] text-[#8a7f70]">Total</span>
              <span className="font-mono text-[13px] font-bold">{formatCLP(total)}</span>
            </div>
          </div>
          <div className="min-w-0 flex-1 space-y-2.5">
            {SEGMENTS.map(s => {
              const val = data?.[s.key] ?? 0
              const pct = total > 0 ? Math.round((val / total) * 100) : 0
              return (
                <div key={s.key} className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 shrink-0 rounded" style={{ background: s.color }} />
                    <span className="flex-1 truncate text-[12px] text-[#4a4438]">{s.label}</span>
                    <span className="font-mono text-[11.5px] font-semibold">{pct}%</span>
                  </div>
                  <div className="mt-1 pl-4 font-mono text-[11px] text-[#8a7f70]">{formatCLP(val)}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

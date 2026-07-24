"use client"

import { useMemo } from "react"
import { Doughnut } from "react-chartjs-2"
import type { ChartData } from "chart.js"
import { SectionHeader } from "@/components/common/SectionHeader"
import { useMediosPago } from "@/features/panel/hooks/useMediosPago"
import { formatCLP } from "@/lib/format/currency"
import "./registerCharts"
import { CATEGORICAL, doughnutOptions } from "./chartTheme"

export function MediosPagoChart() {
  const { data, isLoading, isError } = useMediosPago()

  const medios = useMemo(() => data ?? [], [data])
  const total = medios.reduce((sum, m) => sum + m.monto, 0)

  const chartData = useMemo<ChartData<"doughnut">>(() => ({
    labels: medios.map(m => m.medio),
    datasets: [
      {
        data: medios.map(m => m.monto),
        backgroundColor: medios.map((_, i) => CATEGORICAL[i % CATEGORICAL.length]),
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  }), [medios])

  return (
    <div className="flex min-w-0 flex-col rounded-[24px] border border-vs-line bg-vs-card p-5">
      <SectionHeader overline="Cómo pagan" title="Medios de pago" />

      {isLoading && <div className="h-[180px] rounded-[18px] bg-vs-chip animate-pulse" />}
      {isError && (
        <div className="flex h-[180px] items-center justify-center text-[12px] text-vs-warn">
          No se pudieron cargar los medios de pago.
        </div>
      )}
      {!isLoading && !isError && total === 0 && (
        <div className="flex h-[180px] items-center justify-center text-[12px] text-[#8a7f70]">
          Sin cobros en el periodo.
        </div>
      )}

      {!isLoading && !isError && total > 0 && (
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-[140px] w-[140px]">
            <Doughnut data={chartData} options={doughnutOptions()} />
          </div>
          <div className="w-full space-y-2">
            {medios.map((m, i) => {
              const pct = total > 0 ? Math.round((m.monto / total) * 100) : 0
              return (
                <div key={m.medio} className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded"
                    style={{ background: CATEGORICAL[i % CATEGORICAL.length] }}
                  />
                  <span className="flex-1 truncate text-[12px] text-[#4a4438]">{m.medio}</span>
                  <span className="font-mono text-[11.5px] font-semibold">{formatCLP(m.monto)}</span>
                  <span className="w-9 text-right font-mono text-[11px] text-[#8a7f70]">{pct}%</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

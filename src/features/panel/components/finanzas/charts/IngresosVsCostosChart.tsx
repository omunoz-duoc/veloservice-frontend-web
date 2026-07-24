"use client"

import { useMemo } from "react"
import { Line } from "react-chartjs-2"
import type { ChartData } from "chart.js"
import { SectionHeader } from "@/components/common/SectionHeader"
import { useRentabilidad } from "@/features/panel/hooks/useRentabilidad"
import { useProyeccion } from "@/features/panel/hooks/useProyeccion"
import { formatCLP } from "@/lib/format/currency"
import "./registerCharts"
import { VS, lineOptions } from "./chartTheme"

function Legend() {
  return (
    <div className="flex items-center gap-5">
      <span className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: VS.violet }} />
        <span className="text-[12px] font-medium">Ingresos</span>
      </span>
      <span className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: VS.warn }} />
        <span className="text-[12px] font-medium">Costos</span>
      </span>
      <span className="flex items-center gap-2">
        <svg width="16" height="4" aria-hidden="true">
          <line x1="0" y1="2" x2="16" y2="2" stroke={VS.violet} strokeWidth="1.6" strokeDasharray="4 3" />
        </svg>
        <span className="text-[12px] text-[#8a7f70]">Proyección</span>
      </span>
    </div>
  )
}

export function IngresosVsCostosChart() {
  const { data: rent, isLoading, isError } = useRentabilidad()
  const { data: proy } = useProyeccion()

  const historico = useMemo(() => rent?.historico ?? [], [rent])
  const proyectado = proy?.proyectado

  const chartData = useMemo<ChartData<"line">>(() => {
    const labels = [...historico.map(p => p.periodo), ...(proyectado ? ["Proy."] : [])]
    const lastIdx = historico.length - 1
    const lastIngreso = historico[lastIdx]?.ingresos ?? 0

    // Dashed forecast connects the last realized income point to the projection.
    const forecast: (number | null)[] = proyectado
      ? [...historico.map(() => null), proyectado]
      : []
    if (proyectado && lastIdx >= 0) forecast[lastIdx] = lastIngreso

    return {
      labels,
      datasets: [
        {
          label: "Ingresos",
          data: [...historico.map(p => p.ingresos), ...(proyectado ? [null] : [])],
          borderColor: VS.violet,
          backgroundColor: VS.violetSoft,
          borderWidth: 2.2,
          fill: true,
          tension: 0.35,
          pointRadius: 2.5,
          pointHoverRadius: 5,
          pointBackgroundColor: "#fff",
          pointBorderColor: VS.violet,
          pointBorderWidth: 1.6,
        },
        {
          label: "Costos",
          data: [...historico.map(p => p.costos), ...(proyectado ? [null] : [])],
          borderColor: VS.warn,
          backgroundColor: VS.warnSoft,
          borderWidth: 2.2,
          fill: true,
          tension: 0.35,
          pointRadius: 2.5,
          pointHoverRadius: 5,
          pointBackgroundColor: "#fff",
          pointBorderColor: VS.warn,
          pointBorderWidth: 1.6,
        },
        {
          label: "Proyección",
          data: forecast,
          borderColor: VS.violet,
          borderWidth: 1.8,
          borderDash: [5, 4],
          fill: false,
          tension: 0.2,
          pointRadius: 0,
          pointHoverRadius: 4,
        },
      ],
    }
  }, [historico, proyectado])

  return (
    <div className="flex min-w-0 flex-col rounded-[24px] border border-vs-line bg-vs-card p-5">
      <SectionHeader
        overline="Flujo mensual"
        title="Ingresos vs Costos"
        right={proyectado ? (
          <div className="text-right">
            <div className="text-[10.5px] uppercase tracking-widest text-[#a59682]">Proyección mes</div>
            <div className="font-mono text-[15px] font-semibold text-vs-violet">{formatCLP(proyectado)}</div>
          </div>
        ) : undefined}
      />

      <div className="mb-3"><Legend /></div>

      <div className="h-[280px] min-w-0">
        {isLoading && <div className="h-full rounded-[18px] bg-vs-chip animate-pulse" />}
        {isError && (
          <div className="flex h-full items-center justify-center text-[12px] text-vs-warn">
            No se pudo cargar el flujo financiero.
          </div>
        )}
        {!isLoading && !isError && historico.length === 0 && (
          <div className="flex h-full items-center justify-center text-[12px] text-[#8a7f70]">
            Sin datos de flujo para mostrar.
          </div>
        )}
        {!isLoading && !isError && historico.length > 0 && (
          <Line data={chartData} options={lineOptions()} />
        )}
      </div>
    </div>
  )
}

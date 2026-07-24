"use client"

import { useMemo } from "react"
import { Bar } from "react-chartjs-2"
import type { ChartData } from "chart.js"
import { SectionHeader } from "@/components/common/SectionHeader"
import { useTopProductos } from "@/features/panel/hooks/useTopProductos"
import "./registerCharts"
import { VS, horizontalBarOptions } from "./chartTheme"

function truncate(label: string, max = 22) {
  return label.length > max ? label.slice(0, max - 1) + "…" : label
}

export function TopProductosChart() {
  const { data, isLoading, isError } = useTopProductos()

  const productos = useMemo(() => data ?? [], [data])

  const chartData = useMemo<ChartData<"bar">>(() => ({
    labels: productos.map(p => truncate(p.nombre)),
    datasets: [
      {
        label: "Ingresos",
        data: productos.map(p => p.ingresos),
        backgroundColor: VS.violet,
        hoverBackgroundColor: "#5b4cc0",
        borderRadius: 8,
        borderSkipped: false,
        maxBarThickness: 22,
      },
    ],
  }), [productos])

  return (
    <div className="flex min-w-0 flex-col rounded-[24px] border border-vs-line bg-vs-card p-5">
      <SectionHeader overline="Más vendidos" title="Top productos" />

      <div className="h-[260px] min-w-0">
        {isLoading && <div className="h-full rounded-[18px] bg-vs-chip animate-pulse" />}
        {isError && (
          <div className="flex h-full items-center justify-center text-[12px] text-vs-warn">
            No se pudieron cargar los productos.
          </div>
        )}
        {!isLoading && !isError && productos.length === 0 && (
          <div className="flex h-full items-center justify-center text-[12px] text-[#8a7f70]">
            Sin ventas de productos en el periodo.
          </div>
        )}
        {!isLoading && !isError && productos.length > 0 && (
          <Bar data={chartData} options={horizontalBarOptions()} />
        )}
      </div>
    </div>
  )
}

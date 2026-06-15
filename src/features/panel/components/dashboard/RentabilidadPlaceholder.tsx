"use client"

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
  type ChartOptions,
  type TooltipItem,
} from "chart.js"
import { Bar } from "react-chartjs-2"
import { SectionHeader } from "@/components/common/SectionHeader"
import { useRentabilidad } from "@/features/panel/hooks/useRentabilidad"

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

function formatCLP(value: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value)
}

export function RentabilidadPlaceholder() {
  const { data, isLoading, isError } = useRentabilidad()

  const historico = data?.historico ?? []
  const ingresos = data?.ingresos ?? 0
  const costos = data?.costos ?? 0
  const margen = data?.margen ?? 0

  const chartData = {
    labels: historico.map(p => p.periodo),
    datasets: [
      {
        label: "Ingresos",
        data: historico.map(p => p.ingresos),
        backgroundColor: "#111418",
        borderRadius: 6,
      },
      {
        label: "Costos",
        data: historico.map(p => p.costos),
        backgroundColor: "#d9c7a8",
        borderRadius: 6,
      },
    ],
  }

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 10,
          boxHeight: 10,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx: TooltipItem<"bar">) =>
            `${ctx.dataset.label ?? ""}: ${formatCLP(Number(ctx.parsed.y))}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          callback: value => formatCLP(Number(value)),
        },
      },
    },
  }

  return (
    <div className="flex min-w-0 flex-col rounded-[24px] border border-vs-line bg-vs-card p-5">
      <SectionHeader overline="Finanzas" title="Rentabilidad del período" />

      <div className="mb-4 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="min-w-0">
          <div className="text-[10.5px] text-[#8a7f70]">Ingresos</div>
          <div className="truncate font-mono text-[18px] font-semibold">{formatCLP(ingresos)}</div>
        </div>
        <div className="min-w-0">
          <div className="text-[10.5px] text-[#8a7f70]">Costos</div>
          <div className="truncate font-mono text-[18px] font-semibold text-[#8a7f70]">{formatCLP(costos)}</div>
        </div>
        <div className="min-w-0">
          <div className="text-[10.5px] text-[#8a7f70]">Margen</div>
          <div className="truncate font-mono text-[18px] font-semibold text-vs-good">
            {Number(margen).toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="h-[220px] min-w-0">
        {isLoading && <div className="h-full rounded-[18px] bg-vs-chip animate-pulse" />}

        {isError && (
          <div className="h-full flex items-center justify-center text-[12px] text-red-500">
            No se pudo cargar la rentabilidad.
          </div>
        )}

        {!isLoading && !isError && historico.length === 0 && (
          <div className="h-full flex items-center justify-center text-[12px] text-[#8a7f70]">
            Sin datos de rentabilidad para mostrar.
          </div>
        )}

        {!isLoading && !isError && historico.length > 0 && (
          <Bar data={chartData} options={options} />
        )}
      </div>
    </div>
  )
}

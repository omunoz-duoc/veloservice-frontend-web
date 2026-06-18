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
import { Banknote, ReceiptText, TrendingUp, Trophy } from "lucide-react"
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

function formatNumber(value: number) {
  return new Intl.NumberFormat("es-CL", {
    maximumFractionDigits: 0,
  }).format(value)
}

export function RentabilidadPlaceholder() {
  const { data, isLoading, isError } = useRentabilidad()

  const historico = data?.historico ?? []
  const ultimaSemana = historico[historico.length - 1]
  const semanaAnterior = historico[historico.length - 2]
  const semanasConIngresos = historico.filter(p => Number(p.ingresos ?? 0) > 0)
  const ingresosHistorico = historico.reduce((total, semana) => total + Number(semana.ingresos ?? 0), 0)
  const cantidadCobrosHistorico = historico.reduce(
    (total, semana) => total + Number(semana.cantidadCobros ?? 0),
    0
  )
  const ingresosResumen = Number(data?.ingresos ?? 0) > 0 ? Number(data?.ingresos ?? 0) : ingresosHistorico
  const cantidadCobrosResumen =
    Number(data?.cantidadCobros ?? 0) > 0 ? Number(data?.cantidadCobros ?? 0) : cantidadCobrosHistorico
  const promedioSemanal =
    semanasConIngresos.length > 0
      ? semanasConIngresos.reduce((total, semana) => total + Number(semana.ingresos ?? 0), 0) /
        semanasConIngresos.length
      : 0
  const mejorSemana = historico.reduce<(typeof historico)[number] | null>((mejor, semana) => {
    const ingresosSemana = Number(semana.ingresos ?? 0)
    const mejoresIngresos = Number(mejor?.ingresos ?? 0)

    return ingresosSemana > mejoresIngresos ? semana : mejor
  }, null)

  const variacionSemanal =
    ultimaSemana && semanaAnterior && Number(semanaAnterior.ingresos ?? 0) > 0
      ? ((Number(ultimaSemana.ingresos ?? 0) - Number(semanaAnterior.ingresos ?? 0)) /
          Number(semanaAnterior.ingresos ?? 0)) *
        100
      : null

  const variacionTexto =
    variacionSemanal === null
      ? "Sin comparaci\u00f3n disponible"
      : `${variacionSemanal > 0 ? "+" : ""}${variacionSemanal.toFixed(0)}% vs semana anterior`
  const variacionColor =
    variacionSemanal === null
      ? "text-[#8a7f70]"
      : variacionSemanal > 0
        ? "text-[#4f7a5a]"
        : variacionSemanal < 0
          ? "text-[#a65f55]"
          : "text-[#8a7f70]"
  const mejorSemanaTexto =
    mejorSemana && Number(mejorSemana.ingresos ?? 0) > 0
      ? `${mejorSemana.periodo} ${"\u00b7"} ${formatCLP(Number(mejorSemana.ingresos ?? 0))}`
      : "Sin datos"
  const promedioSemanalTexto = formatCLP(promedioSemanal)
  const actividadTexto =
    cantidadCobrosResumen >= 10
      ? "Alta"
      : cantidadCobrosResumen >= 5
        ? "Normal"
        : "Baja"

  const chartData = {
    labels: historico.map(p => p.periodo),
    datasets: [
      {
        label: "Ingresos",
        data: historico.map(p => Number(p.ingresos ?? 0)),
        backgroundColor: historico.map(p => {
          const ingreso = Number(p.ingresos ?? 0)

          if (ingreso === 0) return "#e8dfd2"
          if (promedioSemanal > 0 && ingreso > promedioSemanal) return "#9db79d"

          return "#111418"
        }),
        hoverBackgroundColor: historico.map(p => {
          const ingreso = Number(p.ingresos ?? 0)

          if (ingreso === 0) return "#d9cfc1"
          if (promedioSemanal > 0 && ingreso > promedioSemanal) return "#789574"

          return "#111418"
        }),
        maxBarThickness: 38,
        borderRadius: 10,
        borderSkipped: false,
      },
    ],
  }

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (ctx: TooltipItem<"bar">) =>
            `${ctx.dataset.label ?? ""}: ${formatCLP(Number(ctx.parsed.y))}`,
          afterLabel: (ctx: TooltipItem<"bar">) => {
            const cobros = historico[ctx.dataIndex]?.cantidadCobros ?? 0
            return `Cobros: ${formatNumber(cobros)}`
          },
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
        beginAtZero: true,
        ticks: {
          callback: value => formatCLP(Number(value)),
        },
      },
    },
  }

  return (
    <div className="flex min-w-0 flex-col rounded-[24px] border border-vs-line bg-vs-card p-5">
      <SectionHeader overline="Finanzas" title="Resumen semanal" />

      <div className="mb-4 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="min-w-0 rounded-[14px] border border-vs-line-2 bg-white/70 p-3">
          <div className="flex items-center gap-1.5 text-[10.5px] text-[#8a7f70]">
            <Banknote className="size-3" aria-hidden="true" />
            Ingresos
          </div>
          <div className="truncate font-mono text-[18px] font-semibold">{formatCLP(ingresosResumen)}</div>
        </div>

        <div className="min-w-0 rounded-[14px] border border-vs-line-2 bg-white/70 p-3">
          <div className="flex items-center gap-1.5 text-[10.5px] text-[#8a7f70]">
            <ReceiptText className="size-3" aria-hidden="true" />
            Cobros realizados
          </div>
          <div className="truncate font-mono text-[18px] font-semibold">
            {formatNumber(cantidadCobrosResumen)}
          </div>
        </div>

        <div className="min-w-0 rounded-[14px] border border-vs-line-2 bg-white/70 p-3">
          <div className="flex items-center gap-1.5 text-[10.5px] text-[#8a7f70]">
            <TrendingUp className="size-3" aria-hidden="true" />
            Tendencia
          </div>
          <div className={`truncate text-[13px] font-semibold ${variacionColor}`}>{variacionTexto}</div>
        </div>

        <div className="min-w-0 rounded-[14px] border border-vs-line-2 bg-white/70 p-3">
          <div className="flex items-center gap-1.5 text-[10.5px] text-[#8a7f70]">
            <Trophy className="size-3" aria-hidden="true" />
            Mejor semana
          </div>
          <div className="truncate text-[13px] font-semibold text-vs-ink">{mejorSemanaTexto}</div>
        </div>
      </div>

      <div className="h-[220px] min-w-0">
        {isLoading && <div className="h-full rounded-[18px] bg-vs-chip animate-pulse" />}

        {isError && (
          <div className="h-full flex items-center justify-center text-[12px] text-red-500">
            No se pudo cargar el resumen semanal.
          </div>
        )}

        {!isLoading && !isError && historico.length === 0 && (
          <div className="h-full flex items-center justify-center text-[12px] text-[#8a7f70]">
            Sin datos semanales para mostrar.
          </div>
        )}

        {!isLoading && !isError && historico.length > 0 && (
          <Bar data={chartData} options={options} />
        )}
      </div>

      <div className="mt-3 text-[11px] font-semibold text-[#8a7f70]">
        Promedio semanal: <span className="font-mono text-vs-ink">{promedioSemanalTexto}</span>
        {" \u00b7 "}
        Actividad del taller: <span className="text-vs-ink">{actividadTexto}</span>
      </div>
    </div>
  )
}

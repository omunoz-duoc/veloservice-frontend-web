import type { ChartOptions, ChartType, TooltipItem } from "chart.js"
import { formatCLP, formatCLPCompact } from "@/lib/format/currency"

/** vs-* design tokens as literal hex, for Chart.js (which can't read CSS vars). */
export const VS = {
  ink: "#0f1114",
  muted: "#a59682",
  grid: "#efe9df",
  violet: "#6b5bd1",
  violetSoft: "rgba(107,91,209,0.14)",
  warn: "#c85a2a",
  warnSoft: "rgba(200,90,42,0.12)",
  good: "#2f7d4f",
  info: "#3a6ea5",
  chip: "#f4efe7",
} as const

/** Categorical palette for doughnut / bar series, ordered for good contrast. */
export const CATEGORICAL = [VS.violet, VS.info, VS.good, VS.warn, "#8a7f70", "#c7bba6"] as const

const FONT_FAMILY = '"SFMono-Regular", Consolas, "Liberation Mono", monospace'

/** Tooltip block shared by all finanzas charts: dark card, mono font, CLP values. */
function clpTooltip<T extends ChartType>() {
  return {
    backgroundColor: VS.ink,
    padding: 10,
    cornerRadius: 10,
    titleFont: { family: FONT_FAMILY, size: 11 },
    bodyFont: { family: FONT_FAMILY, size: 12 },
    boxPadding: 4,
    callbacks: {
      label: (ctx: TooltipItem<T>) => {
        const parsed = ctx.parsed as number | { y?: number } | null
        const value =
          typeof parsed === "number" ? parsed : parsed?.y ?? Number(ctx.raw)
        const label = (ctx.dataset as { label?: string }).label ?? ""
        return ` ${label}: ${formatCLP(Number(value))}`.trimStart()
      },
    },
  }
}

/** Base options for the time-series line chart (income vs cost + forecast). */
export function lineOptions(): ChartOptions<"line"> {
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: clpTooltip<"line">(),
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: VS.muted, font: { family: FONT_FAMILY, size: 10 } },
      },
      y: {
        beginAtZero: true,
        border: { display: false },
        grid: { color: VS.grid },
        ticks: {
          color: VS.muted,
          font: { family: FONT_FAMILY, size: 10 },
          callback: value => formatCLPCompact(Number(value)),
        },
      },
    },
  }
}

/** Base options for the horizontal top-products bar chart. */
export function horizontalBarOptions(): ChartOptions<"bar"> {
  return {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: clpTooltip<"bar">(),
    },
    scales: {
      x: {
        beginAtZero: true,
        border: { display: false },
        grid: { color: VS.grid },
        ticks: {
          color: VS.muted,
          font: { family: FONT_FAMILY, size: 10 },
          callback: value => formatCLPCompact(Number(value)),
        },
      },
      y: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: VS.ink, font: { family: FONT_FAMILY, size: 11 } },
      },
    },
  }
}

/** Base options for doughnut charts (composición, medios de pago). */
export function doughnutOptions(): ChartOptions<"doughnut"> {
  return {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "68%",
    plugins: {
      legend: { display: false },
      tooltip: clpTooltip<"doughnut">(),
    },
  }
}

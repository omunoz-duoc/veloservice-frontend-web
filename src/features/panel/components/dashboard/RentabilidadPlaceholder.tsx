"use client"

import { useState } from "react"
import { SectionHeader } from "@/components/common/SectionHeader"
import { RENTAB_DATA } from "@/features/panel/services/dashboard.mock"

const DISPLAY_SCALE = 25 // raw week-units → CLP thousands
const RANGES = ["4s", "8s", "Trim."] as const
type Range = (typeof RANGES)[number]

export function RentabilidadPlaceholder() {
  const [range, setRange] = useState<Range>("8s")

  // All ranges show same data until Chart.js replaces this
  const data = RENTAB_DATA
  const maxV = Math.max(...data.map(d => d.ing))
  const totalIng = data.reduce((a, b) => a + b.ing, 0)
  const totalCost = data.reduce((a, b) => a + b.cost, 0)
  const margin = (((totalIng - totalCost) / totalIng) * 100).toFixed(1)

  return (
    <div className="bg-vs-card border border-vs-line rounded-[24px] p-5 flex flex-col">
      <SectionHeader
        overline="Finanzas"
        title="Rentabilidad del período"
        right={
          <div className="bg-vs-chip p-1 inline-flex rounded-full">
            {RANGES.map(r => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`text-[11px] px-2.5 py-1 rounded-full font-medium transition-colors ${
                  range === r ? "bg-white shadow-sm" : "text-[#8a7f70]"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        }
      />

      {/* Summary metrics */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div>
          <div className="text-[10.5px] text-[#8a7f70]">Ingresos</div>
          <div className="text-[18px] font-semibold font-mono">$ {totalIng * DISPLAY_SCALE}K</div>
        </div>
        <div>
          <div className="text-[10.5px] text-[#8a7f70]">Costos</div>
          <div className="text-[18px] font-semibold font-mono text-[#8a7f70]">$ {totalCost * DISPLAY_SCALE}K</div>
        </div>
        <div>
          <div className="text-[10.5px] text-[#8a7f70]">Margen</div>
          <div className="text-[18px] font-semibold font-mono text-vs-good">{margin}%</div>
        </div>
      </div>

      {/* SVG bar chart — TODO: replace SVG bars with Chart.js */}
      <div className="flex-1 min-h-[180px] flex flex-col">
        <div className="relative flex-1">
          <svg
            viewBox="0 0 320 140"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full"
            style={{ overflow: "visible" }}
          >
            {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
              <line
                key={i}
                x1="0" x2="320"
                y1={140 * p} y2={140 * p}
                stroke="var(--vs-line-2)"
                strokeWidth="1"
                strokeDasharray={i > 0 && i < 4 ? "2 4" : "0"}
              />
            ))}
            {data.map((d, i) => {
              const groupW = 320 / data.length
              const pad = 6
              const barW = (groupW - pad * 2 - 3) / 2
              const x0 = i * groupW + pad
              const hIng = (d.ing / maxV) * 140
              const hCost = (d.cost / maxV) * 140
              return (
                <g key={i}>
                  <rect x={x0} y={140 - hIng} width={barW} height={hIng} rx="3" fill="#111418" />
                  <rect x={x0 + barW + 3} y={140 - hCost} width={barW} height={hCost} rx="3" fill="#d9c7a8" />
                </g>
              )
            })}
          </svg>
        </div>
        <div className="flex gap-2 mt-2">
          {data.map((d, i) => (
            <div key={i} className="flex-1 text-center text-[10px] text-[#8a7f70] font-mono">
              {d.m}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-vs-line-2">
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="w-2.5 h-2.5 rounded-sm bg-vs-ink" /> Ingresos
        </div>
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#d9c7a8]" /> Costos
        </div>
        <div className="ml-auto text-[11px] text-vs-good font-semibold">
          ↗ +12.4% vs período anterior
        </div>
      </div>
    </div>
  )
}

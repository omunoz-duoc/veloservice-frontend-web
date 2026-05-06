"use client"

import { ArrowUpRight } from "lucide-react"
import { SectionHeader } from "@/components/common/SectionHeader"
import { usePipelineSummary } from "@/features/panel/hooks/usePipelineSummary"

const DISPLAY_CAP = 3

export function PipelinePlaceholder() {
  const { data: columns = [], isLoading } = usePipelineSummary()

  if (isLoading) {
    return (
      <div className="bg-vs-card border border-vs-line rounded-[24px] p-5 h-full animate-pulse min-h-[360px]" />
    )
  }

  return (
    <div className="bg-vs-card border border-vs-line rounded-[24px] p-5 h-full flex flex-col">
      <SectionHeader
        overline="Flujo operativo"
        title="Pipeline de órdenes"
        right={
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#a59682] bg-vs-chip px-3 py-1 rounded-full">
              Kanban interactivo próximamente
            </span>
            <button className="bg-vs-chip text-vs-ink px-3.5 py-2 rounded-full text-[12px] font-medium hover:bg-[#ebe3d6] transition-colors flex items-center gap-1.5">
              Ver tablero <ArrowUpRight size={13} />
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-4 gap-3 flex-1 min-h-0">
        {columns.map(col => (
          <div
            key={col.key}
            className="rounded-[20px] p-2.5 flex flex-col min-h-0"
            style={{ background: "#faf6f0", border: "1px solid var(--vs-line-2)" }}
          >
            {/* Column header */}
            <div className="flex items-center justify-between mb-2 px-1">
              <div className="flex items-center gap-1.5">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: col.color }}
                />
                <span className="text-[12px] font-semibold">{col.label}</span>
              </div>
              <span
                className="text-[11px] font-mono font-semibold px-1.5 py-0.5 rounded-md"
                style={{
                  background: col.color + "22",
                  color: col.color,
                }}
              >
                {String(col.count).padStart(2, "0")}
              </span>
            </div>

            {/* Cards */}
            <div className="flex flex-col gap-1.5 overflow-hidden">
              {col.items.slice(0, DISPLAY_CAP).map(item => (
                <div
                  key={item.ot}
                  className="rounded-[14px] bg-white border border-vs-line-2 p-2"
                >
                  <div className="text-[10.5px] font-mono font-semibold text-[#4a4438]">
                    {item.ot}
                  </div>
                  <div className="text-[10px] text-[#8a7f70] truncate">{item.tipo}</div>
                  <div className="text-[11.5px] font-medium leading-tight truncate">
                    {item.modelo}
                  </div>
                  <div className="text-[10.5px] text-[#8a7f70] truncate">{item.cliente}</div>
                  {item.pct !== undefined && (
                    <div className="mt-1.5 h-1 rounded-full bg-vs-line-2 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${item.pct * 100}%`, background: col.color }}
                      />
                    </div>
                  )}
                </div>
              ))}
              {col.count > DISPLAY_CAP && (
                <div className="text-[10px] text-center text-[#a59682] py-1">
                  +{col.count - DISPLAY_CAP} más
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

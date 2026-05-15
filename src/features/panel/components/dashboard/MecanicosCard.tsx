"use client"

import { Route } from "lucide-react"
import { SectionHeader } from "@/components/common/SectionHeader"
import { StatusBadge } from "@/components/common/StatusBadge"
import { useMecanicosActivos } from "@/features/panel/hooks/useMecanicosActivos"
import type { Mecanico } from "@/features/panel/types/mecanicos.types"

const ESTADO_TONE: Record<Mecanico["estado"], "good" | "warn" | "muted"> = {
  activo:   "good",
  saturado: "warn",
  pausa:    "muted",
}

export function MecanicosCard() {
  const { data, isLoading } = useMecanicosActivos()
  const mecanicos = data?.mecanicos ?? []

  if (isLoading) {
    return (
      <div className="bg-vs-card border border-vs-line rounded-[24px] p-5 animate-pulse min-h-[200px]" />
    )
  }

  const totalOTs = mecanicos.reduce((sum, m) => sum + m.ordenesCursando.length, 0)

  return (
    <div className="bg-vs-card border border-vs-line rounded-[24px] p-5">
      <SectionHeader
        overline="Equipo en turno"
        title="Mecánicos activos"
        right={
          <div className="flex items-center gap-3">
            <div className="text-[11.5px] text-[#8a7f70]">
              <span className="font-mono font-semibold text-vs-ink">{mecanicos.length}</span>
              {" en turno · "}
              <span className="font-mono font-semibold text-vs-ink">{totalOTs}</span>
              {" OTs en curso"}
            </div>
            <button className="bg-vs-chip text-vs-ink px-3.5 py-2 rounded-full text-[12px] font-medium hover:bg-[#ebe3d6] transition-colors flex items-center gap-1.5 hidden">
              Reasignar <Route size={13} />
            </button>
          </div>
        }
      />

      <div className="flex flex-col gap-2">
        {mecanicos.map(m => {
          const pct = m.ordenesCursando.length / m.capacidad
          return (
            <div
              key={m.id}
              className="flex items-center gap-4 rounded-[16px] border border-vs-line-2 px-4 py-3 bg-[#faf6f0] hover:bg-white transition-colors"
            >
              {/* Avatar */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[13px] font-semibold shrink-0 relative"
                style={{ background: m.color }}
              >
                {m.iniciales}
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#faf6f0] bg-vs-good" />
              </div>

              {/* Name + specialty */}
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-semibold leading-tight truncate">
                  {m.nombre} {m.apellido}
                </div>
                <div className="text-[11px] text-[#8a7f70] truncate">{m.especialidad}</div>
              </div>

              {/* Progress bar + OT count */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-20 h-1.5 rounded-full bg-vs-line-2 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct * 100}%`, background: m.color }}
                  />
                </div>
                <span className="text-[12px] font-mono font-semibold text-vs-ink w-8 text-right">
                  {m.ordenesCursando.length}/{m.capacidad}
                </span>
              </div>

              {/* Bahia + horas */}
              <div className="text-right shrink-0">
                <div className="text-[11px] font-mono font-semibold">{m.bahia}</div>
                <div className="text-[10px] text-[#a59682]">{m.horas}</div>
              </div>

              {/* Status */}
              <StatusBadge label={m.estado} tone={ESTADO_TONE[m.estado]} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

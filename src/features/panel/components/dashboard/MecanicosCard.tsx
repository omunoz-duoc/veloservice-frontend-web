"use client"

import { Route } from "lucide-react"
import { SectionHeader } from "@/components/common/SectionHeader"
import { StatusBadge } from "@/components/common/StatusBadge"
import { useMecanicosActivos } from "@/features/panel/hooks/useMecanicosActivos"
import type { MecanicoActivo } from "@/features/panel/services/dashboard.mock"

const ESTADO_TONE: Record<MecanicoActivo["estado"], "good" | "warn" | "muted"> = {
  activo:   "good",
  saturado: "warn",
  pausa:    "muted",
}

export function MecanicosCard() {
  const { data: mecanicos = [], isLoading } = useMecanicosActivos()

  if (isLoading) {
    return (
      <div className="bg-vs-card border border-vs-line rounded-[24px] p-5 animate-pulse min-h-[200px]" />
    )
  }

  const totalOTs = mecanicos.reduce((sum, m) => sum + m.otsCursando.length, 0)

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
            <button className="bg-vs-chip text-vs-ink px-3.5 py-2 rounded-full text-[12px] font-medium hover:bg-[#ebe3d6] transition-colors flex items-center gap-1.5">
              Reasignar <Route size={13} />
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-3 gap-3">
        {mecanicos.map(m => {
          const pct = m.otsCursando.length / m.capacidad
          return (
            <div
              key={m.id}
              className="rounded-[20px] border border-vs-line-2 p-4 bg-[#faf6f0] hover:bg-white transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-white text-[14px] font-semibold relative shrink-0"
                  style={{ background: m.color }}
                >
                  {m.iniciales}
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#faf6f0] bg-vs-good" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-semibold truncate leading-tight">
                    {m.nombre}
                  </div>
                  <div className="text-[11px] text-[#8a7f70] truncate">{m.especialidad}</div>
                </div>
                <StatusBadge label={m.estado} tone={ESTADO_TONE[m.estado]} />
              </div>

              <div className="flex items-end justify-between mb-2">
                <div>
                  <div className="text-[10.5px] text-[#8a7f70]">OTs en curso</div>
                  <div className="text-[26px] font-semibold font-mono leading-none">
                    {m.otsCursando.length}
                    <span className="text-[13px] text-[#a59682]">/{m.capacidad}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-[#8a7f70]">Bahía · Horas</div>
                  <div className="text-[11px] font-mono font-semibold">
                    {m.bahia} · {m.horas}
                  </div>
                </div>
              </div>

              <div className="h-1.5 rounded-full bg-vs-line-2 overflow-hidden mb-3">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${pct * 100}%`, background: m.color }}
                />
              </div>

              <div className="flex flex-wrap gap-1">
                {m.otsCursando.map(ot => (
                  <span
                    key={ot}
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-white border border-vs-line-2 text-[#4a4438]"
                  >
                    {ot}
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

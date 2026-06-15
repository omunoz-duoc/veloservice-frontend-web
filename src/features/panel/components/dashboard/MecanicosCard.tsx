"use client"

import { SectionHeader } from "@/components/common/SectionHeader"
import { useMecanicosActivos } from "@/features/panel/hooks/useMecanicosActivos"
import type { Mecanico } from "@/features/panel/types/mecanicos.types"

type MecanicoActivoResumen = Partial<Mecanico> & {
  ordenes_activas?: number
  ordenesActivas?: number
  otsCursando?: unknown[]
  otAsignadas?: number
}

function nombreMecanico(mecanico: MecanicoActivoResumen) {
  return [mecanico.nombre, mecanico.apellido].filter(Boolean).join(" ") || "Sin nombre"
}

function inicialesMecanico(mecanico: MecanicoActivoResumen) {
  return nombreMecanico(mecanico)
    .split(/\s+/)
    .map(part => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

function ordenesActivas(mecanico: MecanicoActivoResumen) {
  if (typeof mecanico.ordenes_activas === "number") return mecanico.ordenes_activas
  if (typeof mecanico.ordenesActivas === "number") return mecanico.ordenesActivas
  if (typeof mecanico.otAsignadas === "number") return mecanico.otAsignadas
  if (Array.isArray(mecanico.ordenesCursando)) return mecanico.ordenesCursando.length
  if (Array.isArray(mecanico.otsCursando)) return mecanico.otsCursando.length
  return 0
}

function textoOrdenesActivas(cantidad: number) {
  return cantidad === 1 ? "1 orden activa" : `${cantidad} ordenes activas`
}

export function MecanicosCard() {
  const { data, isLoading } = useMecanicosActivos()
  const mecanicos: MecanicoActivoResumen[] = Array.isArray(data) ? data : data?.mecanicos ?? []

  if (isLoading) {
    return (
      <div className="min-h-[200px] min-w-0 animate-pulse rounded-[24px] border border-vs-line bg-vs-card p-5" />
    )
  }

  const totalOTs = mecanicos.reduce((sum, m) => sum + ordenesActivas(m), 0)

  return (
    <div className="min-w-0 rounded-[24px] border border-vs-line bg-vs-card p-5">
      <SectionHeader
        overline="Equipo en turno"
        title="Mecanicos activos"
        right={
          <div className="flex items-center gap-3">
            <div className="text-[11.5px] text-[#8a7f70]">
              <span className="font-mono font-semibold text-vs-ink">{mecanicos.length}</span>
              {" en turno · "}
              <span className="font-mono font-semibold text-vs-ink">{totalOTs}</span>
              {" OTs en curso"}
            </div>
          </div>
        }
      />

      <div className="flex flex-col gap-2">
        {mecanicos.map(m => (
          <div
            key={m.id}
            className="flex items-center gap-3 rounded-[16px] border border-vs-line-2 px-4 py-3 bg-[#faf6f0] hover:bg-white transition-colors"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-semibold shrink-0"
              style={{ background: m.color ?? "#6b5bd1" }}
            >
              {inicialesMecanico(m)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-semibold leading-tight truncate">
                {nombreMecanico(m)}
              </div>
              <div className="text-[11px] text-[#8a7f70] truncate">
                {textoOrdenesActivas(ordenesActivas(m))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

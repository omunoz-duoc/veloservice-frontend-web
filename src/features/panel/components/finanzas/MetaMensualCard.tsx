"use client"

import { TrendingDown, TrendingUp } from "lucide-react"
import { SectionHeader } from "@/components/common/SectionHeader"
import { useProyeccion } from "@/features/panel/hooks/useProyeccion"
import { useRentabilidad } from "@/features/panel/hooks/useRentabilidad"
import { formatCLP } from "@/lib/format/currency"
import { VS } from "./charts/chartTheme"

export function MetaMensualCard() {
  const { data: proy, isLoading, isError } = useProyeccion()
  const { data: rent } = useRentabilidad()

  const historico = rent?.historico ?? []
  const ultimo = historico[historico.length - 1]?.ingresos ?? 0
  const anterior = historico[historico.length - 2]?.ingresos ?? 0
  const mom = anterior > 0 ? ((ultimo - anterior) / anterior) * 100 : null

  const meta = proy?.metaMensual ?? 0
  const proyectado = proy?.proyectado ?? 0
  const progreso = meta > 0 ? Math.min(proyectado / meta, 1) : 0
  const alcanzaMeta = proyectado >= meta

  return (
    <div className="flex min-w-0 flex-col rounded-[24px] border border-vs-line bg-vs-card p-5">
      <SectionHeader overline="Hacia dónde vamos" title="Meta mensual" />

      {isLoading && <div className="h-[180px] rounded-[18px] bg-vs-chip animate-pulse" />}
      {isError && (
        <div className="flex h-[180px] items-center justify-center text-[12px] text-vs-warn">
          No se pudo cargar la proyección.
        </div>
      )}

      {!isLoading && !isError && (
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex items-end justify-between">
              <span className="font-mono text-[24px] font-bold leading-none">{formatCLP(proyectado)}</span>
              {mom !== null && (
                <span
                  className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
                  style={{
                    background: mom >= 0 ? VS.violetSoft : VS.warnSoft,
                    color: mom >= 0 ? VS.good : VS.warn,
                  }}
                >
                  {mom >= 0 ? <TrendingUp size={11} strokeWidth={2} /> : <TrendingDown size={11} strokeWidth={2} />}
                  {mom >= 0 ? "+" : ""}{mom.toFixed(1)}% MoM
                </span>
              )}
            </div>
            <div className="mt-1 text-[11px] text-[#8a7f70]">
              Proyección de cierre · Meta <span className="font-mono text-vs-ink">{formatCLP(meta)}</span>
            </div>
          </div>

          <div>
            <div className="h-2.5 overflow-hidden rounded-full bg-vs-line-2">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${progreso * 100}%`, background: alcanzaMeta ? VS.good : VS.violet }}
              />
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[11px]">
              <span className="font-mono font-semibold" style={{ color: alcanzaMeta ? VS.good : VS.violet }}>
                {Math.round(progreso * 100)}% de la meta
              </span>
              <span className="text-[#8a7f70]">
                {alcanzaMeta ? "Meta alcanzada" : `Faltan ${formatCLP(Math.max(meta - proyectado, 0))}`}
              </span>
            </div>
          </div>

          {proy && proy.puntos.length > 0 && (
            <div className="space-y-1.5 border-t border-vs-line-2 pt-3">
              {proy.puntos.map(pt => (
                <div key={pt.periodo} className="flex items-center justify-between text-[11.5px]">
                  <span className="flex items-center gap-1.5 text-[#4a4438]">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: pt.esProyeccion ? VS.muted : VS.violet }}
                    />
                    {pt.periodo}
                    {pt.esProyeccion && <span className="text-[10px] text-[#a59682]">(proy.)</span>}
                  </span>
                  <span className="font-mono text-[#4a4438]">{formatCLP(pt.valor)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

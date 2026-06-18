"use client"

import { useState, useMemo } from "react"
import { Search, Download, Eye, Ban, CheckCircle } from "lucide-react"
import { PageHeader } from "@/components/common/PageHeader"
import { useAdminTallerById, useAdminTalleres, useUpdateTallerEstado } from "@/features/admin/hooks/useAdmin"
import { StatusBadge } from "@/components/common/StatusBadge"
import { TallerDetailSheet } from "./TallerDetailSheet"
import type { TallerAdmin, EstadoTaller } from "@/features/admin/services/admin.types"
import { cn } from "@/lib/utils"

const PLAN_OPTIONS = ["todos", "starter", "pro", "enterprise"] as const
const ESTADO_OPTIONS = ["todos", "activo", "trial", "suspendido", "inactivo", "pendiente"] as const

function formatNullableDate(value: string | null) {
  if (!value) return "Sin renovación"
  return new Date(value).toLocaleDateString("es-CL", { day: "numeric", month: "short", year: "numeric" })
}

function estadoTone(estado: EstadoTaller) {
  switch (estado) {
    case "activo": return "good" as const
    case "trial": return "info" as const
    case "pendiente": return "amber" as const
    case "suspendido": return "warn" as const
    case "inactivo": return "muted" as const
    default: return "muted" as const
  }
}

function estadoLabel(estado: EstadoTaller) {
  const map: Record<string, string> = { activo: "Activo", inactivo: "Inactivo", pendiente: "Pendiente", suspendido: "Suspendido", trial: "Trial" }
  return map[estado] ?? estado
}

export function TalleresPage() {
  const { data: talleres, isLoading } = useAdminTalleres()
  const updateEstado = useUpdateTallerEstado()

  const [search, setSearch] = useState("")
  const [planFilter, setPlanFilter] = useState<(typeof PLAN_OPTIONS)[number]>("todos")
  const [estadoFilter, setEstadoFilter] = useState<(typeof ESTADO_OPTIONS)[number]>("todos")
  const [selectedTaller, setSelectedTaller] = useState<TallerAdmin | null>(null)
  const { data: selectedTallerDetalle, isFetching: isFetchingDetalle } = useAdminTallerById(selectedTaller?.id ?? "")

  const filtered = useMemo(() => {
    if (!talleres) return []
    return talleres.filter((t) => {
      const matchSearch =
        t.nombre.toLowerCase().includes(search.toLowerCase()) ||
        t.rut.toLowerCase().includes(search.toLowerCase())
      const matchPlan = planFilter === "todos" || t.plan === planFilter
      const matchEstado = estadoFilter === "todos" || t.estado === estadoFilter
      return matchSearch && matchPlan && matchEstado
    })
  }, [talleres, search, planFilter, estadoFilter])

  const ACTIONS = (
    <>
      <button className="bg-vs-chip text-vs-ink px-4 py-2 rounded-full text-[13px] font-medium hover:bg-[#ebe3d6] transition-colors flex items-center gap-1.5">
        <Download size={14} />
        Exportar
      </button>
    </>
  )

  return (
    <div>
      <PageHeader
        breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Talleres" }]}
        title="Gestión de Talleres"
        subtitle={`${filtered.length} talleres registrados`}
        actions={ACTIONS}
      />

      {/* Filters */}
      <div className="bg-vs-card border border-vs-line rounded-[24px] p-4 mb-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 max-w-md bg-vs-bg border border-vs-line rounded-[20px] flex items-center gap-3 px-4 py-2">
          <Search size={16} className="text-[#a59682] shrink-0" />
          <input
            placeholder="Buscar por nombre o RUT…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none flex-1 text-sm placeholder:text-[#a59682]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {PLAN_OPTIONS.map((p) => (
            <button
              key={p}
              onClick={() => setPlanFilter(p)}
              className={cn(
                "px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors capitalize whitespace-nowrap",
                planFilter === p
                  ? "bg-vs-ink text-white"
                  : "bg-vs-chip text-[#4a4438] hover:bg-[#ece7e0]"
              )}
            >
              {p === "todos" ? "Todos los planes" : p}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {ESTADO_OPTIONS.map((e) => (
            <button
              key={e}
              onClick={() => setEstadoFilter(e)}
              className={cn(
                "px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors capitalize whitespace-nowrap",
                estadoFilter === e
                  ? "bg-vs-ink text-white"
                  : "bg-vs-chip text-[#4a4438] hover:bg-[#ece7e0]"
              )}
            >
              {e === "todos" ? "Todos" : estadoLabel(e as EstadoTaller)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-vs-card border border-vs-line rounded-[24px] overflow-hidden">
        {isLoading ? (
          <div className="text-[13px] text-[#8a7f70] py-12 text-center">Cargando talleres…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="text-[11px] text-[#8a7f70] uppercase tracking-wide border-b border-vs-line bg-[#f7f3eb]">
                  <th className="text-left font-medium py-3 px-4">Taller</th>
                  <th className="text-left font-medium py-3 px-4">Plan</th>
                  <th className="text-left font-medium py-3 px-4">Estado</th>
                  <th className="text-right font-medium py-3 px-4">Usuarios</th>
                  <th className="text-right font-medium py-3 px-4">OTs Mes</th>
                  <th className="text-left font-medium py-3 px-4">Renovación</th>
                  <th className="text-right font-medium py-3 px-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr
                    key={t.id}
                    className="border-b border-vs-line/60 last:border-b-0 hover:bg-vs-chip/40 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="font-medium text-vs-ink">{t.nombre}</div>
                      <div className="text-[11px] text-[#8a7f70]">{t.rut}</div>
                    </td>
                    <td className="py-3 px-4 capitalize font-medium text-vs-ink">{t.plan}</td>
                    <td className="py-3 px-4">
                      <StatusBadge label={estadoLabel(t.estado)} tone={estadoTone(t.estado)} />
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-vs-ink">{t.cantidadUsuarios}</td>
                    <td className="py-3 px-4 text-right font-mono text-vs-ink">{t.cantidadOTsMes}</td>
                    <td className="py-3 px-4 text-[12px] text-[#8a7f70]">
                      {formatNullableDate(t.fechaRenovacion)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedTaller(t)}
                          className="w-8 h-8 rounded-full bg-vs-chip flex items-center justify-center text-[#4a4438] hover:bg-[#ece7e0] transition-colors"
                          title="Ver detalle"
                        >
                          <Eye size={14} />
                        </button>
                        {t.estado === "activo" || t.estado === "trial" ? (
                          <button
                            onClick={() => updateEstado.mutate({ id: t.id, estado: "suspendido" })}
                            className="w-8 h-8 rounded-full bg-vs-warn-bg flex items-center justify-center text-vs-warn hover:bg-[#f5d5c4] transition-colors"
                            title="Suspender"
                          >
                            <Ban size={14} />
                          </button>
                        ) : (
                          <button
                            onClick={() => updateEstado.mutate({ id: t.id, estado: "activo" })}
                            className="w-8 h-8 rounded-full bg-vs-good-bg flex items-center justify-center text-vs-good hover:bg-[#d0e6d6] transition-colors"
                            title="Activar"
                          >
                            <CheckCircle size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[13px] text-[#8a7f70]">
                      No se encontraron talleres con los filtros seleccionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedTaller && (
        <TallerDetailSheet
          taller={selectedTallerDetalle ?? selectedTaller}
          isLoadingDetalle={isFetchingDetalle}
          onClose={() => setSelectedTaller(null)}
        />
      )}
    </div>
  )
}

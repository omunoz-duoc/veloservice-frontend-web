"use client"

import { useState } from "react"
import { CreditCard, Pencil, Save, X } from "lucide-react"
import { PageHeader } from "@/components/common/PageHeader"
import { useAdminSuscripciones, useUpdateSuscripcion } from "@/features/admin/hooks/useAdmin"
import { StatusBadge } from "@/components/common/StatusBadge"
import type { SuscripcionTaller, PlanSaaS, EstadoSuscripcion } from "@/features/admin/services/admin.types"
import { cn } from "@/lib/utils"

function estadoTone(estado: EstadoSuscripcion) {
  switch (estado) {
    case "activa": return "good" as const
    case "trial": return "info" as const
    case "vencida": return "warn" as const
    case "cancelada": return "muted" as const
    default: return "muted" as const
  }
}

function estadoLabel(estado: EstadoSuscripcion) {
  const map: Record<string, string> = { activa: "Activa", trial: "Trial", vencida: "Vencida", cancelada: "Cancelada" }
  return map[estado] ?? estado
}

export function SubscriptionsPage() {
  const { data: suscripciones, isLoading } = useAdminSuscripciones()
  const updateSuscripcion = useUpdateSuscripcion()

  const [editing, setEditing] = useState<SuscripcionTaller | null>(null)
  const [planEdit, setPlanEdit] = useState<PlanSaaS>("starter")
  const [precioEdit, setPrecioEdit] = useState<number>(14990)
  const [renovacionEdit, setRenovacionEdit] = useState("")
  const [estadoEdit, setEstadoEdit] = useState<EstadoSuscripcion>("activa")

  function startEdit(s: SuscripcionTaller) {
    setEditing(s)
    setPlanEdit(s.plan)
    setPrecioEdit(s.precioMensual)
    setRenovacionEdit(s.fechaRenovacion)
    setEstadoEdit(s.estado)
  }

  function saveEdit() {
    if (!editing) return
    updateSuscripcion.mutate({
      tallerId: editing.tallerId,
      data: { plan: planEdit, precioMensual: precioEdit, fechaRenovacion: renovacionEdit, estado: estadoEdit },
    })
    setEditing(null)
  }

  const ACTIONS = (
    <button className="bg-vs-chip text-vs-ink px-4 py-2 rounded-full text-[13px] font-medium hover:bg-[#ebe3d6] transition-colors flex items-center gap-1.5">
      <CreditCard size={14} />
      Nuevo plan
    </button>
  )

  return (
    <div>
      <PageHeader
        breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Suscripciones" }]}
        title="Suscripciones SaaS"
        subtitle={`${suscripciones?.length ?? 0} suscripciones activas`}
        actions={ACTIONS}
      />

      <div className="bg-vs-card border border-vs-line rounded-[24px] overflow-hidden">
        {isLoading ? (
          <div className="text-[13px] text-[#8a7f70] py-12 text-center">Cargando suscripciones…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="text-[11px] text-[#8a7f70] uppercase tracking-wide border-b border-vs-line bg-[#f7f3eb]">
                  <th className="text-left font-medium py-3 px-4">Taller</th>
                  <th className="text-left font-medium py-3 px-4">Plan</th>
                  <th className="text-right font-medium py-3 px-4">Precio/mes</th>
                  <th className="text-left font-medium py-3 px-4">Estado</th>
                  <th className="text-left font-medium py-3 px-4">Renovación</th>
                  <th className="text-right font-medium py-3 px-4">Días rest.</th>
                  <th className="text-right font-medium py-3 px-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {suscripciones?.map((s) => (
                  <tr key={s.tallerId} className="border-b border-vs-line/60 last:border-b-0 hover:bg-vs-chip/40 transition-colors">
                    <td className="py-3 px-4 font-medium text-vs-ink">{s.tallerNombre}</td>
                    <td className="py-3 px-4 capitalize">{s.plan}</td>
                    <td className="py-3 px-4 text-right font-mono text-vs-ink">
                      ${s.precioMensual.toLocaleString("es-CL")}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge label={estadoLabel(s.estado)} tone={estadoTone(s.estado)} />
                    </td>
                    <td className="py-3 px-4 text-[12px] text-[#8a7f70]">
                      {new Date(s.fechaRenovacion).toLocaleDateString("es-CL", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={cn(
                          "font-mono text-vs-ink",
                          s.diasRestantes < 0 && "text-vs-warn",
                          s.diasRestantes >= 0 && s.diasRestantes <= 30 && "text-vs-warn"
                        )}
                      >
                        {s.diasRestantes}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => startEdit(s)}
                          className="w-8 h-8 rounded-full bg-vs-chip flex items-center justify-center text-[#4a4438] hover:bg-[#ece7e0] transition-colors"
                          title="Editar suscripción"
                        >
                          <Pencil size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {(!suscripciones || suscripciones.length === 0) && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[13px] text-[#8a7f70]">
                      No hay suscripciones registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-vs-card border border-vs-line rounded-2xl shadow-xl w-full max-w-md p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[15px] font-semibold text-[#2b2f36]">Editar suscripción</h2>
              <button onClick={() => setEditing(null)} className="w-8 h-8 rounded-full bg-vs-chip flex items-center justify-center hover:bg-[#ece7e0]">
                <X size={16} />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-[12px] font-medium text-[#8a7f70] mb-1 block">Taller</label>
                <div className="text-[13px] font-medium text-vs-ink">{editing.tallerNombre}</div>
              </div>

              <div>
                <label className="text-[12px] font-medium text-[#8a7f70] mb-1 block">Plan</label>
                <select
                  value={planEdit}
                  onChange={(e) => setPlanEdit(e.target.value as PlanSaaS)}
                  className="w-full bg-vs-bg border border-vs-line rounded-xl px-3 py-2 text-[13px] outline-none focus:ring-2 focus:ring-vs-violet"
                >
                  <option value="starter">Starter</option>
                  <option value="pro">Pro</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>

              <div>
                <label className="text-[12px] font-medium text-[#8a7f70] mb-1 block">Precio mensual (CLP)</label>
                <input
                  type="number"
                  value={precioEdit}
                  onChange={(e) => setPrecioEdit(Number(e.target.value))}
                  className="w-full bg-vs-bg border border-vs-line rounded-xl px-3 py-2 text-[13px] outline-none focus:ring-2 focus:ring-vs-violet"
                />
              </div>

              <div>
                <label className="text-[12px] font-medium text-[#8a7f70] mb-1 block">Fecha de renovación</label>
                <input
                  type="date"
                  value={renovacionEdit}
                  onChange={(e) => setRenovacionEdit(e.target.value)}
                  className="w-full bg-vs-bg border border-vs-line rounded-xl px-3 py-2 text-[13px] outline-none focus:ring-2 focus:ring-vs-violet"
                />
              </div>

              <div>
                <label className="text-[12px] font-medium text-[#8a7f70] mb-1 block">Estado</label>
                <select
                  value={estadoEdit}
                  onChange={(e) => setEstadoEdit(e.target.value as EstadoSuscripcion)}
                  className="w-full bg-vs-bg border border-vs-line rounded-xl px-3 py-2 text-[13px] outline-none focus:ring-2 focus:ring-vs-violet"
                >
                  <option value="activa">Activa</option>
                  <option value="trial">Trial</option>
                  <option value="vencida">Vencida</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 justify-end mt-2">
              <button
                onClick={() => setEditing(null)}
                className="px-4 py-2 text-sm rounded-xl border border-vs-line text-[#2b2f36] hover:bg-vs-chip transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={saveEdit}
                className="px-4 py-2 text-sm rounded-xl bg-vs-ink text-white hover:bg-[#1e2228] transition-colors flex items-center gap-1.5"
              >
                <Save size={14} />
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

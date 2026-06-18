"use client"

import { useMemo, useState } from "react"
import type { FormEvent, ReactNode } from "react"
import { Search, Download, Eye, Ban, CheckCircle, Plus, X } from "lucide-react"
import { PageHeader } from "@/components/common/PageHeader"
import {
  useAdminPlanes,
  useAdminTallerById,
  useAdminTalleres,
  useCreateTaller,
  useUpdateTallerEstado,
} from "@/features/admin/hooks/useAdmin"
import { StatusBadge } from "@/components/common/StatusBadge"
import { TallerDetailSheet } from "./TallerDetailSheet"
import type { CrearTallerInput, EstadoTaller, PlanSaasAdmin, TallerAdmin } from "@/features/admin/services/admin.types"
import { cn } from "@/lib/utils"

const PLAN_OPTIONS = ["todos", "starter", "pro", "enterprise"] as const
const ESTADO_OPTIONS = ["todos", "activo", "trial", "suspendido", "inactivo", "pendiente"] as const

const EMPTY_FORM: CrearTallerInput = {
  nombre: "",
  rut: "",
  telefono: "",
  email: "",
  planId: "",
  activo: true,
}

function formatNullableDate(value: string | null) {
  if (!value) return "Sin renovacion"
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
  const { data: planes, isLoading: planesLoading } = useAdminPlanes()
  const createTaller = useCreateTaller()
  const updateEstado = useUpdateTallerEstado()

  const [search, setSearch] = useState("")
  const [planFilter, setPlanFilter] = useState<(typeof PLAN_OPTIONS)[number]>("todos")
  const [estadoFilter, setEstadoFilter] = useState<(typeof ESTADO_OPTIONS)[number]>("todos")
  const [selectedTaller, setSelectedTaller] = useState<TallerAdmin | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [form, setForm] = useState<CrearTallerInput>(EMPTY_FORM)
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

  const openCreateModal = () => {
    setForm({ ...EMPTY_FORM, planId: planes?.[0]?.id ?? "" })
    setIsCreateOpen(true)
  }

  const closeCreateModal = () => {
    setIsCreateOpen(false)
    setForm(EMPTY_FORM)
    createTaller.reset()
  }

  const submitCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    createTaller.mutate(
      {
        ...form,
        telefono: form.telefono || null,
        email: form.email || null,
      },
      {
        onSuccess: () => closeCreateModal(),
      },
    )
  }

  const toggleEstado = (taller: TallerAdmin) => {
    const nextActivo = !taller.activo
    const action = nextActivo ? "activar" : "suspender"
    const confirmed = window.confirm(`Confirmas ${action} el taller ${taller.nombre}?`)
    if (!confirmed) return
    updateEstado.mutate({ id: taller.id, activo: nextActivo })
  }

  const ACTIONS = (
    <>
      <button
        onClick={openCreateModal}
        className="bg-vs-ink text-white px-4 py-2 rounded-full text-[13px] font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5"
      >
        <Plus size={14} />
        Nuevo taller
      </button>
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
        title="Gestion de Talleres"
        subtitle={`${filtered.length} talleres registrados`}
        actions={ACTIONS}
      />

      <div className="bg-vs-card border border-vs-line rounded-[24px] p-4 mb-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 max-w-md bg-vs-bg border border-vs-line rounded-[20px] flex items-center gap-3 px-4 py-2">
          <Search size={16} className="text-[#a59682] shrink-0" />
          <input
            placeholder="Buscar por nombre o RUT..."
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
                  : "bg-vs-chip text-[#4a4438] hover:bg-[#ece7e0]",
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
                  : "bg-vs-chip text-[#4a4438] hover:bg-[#ece7e0]",
              )}
            >
              {e === "todos" ? "Todos" : estadoLabel(e as EstadoTaller)}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-vs-card border border-vs-line rounded-[24px] overflow-hidden">
        {isLoading ? (
          <div className="text-[13px] text-[#8a7f70] py-12 text-center">Cargando talleres...</div>
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
                  <th className="text-left font-medium py-3 px-4">Renovacion</th>
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
                        <button
                          onClick={() => toggleEstado(t)}
                          disabled={updateEstado.isPending}
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center transition-colors disabled:opacity-50",
                            t.activo
                              ? "bg-vs-warn-bg text-vs-warn hover:bg-[#f5d5c4]"
                              : "bg-vs-good-bg text-vs-good hover:bg-[#d0e6d6]",
                          )}
                          title={t.activo ? "Suspender" : "Activar"}
                        >
                          {t.activo ? <Ban size={14} /> : <CheckCircle size={14} />}
                        </button>
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

      {isCreateOpen && (
        <CreateTallerModal
          form={form}
          planes={planes ?? []}
          planesLoading={planesLoading}
          isSubmitting={createTaller.isPending}
          error={createTaller.error}
          onChange={setForm}
          onClose={closeCreateModal}
          onSubmit={submitCreate}
        />
      )}
    </div>
  )
}

function CreateTallerModal({
  form,
  planes,
  planesLoading,
  isSubmitting,
  error,
  onChange,
  onClose,
  onSubmit,
}: {
  form: CrearTallerInput
  planes: PlanSaasAdmin[]
  planesLoading: boolean
  isSubmitting: boolean
  error: unknown
  onChange: (next: CrearTallerInput) => void
  onClose: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-32px)] max-w-lg -translate-x-1/2 -translate-y-1/2 bg-vs-card border border-vs-line rounded-[24px] shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-vs-line">
          <div>
            <h2 className="text-[16px] font-semibold text-vs-ink">Nuevo taller</h2>
            <p className="text-[12px] text-[#8a7f70]">Crea un tenant SaaS sin configurar modulos ni suscripcion real.</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-vs-chip flex items-center justify-center hover:bg-[#ece7e0] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Nombre" required>
            <input
              value={form.nombre}
              onChange={(e) => onChange({ ...form, nombre: e.target.value })}
              required
              className="w-full bg-vs-bg border border-vs-line rounded-2xl px-3 py-2 text-sm outline-none"
            />
          </Field>
          <Field label="RUT" required>
            <input
              value={form.rut}
              onChange={(e) => onChange({ ...form, rut: e.target.value })}
              required
              className="w-full bg-vs-bg border border-vs-line rounded-2xl px-3 py-2 text-sm outline-none"
            />
          </Field>
          <Field label="Telefono">
            <input
              value={form.telefono ?? ""}
              onChange={(e) => onChange({ ...form, telefono: e.target.value })}
              className="w-full bg-vs-bg border border-vs-line rounded-2xl px-3 py-2 text-sm outline-none"
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              value={form.email ?? ""}
              onChange={(e) => onChange({ ...form, email: e.target.value })}
              className="w-full bg-vs-bg border border-vs-line rounded-2xl px-3 py-2 text-sm outline-none"
            />
          </Field>
          <Field label="Plan" required>
            <select
              value={form.planId}
              onChange={(e) => onChange({ ...form, planId: e.target.value })}
              required
              disabled={planesLoading}
              className="w-full bg-vs-bg border border-vs-line rounded-2xl px-3 py-2 text-sm outline-none"
            >
              <option value="">{planesLoading ? "Cargando planes..." : "Seleccionar plan"}</option>
              {planes.map((plan) => (
                <option key={plan.id} value={plan.id}>
                  {plan.nombre}
                </option>
              ))}
            </select>
          </Field>
          <label className="flex items-center gap-2 self-end rounded-2xl border border-vs-line bg-vs-bg px-3 py-2 text-sm text-vs-ink">
            <input
              type="checkbox"
              checked={form.activo}
              onChange={(e) => onChange({ ...form, activo: e.target.checked })}
            />
            Activo
          </label>

          {error && (
            <div className="sm:col-span-2 rounded-2xl border border-vs-warn/30 bg-vs-warn-bg px-3 py-2 text-[12px] text-vs-warn">
              No se pudo crear el taller. Revisa que el RUT no exista y que los campos requeridos esten completos.
            </div>
          )}

          <div className="sm:col-span-2 flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full bg-vs-chip text-vs-ink text-[13px] font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !form.planId}
              className="px-4 py-2 rounded-full bg-vs-ink text-white text-[13px] font-medium disabled:opacity-50"
            >
              {isSubmitting ? "Creando..." : "Crear taller"}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12px] font-medium text-[#8a7f70]">
        {label}{required ? " *" : ""}
      </span>
      {children}
    </label>
  )
}

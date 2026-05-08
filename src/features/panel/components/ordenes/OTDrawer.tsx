"use client"

import { useState } from "react"
import { X, Eye, Pencil, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  TIPO_CONFIG, ESTADO_CONFIG, PRIORIDAD_CONFIG, MECANICOS_MOCK,
  type OrdenTrabajo, type TipoOT, type EstadoOT, type Prioridad,
} from "./ordenes.mock"
import { TipoChip, EstadoChip, MecPill } from "./OrdenesPage"

// ─── Field wrapper ─────────────────────────────────────────────────────────────

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="text-[11px] text-[#8a7f70] mb-1.5 uppercase tracking-wider">
        {label}
        {required && <span className="text-vs-warn ml-0.5">*</span>}
      </div>
      {children}
    </div>
  )
}

// ─── Select input ──────────────────────────────────────────────────────────────

function FieldSelect({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full appearance-none bg-vs-chip rounded-xl px-3 py-2 text-[12.5px] outline-none border border-vs-line-2 pr-8 text-vs-ink"
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8a7f70] pointer-events-none">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </span>
    </div>
  )
}

// ─── Text input ────────────────────────────────────────────────────────────────

function FieldInput({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-vs-chip rounded-xl px-3 py-2 text-[12.5px] outline-none border border-vs-line-2 placeholder:text-[#b8a88d]"
    />
  )
}

// ─── Drawer ────────────────────────────────────────────────────────────────────

export function OTDrawer({
  orden: initial,
  mode: initialMode,
  onClose,
  onSave,
}: {
  orden: OrdenTrabajo
  mode: "view" | "edit"
  onClose: () => void
  onSave: (updated: OrdenTrabajo) => void
}) {
  const [mode, setMode] = useState<"view" | "edit">(initialMode)
  const [draft, setDraft] = useState<OrdenTrabajo>({ ...initial })

  const set = <K extends keyof OrdenTrabajo>(key: K, val: OrdenTrabajo[K]) =>
    setDraft(prev => ({ ...prev, [key]: val }))

  const handleSave = () => onSave(draft)

  const tipoOptions = Object.entries(TIPO_CONFIG).map(([k, v]) => ({ value: k, label: v.label }))
  const estadoOptions = Object.entries(ESTADO_CONFIG).map(([k, v]) => ({ value: k, label: v.label }))
  const prioOptions = Object.entries(PRIORIDAD_CONFIG).map(([k, v]) => ({ value: k, label: v.label }))
  const mecOptions = MECANICOS_MOCK.map(m => ({ value: m.id, label: m.nombre }))

  const isEdit = mode === "edit"
  const cfg = TIPO_CONFIG[draft.tipo]

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="flex-1 bg-black/30 backdrop-blur-sm"
      />

      {/* Panel */}
      <div className="w-[520px] bg-vs-bg h-full overflow-y-auto flex flex-col">
        <div className="bg-vs-card border border-vs-line rounded-[24px] m-3 mb-0 flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-3 p-5 border-b border-vs-line-2">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              style={{ background: cfg.bg, color: cfg.fg }}
            >
              {isEdit
                ? <Pencil size={16} strokeWidth={1.6} />
                : <Eye size={16} strokeWidth={1.6} />
              }
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] text-[#8a7f70] uppercase tracking-widest">
                {isEdit ? "Editando orden" : "Detalle de orden"}
              </div>
              <div className="text-[16px] font-semibold font-mono">{draft.id}</div>
            </div>
            {!isEdit && (
              <button
                onClick={() => setMode("edit")}
                className="flex items-center gap-1.5 bg-vs-chip text-vs-ink px-3 py-1.5 rounded-full text-[12px] font-medium hover:bg-[#ebe3d6] transition-colors"
              >
                <Pencil size={13} strokeWidth={1.6} />
                Editar
              </button>
            )}
            {isEdit && (
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 bg-vs-ink text-white px-4 py-1.5 rounded-full text-[12px] font-medium hover:bg-[#1e2228] transition-colors"
              >
                <Check size={13} strokeWidth={2} />
                Guardar
              </button>
            )}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-vs-chip hover:bg-[#ebe3d6] flex items-center justify-center transition-colors shrink-0"
            >
              <X size={16} strokeWidth={1.6} />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 space-y-5">
            {/* Tipo + Estado */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Tipo de orden" required={isEdit}>
                {isEdit
                  ? <FieldSelect value={draft.tipo} onChange={v => set("tipo", v as TipoOT)} options={tipoOptions} />
                  : <TipoChip tipo={draft.tipo} />
                }
              </Field>
              <Field label="Estado" required={isEdit}>
                {isEdit
                  ? <FieldSelect value={draft.estado} onChange={v => set("estado", v as EstadoOT)} options={estadoOptions} />
                  : <EstadoChip estado={draft.estado} />
                }
              </Field>
            </div>

            {/* Fecha + Prioridad */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Fecha estimada entrega" required={isEdit}>
                {isEdit
                  ? <FieldInput value={draft.fechaEstimada} onChange={v => set("fechaEstimada", v)} placeholder="ej. 25 Abr" />
                  : <div className="text-[13px] font-medium">{draft.fechaEstimada}</div>
                }
              </Field>
              <Field label="Prioridad" required={isEdit}>
                {isEdit
                  ? <FieldSelect value={draft.prioridad} onChange={v => set("prioridad", v as Prioridad)} options={prioOptions} />
                  : (
                    <span
                      className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: PRIORIDAD_CONFIG[draft.prioridad].bg, color: PRIORIDAD_CONFIG[draft.prioridad].fg }}
                    >
                      {PRIORIDAD_CONFIG[draft.prioridad].label}
                    </span>
                  )
                }
              </Field>
            </div>

            {/* Fecha ingreso (read-only) */}
            <Field label="Fecha de ingreso">
              <div className="text-[13px] font-medium text-[#4a4438]">{draft.fechaIngreso}</div>
            </Field>

            {/* Mecánico */}
            <Field label="Mecánico responsable" required={isEdit}>
              {isEdit
                ? <FieldSelect value={draft.mecanicoId} onChange={v => set("mecanicoId", v)} options={mecOptions} />
                : <MecPill mecanicoId={draft.mecanicoId} />
              }
            </Field>

            {/* Cliente */}
            <div className="pt-3 border-t border-vs-line-2">
              <div className="text-[11px] text-[#8a7f70] uppercase tracking-widest mb-3">Cliente</div>
              <div className="space-y-4">
                <Field label="Nombre" required={isEdit}>
                  {isEdit
                    ? <FieldInput value={draft.clienteNombre} onChange={v => set("clienteNombre", v)} />
                    : <div className="text-[13px] font-medium">{draft.clienteNombre}</div>
                  }
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Teléfono">
                    {isEdit
                      ? <FieldInput value={draft.clienteTelefono ?? ""} onChange={v => set("clienteTelefono", v)} placeholder="+56 9…" />
                      : <div className="text-[13px] text-[#4a4438]">{draft.clienteTelefono ?? "—"}</div>
                    }
                  </Field>
                  <Field label="Email">
                    {isEdit
                      ? <FieldInput value={draft.clienteEmail ?? ""} onChange={v => set("clienteEmail", v)} placeholder="email@ejemplo.com" />
                      : <div className="text-[13px] text-[#4a4438]">{draft.clienteEmail ?? "—"}</div>
                    }
                  </Field>
                </div>
              </div>
            </div>

            {/* Bicicleta */}
            <div className="pt-3 border-t border-vs-line-2">
              <div className="text-[11px] text-[#8a7f70] uppercase tracking-widest mb-3">Bicicleta</div>
              <div className="space-y-4">
                <Field label="Marca / Modelo" required={isEdit}>
                  {isEdit
                    ? <FieldInput value={draft.biciMarca} onChange={v => set("biciMarca", v)} />
                    : <div className="text-[13px] font-medium">{draft.biciMarca}</div>
                  }
                </Field>
                <div className="grid grid-cols-3 gap-3">
                  <Field label="Tipo" required={isEdit}>
                    {isEdit
                      ? <FieldInput value={draft.biciTipo} onChange={v => set("biciTipo", v)} />
                      : <div className="text-[13px]">{draft.biciTipo}</div>
                    }
                  </Field>
                  <Field label="Talla" required={isEdit}>
                    {isEdit
                      ? <FieldInput value={draft.biciTalla} onChange={v => set("biciTalla", v)} />
                      : <div className="text-[13px]">{draft.biciTalla}</div>
                    }
                  </Field>
                  <Field label="Color" required={isEdit}>
                    {isEdit
                      ? <FieldInput value={draft.biciColor} onChange={v => set("biciColor", v)} />
                      : <div className="text-[13px]">{draft.biciColor}</div>
                    }
                  </Field>
                </div>
                <Field label="N° de serie">
                  {isEdit
                    ? <FieldInput value={draft.biciNumSerie ?? ""} onChange={v => set("biciNumSerie", v)} placeholder="Opcional" />
                    : <div className="text-[13px] text-[#4a4438] font-mono">{draft.biciNumSerie ?? "—"}</div>
                  }
                </Field>
              </div>
            </div>

            {/* Trabajo */}
            <div className="pt-3 border-t border-vs-line-2">
              <div className="text-[11px] text-[#8a7f70] uppercase tracking-widest mb-3">Trabajo</div>
              <div className="space-y-4">
                <Field label="Descripción" required={isEdit}>
                  {isEdit
                    ? (
                      <textarea
                        value={draft.descripcion}
                        onChange={e => set("descripcion", e.target.value)}
                        rows={4}
                        className="w-full bg-vs-chip rounded-xl px-3 py-2 text-[12.5px] outline-none border border-vs-line-2 leading-relaxed resize-none"
                      />
                    )
                    : (
                      <div className="text-[13px] leading-relaxed text-[#2b2f36] bg-vs-chip rounded-xl p-3 border border-vs-line-2">
                        {draft.descripcion}
                      </div>
                    )
                  }
                </Field>
                <Field label="Notas internas">
                  {isEdit
                    ? (
                      <textarea
                        value={draft.notasInternas ?? ""}
                        onChange={e => set("notasInternas", e.target.value)}
                        rows={3}
                        placeholder="Notas visibles solo para el equipo…"
                        className="w-full bg-vs-chip rounded-xl px-3 py-2 text-[12.5px] outline-none border border-vs-line-2 leading-relaxed resize-none placeholder:text-[#b8a88d]"
                      />
                    )
                    : draft.notasInternas
                      ? (
                        <div className="text-[13px] leading-relaxed text-[#2b2f36] bg-vs-chip rounded-xl p-3 border border-vs-line-2">
                          {draft.notasInternas}
                        </div>
                      )
                      : <div className="text-[13px] text-[#a59682]">—</div>
                  }
                </Field>
              </div>
            </div>

            {/* History (view mode only) */}
            {!isEdit && (
              <div className="pt-3 border-t border-vs-line-2">
                <div className="text-[11px] text-[#8a7f70] uppercase tracking-widest mb-3">Historial</div>
                <ul className="space-y-2.5 relative pl-5 before:absolute before:left-[6px] before:top-1 before:bottom-1 before:w-px before:bg-vs-line-2">
                  {[
                    { t: draft.fechaIngreso, text: "OT creada por recepción" },
                    { t: draft.fechaIngreso, text: `Asignada a ${MECANICOS_MOCK.find(m => m.id === draft.mecanicoId)?.nombre ?? "Sin asignar"}` },
                    { t: "Pendiente", text: `Estado actual: ${ESTADO_CONFIG[draft.estado].label}` },
                  ].map((h, i) => (
                    <li key={i} className="relative">
                      <span className="absolute -left-5 top-1 w-3 h-3 rounded-full bg-vs-violet-bg border-2 border-white" />
                      <div className="text-[12px] text-[#2b2f36]">{h.text}</div>
                      <div className="text-[10.5px] text-[#a59682] font-mono">{h.t}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="h-5" />
      </div>
    </div>
  )
}

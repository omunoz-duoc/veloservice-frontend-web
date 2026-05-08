"use client"

import { useState } from "react"
import { X, Plus, User, Bike, Wrench } from "lucide-react"
import {
  TIPO_CONFIG, ESTADO_CONFIG, MECANICOS_MOCK, TIPOS_BICI,
  type OrdenTrabajo, type TipoOT, type Prioridad, type TipoBici, type NuevaOTPayload,
} from "./ordenes.mock"

// ─── Form field components ─────────────────────────────────────────────────────

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <div className="text-[11px] text-[#8a7f70] mb-1.5 uppercase tracking-wider">
      {children}
      {required && <span className="text-vs-warn ml-0.5">*</span>}
    </div>
  )
}

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-vs-chip rounded-xl px-3 py-2 text-[12.5px] outline-none border border-vs-line-2 placeholder:text-[#b8a88d] focus:border-[#a59682] transition-colors"
    />
  )
}

function Select({
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
        className="w-full appearance-none bg-vs-chip rounded-xl px-3 py-2 text-[12.5px] outline-none border border-vs-line-2 pr-8 text-vs-ink focus:border-[#a59682] transition-colors"
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

// ─── Section header ────────────────────────────────────────────────────────────

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="pt-4 border-t border-vs-line-2 first:pt-0 first:border-0">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-full bg-vs-chip flex items-center justify-center text-[#4a4438]">
          {icon}
        </div>
        <div className="text-[12px] font-semibold text-[#4a4438] uppercase tracking-wider">{title}</div>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

// ─── Default form values ───────────────────────────────────────────────────────

const EMPTY_FORM: NuevaOTPayload = {
  tipo: "mantencion",
  prioridad: "media",
  fechaEstimada: "",
  mecanicoId: "--",
  clienteNombre: "",
  clienteTelefono: "",
  clienteEmail: "",
  biciMarca: "",
  biciTipo: "MTB",
  biciTalla: "",
  biciColor: "",
  biciNumSerie: "",
  descripcion: "",
  notasInternas: "",
}

// ─── Modal ─────────────────────────────────────────────────────────────────────

export function NuevaOTModal({
  nextId,
  onClose,
  onCreate,
}: {
  nextId: string
  onClose: () => void
  onCreate: (orden: OrdenTrabajo) => void
}) {
  const [form, setForm] = useState<NuevaOTPayload>(EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof NuevaOTPayload, boolean>>>({})

  const set = <K extends keyof NuevaOTPayload>(key: K, val: NuevaOTPayload[K]) => {
    setForm(prev => ({ ...prev, [key]: val }))
    setErrors(prev => ({ ...prev, [key]: false }))
  }

  const validate = (): boolean => {
    const required: (keyof NuevaOTPayload)[] = [
      "clienteNombre", "biciMarca", "biciTalla", "biciColor", "descripcion", "fechaEstimada",
    ]
    const next: typeof errors = {}
    let valid = true
    for (const key of required) {
      if (!form[key]?.toString().trim()) {
        next[key] = true
        valid = false
      }
    }
    setErrors(next)
    return valid
  }

  const handleSubmit = () => {
    if (!validate()) return

    const now = new Date()
    const fechaIngreso = now.toLocaleDateString("es-CL", {
      day: "numeric", month: "short",
    }) + " · " + now.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })

    const nueva: OrdenTrabajo = {
      id: nextId,
      tipo: form.tipo,
      estado: "recibido",
      prioridad: form.prioridad,
      fechaIngreso,
      fechaEstimada: form.fechaEstimada,
      mecanicoId: form.mecanicoId,
      clienteNombre: form.clienteNombre,
      clienteTelefono: form.clienteTelefono || undefined,
      clienteEmail: form.clienteEmail || undefined,
      biciMarca: form.biciMarca,
      biciTipo: form.biciTipo as TipoBici,
      biciTalla: form.biciTalla,
      biciColor: form.biciColor,
      biciNumSerie: form.biciNumSerie || undefined,
      descripcion: form.descripcion,
      notasInternas: form.notasInternas || undefined,
    }

    onCreate(nueva)
  }

  const tipoOptions = Object.entries(TIPO_CONFIG).map(([k, v]) => ({ value: k, label: v.label }))
  const mecOptions = MECANICOS_MOCK.map(m => ({ value: m.id, label: m.nombre }))
  const biciTipoOptions = TIPOS_BICI.map(t => ({ value: t, label: t }))
  const prioOptions = [
    { value: "baja",  label: "Baja" },
    { value: "media", label: "Media" },
    { value: "alta",  label: "Alta — Urgente" },
  ]

  const inputClass = (key: keyof NuevaOTPayload) =>
    errors[key] ? "ring-2 ring-vs-warn/50 border-vs-warn" : ""

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div onClick={onClose} className="flex-1 bg-black/30 backdrop-blur-sm" />

      {/* Panel */}
      <div className="w-[540px] bg-black/30 backdrop-blur-sm h-full overflow-y-auto flex flex-col">
        <div className="bg-vs-card border border-vs-line rounded-[24px] m-3 mb-0 flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-3 p-5 border-b border-vs-line-2">
            <div className="w-10 h-10 rounded-full bg-vs-ink flex items-center justify-center shrink-0">
              <Plus size={18} strokeWidth={2} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="text-[11px] text-[#8a7f70] uppercase tracking-widest">Nueva orden de trabajo</div>
              <div className="text-[16px] font-semibold font-mono text-[#a59682]">{nextId}</div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-vs-chip hover:bg-[#ebe3d6] flex items-center justify-center transition-colors"
            >
              <X size={16} strokeWidth={1.6} />
            </button>
          </div>

          {/* Form */}
          <div className="p-5 space-y-5">
            {/* Section: Cliente */}
            <Section icon={<User size={14} strokeWidth={1.6} />} title="Cliente">
              <div>
                <Label required>Nombre completo</Label>
                <Input
                  value={form.clienteNombre}
                  onChange={v => set("clienteNombre", v)}
                  placeholder="Nombre del cliente"
                />
                {errors.clienteNombre && (
                  <p className="text-[11px] text-vs-warn mt-1">Campo requerido</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Teléfono</Label>
                  <Input
                    value={form.clienteTelefono}
                    onChange={v => set("clienteTelefono", v)}
                    placeholder="+56 9 …"
                    type="tel"
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    value={form.clienteEmail}
                    onChange={v => set("clienteEmail", v)}
                    placeholder="email@ejemplo.com"
                    type="email"
                  />
                </div>
              </div>
            </Section>

            {/* Section: Bicicleta */}
            <Section icon={<Bike size={14} strokeWidth={1.6} />} title="Bicicleta">
              <div>
                <Label required>Marca y modelo</Label>
                <Input
                  value={form.biciMarca}
                  onChange={v => set("biciMarca", v)}
                  placeholder="ej. Trek Marlin 7 2024"
                />
                {errors.biciMarca && (
                  <p className="text-[11px] text-vs-warn mt-1">Campo requerido</p>
                )}
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label required>Tipo</Label>
                  <Select
                    value={form.biciTipo}
                    onChange={v => set("biciTipo", v)}
                    options={biciTipoOptions}
                  />
                </div>
                <div>
                  <Label required>Talla</Label>
                  <Input
                    value={form.biciTalla}
                    onChange={v => set("biciTalla", v)}
                    placeholder="ej. M, 56cm"
                  />
                  {errors.biciTalla && (
                    <p className="text-[11px] text-vs-warn mt-1">Requerido</p>
                  )}
                </div>
                <div>
                  <Label required>Color</Label>
                  <Input
                    value={form.biciColor}
                    onChange={v => set("biciColor", v)}
                    placeholder="ej. Rojo Volcán"
                  />
                  {errors.biciColor && (
                    <p className="text-[11px] text-vs-warn mt-1">Requerido</p>
                  )}
                </div>
              </div>
              <div>
                <Label>Número de serie</Label>
                <Input
                  value={form.biciNumSerie}
                  onChange={v => set("biciNumSerie", v)}
                  placeholder="Opcional — ubicado en el tubo del BB"
                />
              </div>
            </Section>

            {/* Section: Orden */}
            <Section icon={<Wrench size={14} strokeWidth={1.6} />} title="Orden de trabajo">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label required>Tipo de trabajo</Label>
                  <Select
                    value={form.tipo}
                    onChange={v => set("tipo", v as TipoOT)}
                    options={tipoOptions}
                  />
                </div>
                <div>
                  <Label required>Prioridad</Label>
                  <Select
                    value={form.prioridad}
                    onChange={v => set("prioridad", v as Prioridad)}
                    options={prioOptions}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label required>Fecha estimada entrega</Label>
                  <Input
                    value={form.fechaEstimada}
                    onChange={v => set("fechaEstimada", v)}
                    placeholder="ej. 28 Abr"
                    type="text"
                  />
                  {errors.fechaEstimada && (
                    <p className="text-[11px] text-vs-warn mt-1">Campo requerido</p>
                  )}
                </div>
                <div>
                  <Label>Mecánico asignado</Label>
                  <Select
                    value={form.mecanicoId}
                    onChange={v => set("mecanicoId", v)}
                    options={mecOptions}
                  />
                </div>
              </div>
              <div>
                <Label required>Descripción del trabajo</Label>
                <textarea
                  value={form.descripcion}
                  onChange={e => set("descripcion", e.target.value)}
                  rows={4}
                  placeholder="Describe el trabajo a realizar, síntomas observados, piezas a reemplazar…"
                  className="w-full bg-vs-chip rounded-xl px-3 py-2 text-[12.5px] outline-none border border-vs-line-2 leading-relaxed resize-none placeholder:text-[#b8a88d] focus:border-[#a59682] transition-colors"
                />
                {errors.descripcion && (
                  <p className="text-[11px] text-vs-warn mt-1">Campo requerido</p>
                )}
              </div>
              <div>
                <Label>Notas internas</Label>
                <textarea
                  value={form.notasInternas}
                  onChange={e => set("notasInternas", e.target.value)}
                  rows={2}
                  placeholder="Notas visibles solo para el equipo del taller…"
                  className="w-full bg-vs-chip rounded-xl px-3 py-2 text-[12.5px] outline-none border border-vs-line-2 leading-relaxed resize-none placeholder:text-[#b8a88d] focus:border-[#a59682] transition-colors"
                />
              </div>
            </Section>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-3 p-5 border-t border-vs-line-2 bg-[#faf6f0] rounded-b-[24px]">
            <div className="text-[11.5px] text-[#8a7f70]">
              Estado inicial: <span className="font-semibold text-[#6b5d46]">Recibido</span>
            </div>
            <div className="flex-1" />
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full bg-vs-chip text-vs-ink text-[13px] font-medium hover:bg-[#ebe3d6] transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-vs-ink text-white text-[13px] font-medium hover:bg-[#1e2228] transition-colors"
            >
              <Plus size={15} strokeWidth={2} />
              Crear OT
            </button>
          </div>
        </div>
        <div className="h-5" />
      </div>
    </div>
  )
}

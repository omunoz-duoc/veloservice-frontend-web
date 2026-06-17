"use client"

import { useState } from "react"
import { X, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  TIERS, CANALES, ID_TYPES,
  type Cliente, type TierKey, type CanalKey, type IdType, type NuevoClientePayload,
} from "./clientes.mock"
import { ClienteAvatar } from "./ClienteDrawer"

// ─── Form primitives ───────────────────────────────────────────────────────────

function FLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <div className="text-[11px] text-[#8a7f70] mb-1.5 uppercase tracking-wider">
      {children}
      {required && <span className="text-vs-warn ml-0.5">*</span>}
    </div>
  )
}

function FInput({
  value, onChange, placeholder, type = "text", mono, error,
}: {
  value: string; onChange: (v: string) => void
  placeholder?: string; type?: string; mono?: boolean; error?: boolean
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        "w-full bg-vs-chip rounded-xl px-3 py-2 text-[12.5px] outline-none border placeholder:text-[#b8a88d] focus:border-[#a59682] transition-colors",
        mono && "font-mono",
        error ? "border-vs-warn" : "border-vs-line-2"
      )}
    />
  )
}

function FSelect({
  value, onChange, options,
}: {
  value: string; onChange: (v: string) => void; options: { value: string; label: string }[]
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full appearance-none bg-vs-chip rounded-xl px-3 py-2 text-[12.5px] outline-none border border-vs-line-2 pr-8 focus:border-[#a59682] transition-colors"
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8a7f70] pointer-events-none">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </span>
    </div>
  )
}

function FSection({ title }: { title: string }) {
  return (
    <div className="text-[11px] text-[#8a7f70] uppercase tracking-widest pt-1 pb-0.5 border-b border-vs-line-2">
      {title}
    </div>
  )
}

// ─── Empty payload ─────────────────────────────────────────────────────────────

function emptyPayload(): NuevoClientePayload {
  return {
    nombre: "",
    idType: "RUT",
    idNum: "",
    email: "",
    tel: "",
    ciudad: "",
    canal: "WhatsApp",
    tier: "nuevo",
    notas: "",
    consentEmail: true,
    consentWhatsApp: true,
    consentMarketing: false,
  }
}

// ─── Modal ─────────────────────────────────────────────────────────────────────

export function NuevoClienteModal({
  onClose,
  onCreate,
}: {
  onClose: () => void
  onCreate: (cliente: Cliente) => void
}) {
  const [form, setForm] = useState<NuevoClientePayload>(emptyPayload)
  const [errors, setErrors] = useState<Set<string>>(new Set())

  const set = <K extends keyof NuevoClientePayload>(key: K, val: NuevoClientePayload[K]) => {
    setForm(prev => ({ ...prev, [key]: val }))
    setErrors(prev => { const n = new Set(prev); n.delete(key); return n })
  }

  const validate = () => {
    const required = ["nombre", "idNum", "email"]
    const errs = new Set(required.filter(k => !form[k as keyof NuevoClientePayload]?.toString().trim()))
    setErrors(errs)
    return errs.size === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    const now = new Date()
    const mes = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"][now.getMonth()]
    const cliente: Cliente = {
      id: "",
      nombre: form.nombre.trim(),
      idType: form.idType,
      idNum: form.idNum.trim(),
      email: form.email.trim(),
      tel: form.tel.trim(),
      ciudad: form.ciudad.trim(),
      fechaReg: `${now.getDate()} ${mes} ${now.getFullYear()}`,
      tier: form.tier,
      bicis: 0,
      ots: 0,
      gasto: 0,
      ultima: "—",
      canal: form.canal,
      notas: form.notas.trim(),
      consentEmail: form.consentEmail,
      consentWhatsApp: form.consentWhatsApp,
      consentMarketing: form.consentMarketing,
    }
    onCreate(cliente)
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div onClick={onClose} className="flex-1 bg-black/30 backdrop-blur-sm" />

      <div className="flex h-full w-full max-w-[540px] flex-col overflow-y-auto bg-black/30 backdrop-blur-sm">
        <div className="bg-vs-card border border-vs-line rounded-[24px] m-3 mb-0 flex flex-col">
          {/* Header */}
          <div className="flex flex-wrap items-center gap-3 border-b border-vs-line-2 p-5">
            <ClienteAvatar nombre={form.nombre || "NC"} tier={form.tier} size={44} />
            <div className="flex-1">
              <div className="text-[11px] text-[#8a7f70] uppercase tracking-widest">Nuevo ciclista</div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-vs-chip hover:bg-[#ebe3d6] flex items-center justify-center active:scale-90 transition-all duration-150 shrink-0"
            >
              <X size={16} strokeWidth={1.6} />
            </button>
          </div>

          {/* Form */}
          <div className="p-5 space-y-4">
            <FSection title="Identificación" />

            <div>
              <FLabel required>Nombre completo</FLabel>
              <FInput
                value={form.nombre}
                onChange={v => set("nombre", v)}
                placeholder="ej. Paulina Mora Sánchez"
                error={errors.has("nombre")}
              />
              {errors.has("nombre") && <p className="text-[11px] text-vs-warn mt-1">Campo requerido</p>}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[130px_1fr]">
              <div>
                <FLabel>Tipo ID</FLabel>
                <FSelect
                  value={form.idType}
                  onChange={v => set("idType", v as IdType)}
                  options={ID_TYPES.map(t => ({ value: t, label: t }))}
                />
              </div>
              <div>
                <FLabel required>Identificación</FLabel>
                <FInput
                  value={form.idNum}
                  onChange={v => set("idNum", v)}
                  placeholder="ej. 15.824.391-5"
                  mono
                  error={errors.has("idNum")}
                />
                {errors.has("idNum") && <p className="text-[11px] text-vs-warn mt-1">Campo requerido</p>}
              </div>
            </div>

            <FSection title="Contacto" />

            <div>
              <FLabel required>Email</FLabel>
              <FInput
                value={form.email}
                onChange={v => set("email", v)}
                placeholder="ej. cliente@email.com"
                type="email"
                error={errors.has("email")}
              />
              {errors.has("email") && <p className="text-[11px] text-vs-warn mt-1">Campo requerido</p>}
            </div>

            <div>
              <FLabel>Teléfono</FLabel>
              <FInput value={form.tel} onChange={v => set("tel", v)} placeholder="+56 9 0000 0000" />
            </div>

            <div className="hidden">
              <FLabel>Ciudad / Comuna</FLabel>
              <FInput value={form.ciudad} onChange={v => set("ciudad", v)} placeholder="ej. Providencia, Santiago" />
            </div>

            <FSection title="Clasificación" />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <FLabel>Canal preferido</FLabel>
                <FSelect
                  value={form.canal}
                  onChange={v => set("canal", v as CanalKey)}
                  options={CANALES.map(c => ({ value: c, label: c }))}
                />
              </div>
              <div>
                <FLabel>Nivel / Tier</FLabel>
                <FSelect
                  value={form.tier}
                  onChange={v => set("tier", v as TierKey)}
                  options={TIERS.map(t => ({ value: t.key, label: t.label }))}
                />
              </div>
            </div>

            <div>
              <FLabel>Notas internas</FLabel>
              <textarea
                value={form.notas}
                onChange={e => set("notas", e.target.value)}
                rows={3}
                placeholder="Preferencias, equipamiento, observaciones…"
                className="w-full bg-vs-chip rounded-xl px-3 py-2 text-[12.5px] outline-none border border-vs-line-2 focus:border-[#a59682] transition-colors leading-relaxed resize-none placeholder:text-[#b8a88d]"
              />
            </div>

            <FSection title="Consentimiento" />

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[12px] cursor-pointer select-none">
                <input type="checkbox" checked={form.consentEmail} onChange={e => set("consentEmail", e.target.checked)} className="accent-vs-ink w-4 h-4" />
                Acepta envío de recordatorios por email
              </label>
              <label className="flex items-center gap-2 text-[12px] cursor-pointer select-none">
                <input type="checkbox" checked={form.consentWhatsApp} onChange={e => set("consentWhatsApp", e.target.checked)} className="accent-vs-ink w-4 h-4" />
                Acepta notificaciones por WhatsApp
              </label>
              <label className="flex items-center gap-2 text-[12px] cursor-pointer select-none">
                <input type="checkbox" checked={form.consentMarketing} onChange={e => set("consentMarketing", e.target.checked)} className="accent-vs-ink w-4 h-4" />
                Comunicación de marketing
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-wrap items-center gap-3 rounded-b-[24px] border-t border-vs-line-2 bg-[#faf6f0] p-5">
            <div className="text-[11.5px] text-[#8a7f70]">
              Tier:{" "}
              <span className="font-semibold" style={{ color: TIERS.find(t => t.key === form.tier)?.fg }}>
                {TIERS.find(t => t.key === form.tier)?.label}
              </span>
            </div>
            <div className="flex-1" />
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full bg-vs-chip text-vs-ink text-[13px] font-medium hover:bg-[#ebe3d6] active:scale-95 transition-all duration-150"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-vs-ink text-white text-[13px] font-medium hover:bg-[#1e2228] active:scale-95 transition-all duration-150"
            >
              <Plus size={15} strokeWidth={2} />
              Crear ciclista
            </button>
          </div>
        </div>
        <div className="h-5" />
      </div>
    </div>
  )
}

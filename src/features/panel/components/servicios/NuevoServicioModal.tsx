"use client"

import { useState } from "react"
import { X, Plus, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  CATEGORIAS, ALL_SKILLS,
  type Servicio, type CatKey, type NuevoServicioPayload,
} from "./servicios.mock"
import { CatIcon } from "./ServiciosPage"

// ─── Form primitives ───────────────────────────────────────────────────────────

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <div className="text-[11px] text-[#8a7f70] mb-1.5 uppercase tracking-wider">
      {children}
      {required && <span className="text-vs-warn ml-0.5">*</span>}
    </div>
  )
}

function FInput({
  value, onChange, placeholder, type = "text", mono, error, inputMode,
}: {
  value: string; onChange: (v: string) => void
  placeholder?: string; type?: string; mono?: boolean; error?: boolean; inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"]
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      inputMode={inputMode}
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

// ─── Empty payload ─────────────────────────────────────────────────────────────

function emptyPayload(cat?: CatKey): NuevoServicioPayload {
  return {
    cat: cat ?? "rapidos",
    nombre: "",
    precio: "",
    precio2: "",
    dur: "0",
    desc: "",
    incluye: [""],
    skills: [],
    activo: true,
    popular: false,
  }
}

// ─── Modal ─────────────────────────────────────────────────────────────────────

export function NuevoServicioModal({
  defaultCat,
  nextId,
  onClose,
  onCreate,
}: {
  defaultCat?: CatKey
  nextId: string
  onClose: () => void
  onCreate: (servicio: Servicio) => void
}) {
  const [form, setForm] = useState<NuevoServicioPayload>(() => emptyPayload(defaultCat))
  const [errors, setErrors] = useState<Set<string>>(new Set())

  const set = <K extends keyof NuevoServicioPayload>(key: K, val: NuevoServicioPayload[K]) => {
    setForm(prev => ({ ...prev, [key]: val }))
    setErrors(prev => { const n = new Set(prev); n.delete(key); return n })
  }

  const setIncluye = (i: number, val: string) =>
    setForm(prev => {
      const next = [...prev.incluye]
      next[i] = val
      return { ...prev, incluye: next }
    })

  const addIncluye = () => setForm(prev => ({ ...prev, incluye: [...prev.incluye, ""] }))

  const removeIncluye = (i: number) =>
    setForm(prev => ({ ...prev, incluye: prev.incluye.filter((_, idx) => idx !== i) }))

  const toggleSkill = (skill: string) =>
    setForm(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill],
    }))

  const validate = () => {
    const required = ["nombre", "precio", "dur", "desc"]
    const errs = new Set(required.filter(k => !form[k as keyof NuevoServicioPayload]?.toString().trim()))
    setErrors(errs)
    return errs.size === 0
  }

  const handleSubmit = () => {
    if (!validate()) return

    const servicio: Servicio = {
      id: nextId,
      cat: form.cat,
      nombre: form.nombre.trim(),
      precio: parseInt(form.precio.replace(/\D/g, "")) || 0,
      precio2: form.precio2 ? parseInt(form.precio2.replace(/\D/g, "")) : undefined,
      dur: parseInt(form.dur) || 0,
      desc: form.desc.trim(),
      incluye: form.incluye.filter(s => s.trim()),
      skills: form.skills,
      activo: form.activo,
      popular: form.popular,
      ots30: 0,
    }
    onCreate(servicio)
  }

  const cat = CATEGORIAS.find(c => c.key === form.cat)!
  const catOptions = CATEGORIAS.map(c => ({ value: c.key, label: c.label }))

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div onClick={onClose} className="flex-1 bg-black/30 backdrop-blur-sm" />

      {/* Panel */}
      <div className="flex h-full w-full max-w-[540px] flex-col overflow-y-auto bg-black/30 backdrop-blur-sm">
        <div className="bg-vs-card border border-vs-line rounded-[24px] m-3 mb-0 flex flex-col">
          {/* Header */}
          <div className="flex flex-wrap items-center gap-3 border-b border-vs-line-2 p-5">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300"
              style={{ background: cat.bg, color: cat.fg }}
            >
              <CatIcon catKey={form.cat} size={20} />
            </div>
            <div className="flex-1">
              <div className="text-[11px] text-[#8a7f70] uppercase tracking-widest">Nuevo servicio</div>
              <div className="text-[15px] font-semibold font-mono text-[#a59682]">{nextId}</div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-vs-chip hover:bg-[#ebe3d6] flex items-center justify-center active:scale-90 transition-all duration-150 shrink-0"
            >
              <X size={16} strokeWidth={1.6} />
            </button>
          </div>

          {/* Form */}
          <div className="p-5 space-y-5">
            {/* Categoría */}
            <div>
              <Label required>Categoría</Label>
              <FSelect value={form.cat} onChange={v => set("cat", v as CatKey)} options={catOptions} />
              {/* Category description hint */}
              <div className="mt-1.5 text-[11px] text-[#a59682] px-1">
                {cat.desc}
              </div>
            </div>

            {/* Nombre */}
            <div>
              <Label required>Nombre del servicio</Label>
              <FInput
                value={form.nombre}
                onChange={v => set("nombre", v)}
                placeholder="ej. Ajuste completo de frenos hidráulicos"
                error={errors.has("nombre")}
              />
              {errors.has("nombre") && <p className="text-[11px] text-vs-warn mt-1">Campo requerido</p>}
            </div>

            {/* Descripción */}
            <div>
              <Label required>Descripción</Label>
              <textarea
                value={form.desc}
                onChange={e => set("desc", e.target.value)}
                rows={3}
                placeholder="Describe qué incluye el servicio, qué se realiza y bajo qué condiciones…"
                className={cn(
                  "w-full bg-vs-chip rounded-xl px-3 py-2 text-[12.5px] outline-none border placeholder:text-[#b8a88d] focus:border-[#a59682] transition-colors leading-relaxed resize-none",
                  errors.has("desc") ? "border-vs-warn" : "border-vs-line-2"
                )}
              />
              {errors.has("desc") && <p className="text-[11px] text-vs-warn mt-1">Campo requerido</p>}
            </div>

            {/* Precio, precio alt, duración */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <Label required>Precio (CLP)</Label>
                <FInput
                  value={form.precio}
                  onChange={v => set("precio", v.replace(/\D/g, ""))}
                  placeholder="ej. 35000"
                  mono
                  error={errors.has("precio")}
                  inputMode="numeric"
                />
                {errors.has("precio") && <p className="text-[11px] text-vs-warn mt-1">Requerido</p>}
              </div>
              <div>
                <Label>Precio alterno</Label>
                <FInput
                  value={form.precio2}
                  onChange={v => set("precio2", v.replace(/\D/g, ""))}
                  placeholder="Opcional"
                  mono
                  inputMode="numeric"
                />
              </div>
              <div className="hidden">
                <Label required>Duración (min)</Label>
                <FInput
                  value={form.dur}
                  onChange={v => set("dur", v.replace(/\D/g, ""))}
                  placeholder="ej. 90"
                  mono
                  error={errors.has("dur")}
                  inputMode="numeric"
                />
                {errors.has("dur") && <p className="text-[11px] text-vs-warn mt-1">Requerido</p>}
              </div>
            </div>

            {/* Incluye */}
            <div>
              <Label>Incluye</Label>
              <ul className="space-y-2">
                {form.incluye.map((item, i) => (
                  <li key={i} className="flex min-w-0 items-center gap-2 vs-scale-in">
                    <input
                      value={item}
                      onChange={e => setIncluye(i, e.target.value)}
                      placeholder={`Ítem ${i + 1}`}
                      className="min-w-0 flex-1 rounded-xl border border-vs-line-2 bg-vs-chip px-3 py-1.5 text-[12px] outline-none transition-colors placeholder:text-[#b8a88d] focus:border-[#a59682]"
                    />
                    {form.incluye.length > 1 && (
                      <button
                        onClick={() => removeIncluye(i)}
                        className="w-7 h-7 rounded-full bg-vs-chip hover:bg-vs-warn-bg hover:text-vs-warn flex items-center justify-center active:scale-90 transition-all duration-150 shrink-0"
                      >
                        <X size={12} strokeWidth={2} />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
              <button
                onClick={addIncluye}
                className="mt-2 flex items-center gap-1.5 text-[12px] text-vs-violet hover:text-vs-ink bg-vs-violet-bg hover:bg-vs-chip px-3 py-1.5 rounded-full active:scale-95 transition-all duration-150"
              >
                <Plus size={12} strokeWidth={2} />
                Añadir ítem
              </button>
            </div>

            {/* Skills */}
            <div>
              <Label>Mecánicos habilitados</Label>
              <div className="flex flex-wrap gap-2">
                {ALL_SKILLS.map(skill => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={cn(
                      "flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-full border transition-all duration-150 active:scale-95",
                      form.skills.includes(skill)
                        ? "bg-vs-ink text-white border-vs-ink"
                        : "bg-vs-chip text-[#4a4438] border-vs-line-2 hover:border-[#a59682]"
                    )}
                  >
                    {form.skills.includes(skill) && <Check size={11} strokeWidth={2.5} />}
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            {/* Flags */}
            <div className="flex flex-wrap items-center gap-5 pt-1">
              <label className="flex items-center gap-2 text-[12px] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.activo}
                  onChange={e => set("activo", e.target.checked)}
                  className="accent-vs-ink w-4 h-4"
                />
                Activo (visible en OTs)
              </label>
              <label className="flex items-center gap-2 text-[12px] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.popular}
                  onChange={e => set("popular", e.target.checked)}
                  className="accent-[#8c6a1e] w-4 h-4"
                />
                Marcar como popular
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-wrap items-center gap-3 rounded-b-[24px] border-t border-vs-line-2 bg-[#faf6f0] p-5">
            <div className="text-[11.5px] text-[#8a7f70]">
              Categoría:{" "}
              <span className="font-semibold" style={{ color: cat.fg }}>{cat.label}</span>
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
              Crear servicio
            </button>
          </div>
        </div>
        <div className="h-5" />
      </div>
    </div>
  )
}

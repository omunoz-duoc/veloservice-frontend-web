"use client"

import { useState } from "react"
import { X, Pencil, Check, Plus, Copy, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  CATEGORIAS, ALL_SKILLS, fmt,
  type Servicio, type CatKey,
} from "./servicios.mock"
import { CatIcon } from "./ServiciosPage"

// ─── Shared field components ───────────────────────────────────────────────────

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <div className="text-[10.5px] text-[#8a7f70] mb-1.5 uppercase tracking-wider">
      {children}
      {required && <span className="text-vs-warn ml-0.5">*</span>}
    </div>
  )
}

function StatBox({ label, value, sub }: { label: string; value: string | number; sub: string }) {
  return (
    <div className="bg-vs-chip rounded-xl p-3 border border-vs-line-2">
      <div className="text-[10.5px] text-[#8a7f70]">{label}</div>
      <div className="text-[15px] font-semibold font-mono leading-tight truncate">{value}</div>
      <div className="text-[10px] text-[#a59682] truncate">{sub}</div>
    </div>
  )
}

function FieldText({
  value, onChange, placeholder, mono,
}: {
  value: string; onChange: (v: string) => void; placeholder?: string; mono?: boolean
}) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={cn(
        "w-full bg-vs-chip rounded-xl px-3 py-2 text-[12.5px] outline-none border border-vs-line-2 focus:border-[#a59682] transition-colors",
        mono && "font-mono"
      )}
    />
  )
}

function FieldArea({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      rows={3}
      className="w-full bg-vs-chip rounded-xl px-3 py-2 text-[12.5px] outline-none border border-vs-line-2 focus:border-[#a59682] transition-colors leading-relaxed resize-none"
    />
  )
}

function FieldSelect({
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

// ─── Drawer ────────────────────────────────────────────────────────────────────

export function ServicioDrawer({
  servicio: initial,
  mode: initialMode,
  onClose,
  onSave,
  onNuevaOT,
}: {
  servicio: Servicio
  mode: "view" | "edit"
  onClose: () => void
  onSave: (updated: Servicio) => void | Promise<void>
  onNuevaOT: () => void
}) {
  const [mode, setMode] = useState<"view" | "edit">(initialMode)
  const [draft, setDraft] = useState<Servicio>({ ...initial, incluye: [...initial.incluye] })
  const [error, setError] = useState<string | null>(null)

  const set = <K extends keyof Servicio>(key: K, val: Servicio[K]) =>
    setDraft(prev => ({ ...prev, [key]: val }))

  const setIncluyeItem = (i: number, val: string) =>
    setDraft(prev => {
      const next = [...prev.incluye]
      next[i] = val
      return { ...prev, incluye: next }
    })

  const addIncluye = () => setDraft(prev => ({ ...prev, incluye: [...prev.incluye, ""] }))

  const removeIncluye = (i: number) =>
    setDraft(prev => ({ ...prev, incluye: prev.incluye.filter((_, idx) => idx !== i) }))

  const toggleSkill = (skill: string) =>
    setDraft(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill],
    }))

  const cat = CATEGORIAS.find(c => c.key === draft.cat)!
  const isEdit = mode === "edit"

  const catOptions = CATEGORIAS.map(c => ({ value: c.key, label: c.label }))

  const handleSave = async () => {
    try {
      await onSave(draft)
      setError(null)
    } catch {
      setError("No se pudo guardar el servicio.")
    }
  }

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
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300"
              style={{ background: cat.bg, color: cat.fg }}
            >
              <CatIcon catKey={draft.cat} size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] text-[#8a7f70] uppercase tracking-widest">
                {isEdit ? "Editando servicio" : "Detalle"}
                <span className={isEdit ? "hidden" : undefined}>
                  {" · "}
                  <span className="font-mono">{draft.id}</span>
                </span>
              </div>
              <div className="text-[15px] font-semibold truncate">{draft.nombre}</div>
            </div>

            {!isEdit && (
              <button
                onClick={() => setMode("edit")}
                className="flex items-center gap-1.5 bg-vs-chip text-vs-ink px-3 py-1.5 rounded-full text-[12px] font-medium hover:bg-[#ebe3d6] active:scale-95 transition-all duration-150"
              >
                <Pencil size={13} strokeWidth={1.6} />
                Editar
              </button>
            )}
            {isEdit && (
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 bg-vs-ink text-white px-4 py-1.5 rounded-full text-[12px] font-medium hover:bg-[#1e2228] active:scale-95 transition-all duration-150"
              >
                <Check size={13} strokeWidth={2} />
                Guardar
              </button>
            )}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-vs-chip hover:bg-[#ebe3d6] flex items-center justify-center active:scale-90 transition-all duration-150 shrink-0"
            >
              <X size={16} strokeWidth={1.6} />
            </button>
          </div>

          <div className="p-5 space-y-5">
            {error && (
              <div className="rounded-xl border border-vs-warn bg-vs-warn-bg px-3 py-2 text-[12px] text-vs-warn">
                {error}
              </div>
            )}
            {/* Stats */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <StatBox
                label="Precio base"
                value={fmt(draft.precio)}
                sub={draft.precio2 ? `alt: ${fmt(draft.precio2)}` : "sin alterno"}
              />
              <StatBox label="Duración" value={`${draft.dur} min`} sub="estimada" />
              <StatBox label="OTs últ. 30d" value={draft.ots30} sub="ejecutadas" />
            </div>

            {/* Nombre */}
            <div>
              <FieldLabel required={isEdit}>Nombre del servicio</FieldLabel>
              {isEdit
                ? <FieldText value={draft.nombre} onChange={v => set("nombre", v)} />
                : <div className="text-[14px] font-semibold">{draft.nombre}</div>
              }
            </div>

            {/* Descripción */}
            <div>
              <FieldLabel required={isEdit}>Descripción</FieldLabel>
              {isEdit
                ? <FieldArea value={draft.desc} onChange={v => set("desc", v)} />
                : <div className="text-[13px] leading-relaxed text-[#4a4438] bg-vs-chip rounded-xl p-3 border border-vs-line-2">{draft.desc}</div>
              }
            </div>

            {/* Categoría + Código */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <FieldLabel required={isEdit}>Categoría</FieldLabel>
                {isEdit
                  ? <FieldSelect value={draft.cat} onChange={v => set("cat", v as CatKey)} options={catOptions} />
                  : (
                    <span
                      className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: cat.bg, color: cat.fg }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: cat.fg }} />
                      {cat.label}
                    </span>
                  )
                }
              </div>
              <div className={isEdit ? "hidden" : undefined}>
                <FieldLabel>Código</FieldLabel>
                <div className="text-[13px] font-mono font-semibold text-[#4a4438]">{draft.id}</div>
              </div>
            </div>

            {/* Precio, precio alt, duración */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <FieldLabel required={isEdit}>Precio (CLP)</FieldLabel>
                {isEdit
                  ? <FieldText value={String(draft.precio)} onChange={v => set("precio", parseInt(v.replace(/\D/g, "")) || 0)} mono />
                  : <div className="text-[13px] font-mono font-semibold">{fmt(draft.precio)}</div>
                }
              </div>
              <div>
                <FieldLabel>Precio alterno</FieldLabel>
                {isEdit
                  ? <FieldText value={draft.precio2 ? String(draft.precio2) : ""} onChange={v => set("precio2", v ? parseInt(v.replace(/\D/g, "")) : undefined)} mono placeholder="Opcional" />
                  : <div className="text-[13px] font-mono">{draft.precio2 ? fmt(draft.precio2) : "—"}</div>
                }
              </div>
              <div className={isEdit ? "hidden" : undefined}>
                <FieldLabel required={isEdit}>Duración (min)</FieldLabel>
                {isEdit
                  ? <FieldText value={String(draft.dur)} onChange={v => set("dur", parseInt(v) || 0)} mono />
                  : <div className="text-[13px] font-mono">{draft.dur} min</div>
                }
              </div>
            </div>

            {/* Incluye */}
            <div>
              <FieldLabel>Incluye</FieldLabel>
              <ul className="space-y-1.5">
                {draft.incluye.map((item, i) => (
                  <li key={i} className="flex min-w-0 items-center gap-2 vs-scale-in">
                    {isEdit ? (
                      <>
                        <input
                          value={item}
                          onChange={e => setIncluyeItem(i, e.target.value)}
                          className="min-w-0 flex-1 rounded-xl border border-vs-line-2 bg-vs-chip px-3 py-1.5 text-[12px] outline-none transition-colors focus:border-[#a59682]"
                        />
                        <button
                          onClick={() => removeIncluye(i)}
                          className="w-7 h-7 rounded-full bg-vs-chip hover:bg-vs-warn-bg hover:text-vs-warn flex items-center justify-center active:scale-90 transition-all duration-150 shrink-0"
                        >
                          <X size={12} strokeWidth={2} />
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="w-4 h-4 rounded-full bg-vs-good-bg text-vs-good flex items-center justify-center shrink-0">
                          <Check size={10} strokeWidth={3} />
                        </span>
                        <span className="text-[12.5px] text-[#4a4438]">{item}</span>
                      </>
                    )}
                  </li>
                ))}
              </ul>
              {isEdit && (
                <button
                  onClick={addIncluye}
                  className="mt-2 flex items-center gap-1.5 text-[12px] text-vs-violet hover:text-vs-ink bg-vs-violet-bg hover:bg-vs-chip px-3 py-1.5 rounded-full active:scale-95 transition-all duration-150"
                >
                  <Plus size={12} strokeWidth={2} />
                  Añadir ítem
                </button>
              )}
            </div>

            {/* Skills */}
            <div>
              <FieldLabel>Mecánicos habilitados</FieldLabel>
              {isEdit ? (
                <div className="flex flex-wrap gap-2">
                  {ALL_SKILLS.map(skill => (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={cn(
                        "flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-full border transition-all duration-150 active:scale-95",
                        draft.skills.includes(skill)
                          ? "bg-vs-ink text-white border-vs-ink"
                          : "bg-vs-chip text-[#4a4438] border-vs-line-2 hover:border-[#a59682]"
                      )}
                    >
                      {draft.skills.includes(skill) && <Check size={11} strokeWidth={2.5} />}
                      {skill}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {draft.skills.map((s, i) => (
                    <span key={i} className="bg-vs-chip px-2.5 py-1 rounded-full text-[11.5px] font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* View actions */}
            {!isEdit && (
              <div className="flex flex-wrap gap-2 border-t border-vs-line-2 pt-3">
                <button
                  onClick={onNuevaOT}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-vs-ink text-white px-4 py-2.5 rounded-full text-[12.5px] font-medium hover:bg-[#1e2228] active:scale-[0.98] transition-all duration-150 hidden"
                >
                  <Plus size={14} strokeWidth={2} />
                  Crear OT con este servicio
                </button>
                <button className="flex items-center gap-1.5 bg-vs-chip text-vs-ink px-4 py-2.5 rounded-full text-[12px] font-medium hover:bg-[#ebe3d6] active:scale-95 transition-all duration-150">
                  <Copy size={13} strokeWidth={1.6} />
                  Duplicar
                </button>
              </div>
            )}

            {/* Edit footer */}
            {isEdit && (
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-vs-line-2 pt-3">
                <label className="flex items-center gap-2 text-[12px] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={draft.activo}
                    onChange={e => set("activo", e.target.checked)}
                    className="accent-vs-ink w-4 h-4"
                  />
                  Servicio activo (visible en OTs)
                </label>
                <button className="flex items-center gap-1.5 text-[12px] text-vs-warn font-medium hover:bg-vs-warn-bg px-2 py-1 rounded-lg active:scale-95 transition-all duration-150">
                  <Trash2 size={13} strokeWidth={1.6} />
                  Archivar
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="h-5" />
      </div>
    </div>
  )
}

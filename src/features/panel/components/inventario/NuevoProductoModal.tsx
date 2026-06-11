"use client"

import { useState } from "react"
import { X, Plus, Package } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  CATEGORIAS, getCategoriaConfig,
  type Producto, type CatKey, type NuevoProductoPayload,
} from "./inventario.mock"
import { CatChip } from "./ProductoDrawer"

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
  value, onChange, placeholder, mono, error,
}: {
  value: string; onChange: (v: string) => void
  placeholder?: string; mono?: boolean; error?: boolean
}) {
  return (
    <input
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

// ─── Empty payload ─────────────────────────────────────────────────────────────

function emptyPayload(): NuevoProductoPayload {
  return {
    nombre: "",
    ref: "",
    cat: "transmision",
    costo: "",
    precio: "",
    stock: "",
    min: "",
    prov: "",
    ubic: "",
  }
}

// ─── Modal ─────────────────────────────────────────────────────────────────────

export function NuevoProductoModal({
  nextId,
  onClose,
  onCreate,
  saving = false,
}: {
  nextId: string
  onClose: () => void
  onCreate: (producto: Producto) => void | Promise<void>
  saving?: boolean
}) {
  const [form, setForm] = useState<NuevoProductoPayload>(emptyPayload)
  const [errors, setErrors] = useState<Set<string>>(new Set())
  const [submitError, setSubmitError] = useState<string | null>(null)

  const set = <K extends keyof NuevoProductoPayload>(key: K, val: NuevoProductoPayload[K]) => {
    setForm(prev => ({ ...prev, [key]: val }))
    setErrors(prev => { const n = new Set(prev); n.delete(key); return n })
  }

  const validate = () => {
    const required = ["nombre", "ref", "costo", "precio", "stock", "min"]
    const errs = new Set(required.filter(k => !form[k as keyof NuevoProductoPayload]?.toString().trim()))
    setErrors(errs)
    return errs.size === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSubmitError(null)
    const producto: Producto = {
      id: nextId,
      nombre: form.nombre.trim(),
      ref: form.ref.trim(),
      cat: form.cat,
      costo: parseInt(form.costo.replace(/\D/g, "")) || 0,
      precio: parseInt(form.precio.replace(/\D/g, "")) || 0,
      stock: parseInt(form.stock) || 0,
      min: parseInt(form.min) || 0,
      prov: form.prov.trim(),
      ubic: form.ubic.trim(),
    }
    try {
      await onCreate(producto)
    } catch {
      setSubmitError("No se pudo crear el producto.")
    }
  }

  const cat = getCategoriaConfig(form.cat)

  return (
    <div className="fixed inset-0 z-50 flex vs-fade-in">
      <div onClick={onClose} className="flex-1 bg-black/30 backdrop-blur-sm" />

      <div className="w-[520px] bg-vs-bg h-full overflow-y-auto flex flex-col vs-slide-in-right">
        <div className="bg-vs-card border border-vs-line rounded-[24px] m-3 mb-0">
          {/* Header */}
          <div className="flex items-center gap-3 p-5 border-b border-vs-line-2">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300"
              style={{ background: cat.bg, color: cat.fg }}
            >
              <Package size={20} strokeWidth={1.6} />
            </div>
            <div className="flex-1">
              <div className="text-[11px] text-[#8a7f70] uppercase tracking-widest">Nuevo producto</div>
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
          <div className="p-5 space-y-4">
            {/* Nombre */}
            <div>
              <FLabel required>Nombre del producto</FLabel>
              <FInput
                value={form.nombre}
                onChange={v => set("nombre", v)}
                placeholder="ej. Cadena Shimano CN-HG701"
                error={errors.has("nombre")}
              />
              {errors.has("nombre") && <p className="text-[11px] text-vs-warn mt-1">Campo requerido</p>}
            </div>

            {/* Ref + Categoría */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FLabel required>Referencia / SKU</FLabel>
                <FInput
                  value={form.ref}
                  onChange={v => set("ref", v)}
                  placeholder="ej. SH-CN-HG701"
                  mono
                  error={errors.has("ref")}
                />
                {errors.has("ref") && <p className="text-[11px] text-vs-warn mt-1">Requerido</p>}
              </div>
              <div>
                <FLabel required>Categoría</FLabel>
                <FSelect
                  value={form.cat}
                  onChange={v => set("cat", v as CatKey)}
                  options={CATEGORIAS.map(c => ({ value: c.key, label: c.label }))}
                />
                <div className="mt-1.5">
                  <CatChip catKey={form.cat} />
                </div>
              </div>
            </div>

            {/* Costo + Precio */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FLabel required>Costo unitario (CLP)</FLabel>
                <FInput
                  value={form.costo}
                  onChange={v => set("costo", v)}
                  placeholder="ej. 18900"
                  mono
                  error={errors.has("costo")}
                />
                {errors.has("costo") && <p className="text-[11px] text-vs-warn mt-1">Requerido</p>}
              </div>
              <div>
                <FLabel required>Precio asignado (CLP)</FLabel>
                <FInput
                  value={form.precio}
                  onChange={v => set("precio", v)}
                  placeholder="ej. 27900"
                  mono
                  error={errors.has("precio")}
                />
                {errors.has("precio") && <p className="text-[11px] text-vs-warn mt-1">Requerido</p>}
              </div>
            </div>

            {/* Stock + Mínimo */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FLabel required>Stock inicial</FLabel>
                <FInput
                  value={form.stock}
                  onChange={v => set("stock", v)}
                  placeholder="ej. 14"
                  mono
                  error={errors.has("stock")}
                />
                {errors.has("stock") && <p className="text-[11px] text-vs-warn mt-1">Requerido</p>}
              </div>
              <div>
                <FLabel required>Stock mínimo</FLabel>
                <FInput
                  value={form.min}
                  onChange={v => set("min", v)}
                  placeholder="ej. 6"
                  mono
                  error={errors.has("min")}
                />
                {errors.has("min") && <p className="text-[11px] text-vs-warn mt-1">Requerido</p>}
              </div>
            </div>

            {/* Proveedor + Ubicación */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FLabel>Proveedor</FLabel>
                <FInput value={form.prov} onChange={v => set("prov", v)} placeholder="ej. Bicisport SpA" />
              </div>
              <div>
                <FLabel>Ubicación</FLabel>
                <FInput value={form.ubic} onChange={v => set("ubic", v)} placeholder="ej. A-03-12" mono />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-3 p-5 border-t border-vs-line-2 bg-[#faf6f0] rounded-b-[24px]">
            <div className="text-[11.5px] text-[#8a7f70]">
              {submitError ? (
                <span className="font-semibold text-vs-warn">{submitError}</span>
              ) : (
                <>
                  Categoría:{" "}
                  <span className="font-semibold" style={{ color: cat.fg }}>{cat.label}</span>
                </>
              )}
            </div>
            <div className="flex-1" />
            <button
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 rounded-full bg-vs-chip text-vs-ink text-[13px] font-medium hover:bg-[#ebe3d6] active:scale-95 transition-all duration-150"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-vs-ink text-white text-[13px] font-medium hover:bg-[#1e2228] active:scale-95 disabled:opacity-60 transition-all duration-150"
            >
              <Plus size={15} strokeWidth={2} />
              {saving ? "Creando..." : "Crear producto"}
            </button>
          </div>
        </div>
        <div className="h-5" />
      </div>
    </div>
  )
}

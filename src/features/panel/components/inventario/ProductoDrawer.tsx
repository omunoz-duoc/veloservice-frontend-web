"use client"

import { useState } from "react"
import { X, Check, Pencil, Package, TrendingUp, Plus, Minus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  CATEGORIAS, MOVIMIENTOS_MOCK, fmt, margen,
  type Producto, type CatKey,
} from "./inventario.mock"

// ─── Shared ────────────────────────────────────────────────────────────────────

function StatBox({ label, value, sub }: { label: string; value: string | number; sub: string }) {
  return (
    <div className="bg-vs-chip rounded-xl p-3 border border-vs-line-2">
      <div className="text-[10.5px] text-[#8a7f70]">{label}</div>
      <div className="text-[18px] font-semibold font-mono leading-tight">{value}</div>
      <div className="text-[10px] text-[#a59682] truncate">{sub}</div>
    </div>
  )
}

function FLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <div className="text-[11px] text-[#8a7f70] mb-1.5">
      {children}
      {required && <span className="text-vs-warn ml-0.5">*</span>}
    </div>
  )
}

function FInput({
  value, onChange, placeholder, mono, readOnly,
}: {
  value: string | number; onChange?: (v: string) => void
  placeholder?: string; mono?: boolean; readOnly?: boolean
}) {
  return (
    <input
      value={value}
      onChange={e => onChange?.(e.target.value)}
      placeholder={placeholder}
      readOnly={readOnly}
      className={cn(
        "w-full bg-vs-chip rounded-xl px-3 py-2 text-[12.5px] outline-none border border-vs-line-2 transition-colors",
        mono && "font-mono font-semibold",
        readOnly ? "text-[#a59682] cursor-not-allowed" : "focus:border-[#a59682]"
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

export function CatChip({ catKey }: { catKey: CatKey }) {
  const c = CATEGORIAS.find(x => x.key === catKey)!
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full"
      style={{ background: c.bg, color: c.fg }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.fg }} />
      {c.label}
    </span>
  )
}

export function StockBadge({ stock, min }: { stock: number; min: number }) {
  if (stock === 0) return (
    <span className="text-[10.5px] font-semibold px-1.5 py-0.5 rounded bg-vs-warn-bg text-vs-warn">AGOTADO</span>
  )
  if (stock < min) return (
    <span className="text-[10.5px] font-semibold px-1.5 py-0.5 rounded bg-vs-warn-bg text-vs-warn">BAJO</span>
  )
  return (
    <span className="text-[10.5px] font-semibold px-1.5 py-0.5 rounded bg-vs-good-bg text-vs-good">OK</span>
  )
}

// ─── Drawer ────────────────────────────────────────────────────────────────────

export type DrawerMode = "view" | "edit"

export function ProductoDrawer({
  producto: initial,
  mode: initialMode,
  onClose,
  onSave,
}: {
  producto: Producto
  mode: DrawerMode
  onClose: () => void
  onSave: (updated: Producto) => void
}) {
  const [mode, setMode] = useState<DrawerMode>(initialMode)
  const [draft, setDraft] = useState<Producto>({ ...initial })

  const set = <K extends keyof Producto>(key: K, val: Producto[K]) =>
    setDraft(prev => ({ ...prev, [key]: val }))

  const cat = CATEGORIAS.find(c => c.key === draft.cat)!
  const isEdit = mode === "edit"
  const m = margen(draft.precio, draft.costo)

  return (
    <div className="fixed inset-0 z-50 flex vs-fade-in">
      <div onClick={onClose} className="flex-1 bg-black/30 backdrop-blur-sm" />

      <div className="w-[540px] bg-vs-bg h-full overflow-y-auto flex flex-col vs-slide-in-right">
        <div className="bg-vs-card border border-vs-line rounded-[24px] m-3 mb-0">
          {/* Header */}
          <div className="flex items-center gap-3 p-5 border-b border-vs-line-2">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: cat.bg, color: cat.fg }}
            >
              <Package size={20} strokeWidth={1.6} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] text-[#8a7f70] uppercase tracking-widest">
                {isEdit ? "Editando producto" : "Detalle de producto"} · <span className="font-mono">{draft.id}</span>
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
                onClick={() => onSave(draft)}
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
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <StatBox label="Margen" value={`${m}%`} sub={`${fmt(draft.precio - draft.costo)} ganancia`} />
              <StatBox label="Stock actual" value={draft.stock} sub={`mín ${draft.min}`} />
              <StatBox
                label="Valor inventario"
                value={`$${((draft.stock * draft.costo) / 1000).toFixed(0)}K`}
                sub="a costo"
              />
            </div>

            {/* Nombre */}
            <div>
              <FLabel required={isEdit}>Nombre</FLabel>
              {isEdit
                ? <FInput value={draft.nombre} onChange={v => set("nombre", v)} />
                : <div className="text-[13px] font-semibold">{draft.nombre}</div>
              }
            </div>

            {/* Ref + Categoría */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FLabel required={isEdit}>Referencia / SKU</FLabel>
                {isEdit
                  ? <FInput value={draft.ref} onChange={v => set("ref", v)} mono />
                  : <div className="text-[13px] font-mono font-semibold">{draft.ref}</div>
                }
              </div>
              <div>
                <FLabel required={isEdit}>Categoría</FLabel>
                {isEdit
                  ? <FSelect
                      value={draft.cat}
                      onChange={v => set("cat", v as CatKey)}
                      options={CATEGORIAS.map(c => ({ value: c.key, label: c.label }))}
                    />
                  : <CatChip catKey={draft.cat} />
                }
              </div>
            </div>

            {/* Costo + Precio */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FLabel required={isEdit}>Costo unitario</FLabel>
                {isEdit
                  ? <FInput value={draft.costo} onChange={v => set("costo", parseInt(v.replace(/\D/g, "")) || 0)} mono />
                  : <div className="text-[13px] font-mono text-[#8a7f70]">{fmt(draft.costo)}</div>
                }
              </div>
              <div>
                <FLabel required={isEdit}>Precio asignado</FLabel>
                {isEdit
                  ? <FInput value={draft.precio} onChange={v => set("precio", parseInt(v.replace(/\D/g, "")) || 0)} mono />
                  : <div className="text-[13px] font-mono font-semibold">{fmt(draft.precio)}</div>
                }
              </div>
            </div>

            {/* Stock mín + Ubicación */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FLabel required={isEdit}>Stock mínimo</FLabel>
                {isEdit
                  ? <FInput value={draft.min} onChange={v => set("min", parseInt(v) || 0)} mono />
                  : <div className="text-[13px] font-mono">{draft.min}</div>
                }
              </div>
              <div>
                <FLabel required={isEdit}>Ubicación</FLabel>
                {isEdit
                  ? <FInput value={draft.ubic} onChange={v => set("ubic", v)} mono />
                  : <div className="text-[13px] font-mono font-semibold">{draft.ubic}</div>
                }
              </div>
            </div>

            {/* Proveedor */}
            <div>
              <FLabel required={isEdit}>Proveedor</FLabel>
              {isEdit
                ? <FInput value={draft.prov} onChange={v => set("prov", v)} />
                : <div className="text-[13px] font-medium">{draft.prov}</div>
              }
            </div>

            {/* View-only: stock actions + movements */}
            {!isEdit && (
              <>
                <div className="pt-3 border-t border-vs-line-2">
                  <div className="text-[11px] text-[#8a7f70] uppercase tracking-widest mb-3">Ajustar stock</div>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 bg-vs-chip text-vs-ink px-4 py-2 rounded-full text-[12px] font-medium hover:bg-[#ebe3d6] active:scale-95 transition-all duration-150">
                      <Minus size={12} strokeWidth={2} />
                      Salida
                    </button>
                    <button className="flex items-center gap-1.5 bg-vs-chip text-vs-ink px-4 py-2 rounded-full text-[12px] font-medium hover:bg-[#ebe3d6] active:scale-95 transition-all duration-150">
                      <Plus size={12} strokeWidth={2} />
                      Entrada
                    </button>
                    <button className="flex items-center gap-1.5 bg-vs-chip text-vs-ink px-4 py-2 rounded-full text-[12px] font-medium hover:bg-[#ebe3d6] active:scale-95 transition-all duration-150">
                      <TrendingUp size={12} strokeWidth={1.6} />
                      Orden compra
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t border-vs-line-2">
                  <div className="text-[11px] text-[#8a7f70] uppercase tracking-widest mb-3">Movimientos recientes</div>
                  <ul className="space-y-2">
                    {MOVIMIENTOS_MOCK.map((h, i) => (
                      <li key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-vs-chip border border-vs-line-2 vs-scale-in">
                        <div className="flex-1 min-w-0">
                          <div className="text-[12px] font-medium truncate">{h.texto}</div>
                          <div className="text-[10.5px] text-[#a59682] font-mono">{h.fecha}</div>
                        </div>
                        <span className={cn("text-[12px] font-mono font-semibold", h.qty < 0 ? "text-vs-warn" : "text-vs-good")}>
                          {h.qty > 0 ? "+" : ""}{h.qty}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {/* Edit-only: descatalogar */}
            {isEdit && (
              <div className="pt-3 border-t border-vs-line-2">
                <button className="flex items-center gap-1.5 text-[12px] text-vs-warn font-medium hover:bg-vs-warn-bg px-2 py-1 rounded-lg active:scale-95 transition-all duration-150">
                  <Trash2 size={13} strokeWidth={1.6} />
                  Descatalogar producto
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

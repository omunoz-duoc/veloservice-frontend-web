"use client"

import { useState, useMemo } from "react"
import { Search, Plus, Filter, Package, Bell, TrendingUp, ChevronLeft, ChevronRight, Barcode, Building2, Eye, Pencil, PlusCircle, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  PRODUCTOS_MOCK, CATEGORIAS, fmt, margen, stockEstado, nextProductoId,
  type Producto,
} from "./inventario.mock"
import { ProductoDrawer, CatChip, StockBadge, type DrawerMode } from "./ProductoDrawer"
import { NuevoProductoModal } from "./NuevoProductoModal"

// ─── Mini stat card ────────────────────────────────────────────────────────────

type Tone = "violet" | "good" | "warn" | "info"

const TONES: Record<Tone, { fg: string; bg: string }> = {
  violet: { fg: "var(--vs-violet, #6b5bd1)", bg: "var(--vs-violet-bg, #ebe7fa)" },
  good:   { fg: "var(--vs-good, #2f7d4f)",   bg: "var(--vs-good-bg, #e4f1e8)"  },
  warn:   { fg: "var(--vs-warn, #c85a2a)",    bg: "var(--vs-warn-bg, #fbeadd)"  },
  info:   { fg: "var(--vs-info, #3a6ea5)",    bg: "var(--vs-info-bg, #e4eaf2)"  },
}

function MiniStat({ label, value, icon, tone }: { label: string; value: string | number; icon: React.ReactNode; tone: Tone }) {
  const t = TONES[tone]
  return (
    <div className="bg-vs-card border border-vs-line rounded-[18px] p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: t.bg, color: t.fg }}>
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-[11px] text-[#8a7f70]">{label}</div>
        <div className="text-[18px] font-semibold font-mono leading-tight truncate">{value}</div>
      </div>
    </div>
  )
}

// ─── Table helpers ─────────────────────────────────────────────────────────────

function Th({ children, right }: { children?: React.ReactNode; right?: boolean }) {
  return (
    <th className={cn("px-4 py-3 text-[11px] uppercase tracking-widest text-[#a59682] font-medium", right && "text-right")}>
      {children}
    </th>
  )
}

function ProductoRow({
  p, selected, onSelect, onView, onEdit,
}: {
  p: Producto
  selected: boolean
  onSelect: () => void
  onView: () => void
  onEdit: () => void
}) {
  const cat = CATEGORIAS.find(c => c.key === p.cat)!
  const m = margen(p.precio, p.costo)

  return (
    <tr className="border-b border-vs-line-2 hover:bg-[#faf7f1] transition-colors duration-100">
      <td className="px-4 py-3.5 align-middle">
        <input type="checkbox" checked={selected} onChange={onSelect} className="w-4 h-4 rounded accent-vs-ink" />
      </td>
      <td className="px-4 py-3.5 align-middle">
        <span className="font-mono font-semibold text-[12.5px]">{p.id}</span>
      </td>
      <td className="px-4 py-3.5 align-middle">
        <div className="flex items-start gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: cat.bg, color: cat.fg }}
          >
            <Package size={16} strokeWidth={1.6} />
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-semibold truncate max-w-[280px]">{p.nombre}</div>
            <div className="text-[10.5px] text-[#8a7f70] mt-0.5 flex items-center gap-1.5">
              <Building2 size={11} strokeWidth={1.6} className="text-[#a59682] shrink-0" />
              <span>{p.prov}</span>
              <span className="text-[#c7bba6]">·</span>
              <span className="font-mono">{p.ubic}</span>
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3.5 align-middle">
        <div className="flex items-center gap-1.5 text-[11.5px] font-mono text-[#4a4438]">
          <Barcode size={12} strokeWidth={1.6} className="text-[#a59682] shrink-0" />
          {p.ref}
        </div>
      </td>
      <td className="px-4 py-3.5 align-middle">
        <CatChip catKey={p.cat} />
      </td>
      <td className="px-4 py-3.5 align-middle text-right">
        <div className="text-[12.5px] font-mono text-[#8a7f70]">{fmt(p.costo)}</div>
      </td>
      <td className="px-4 py-3.5 align-middle text-right">
        <div className="text-[13px] font-semibold font-mono">{fmt(p.precio)}</div>
        <div className="text-[10px] text-vs-good mt-0.5">+{m}% margen</div>
      </td>
      <td className="px-4 py-3.5 align-middle">
        <div className="flex items-center gap-1.5">
          <span className="text-[13px] font-semibold font-mono">{p.stock}</span>
          <span className="text-[10.5px] text-[#a59682]">/ {p.min} mín</span>
          <StockBadge stock={p.stock} min={p.min} />
        </div>
      </td>
      <td className="px-4 py-3.5 align-middle">
        <div className="flex items-center gap-1 justify-end">
          <button
            onClick={onView}
            title="Ver detalle"
            className="w-8 h-8 rounded-full bg-vs-chip hover:bg-[#ebe3d6] flex items-center justify-center text-vs-ink active:scale-90 transition-all duration-150"
          >
            <Eye size={13} strokeWidth={1.6} />
          </button>
          <button
            onClick={onEdit}
            title="Editar"
            className="w-8 h-8 rounded-full bg-vs-chip hover:bg-[#ebe3d6] flex items-center justify-center text-vs-ink active:scale-90 transition-all duration-150"
          >
            <Pencil size={12} strokeWidth={1.6} />
          </button>
          <button
            title="Ajustar stock"
            className="w-8 h-8 rounded-full bg-vs-chip hover:bg-[#ebe3d6] flex items-center justify-center text-vs-violet active:scale-90 transition-all duration-150"
          >
            <PlusCircle size={13} strokeWidth={1.6} />
          </button>
          <button
            title="Más"
            className="w-8 h-8 rounded-full bg-vs-chip hover:bg-[#ebe3d6] flex items-center justify-center text-vs-ink active:scale-90 transition-all duration-150"
          >
            <MoreHorizontal size={13} strokeWidth={1.6} />
          </button>
        </div>
      </td>
    </tr>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export function InventarioPage() {
  const [productos, setProductos] = useState<Producto[]>(PRODUCTOS_MOCK)
  const [tab, setTab] = useState<"all" | "ok" | "low" | "out">("all")
  const [query, setQuery] = useState("")
  const [sel, setSel] = useState<Set<string>>(new Set())
  const [drawer, setDrawer] = useState<{ producto: Producto; mode: DrawerMode } | null>(null)
  const [showModal, setShowModal] = useState(false)

  const counts = useMemo(() => {
    const c = { all: productos.length, low: 0, out: 0, ok: 0 }
    productos.forEach(p => {
      const e = stockEstado(p.stock, p.min)
      if (e === "out") c.out++
      else if (e === "low") c.low++
      else c.ok++
    })
    return c
  }, [productos])

  const valorTotal = useMemo(() => productos.reduce((a, p) => a + p.stock * p.costo, 0), [productos])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const catLabel = (cat: string) => CATEGORIAS.find(c => c.key === cat)?.label ?? ""
    return productos.filter(p => {
      if (tab === "out" && p.stock !== 0) return false
      if (tab === "low" && !(p.stock > 0 && p.stock < p.min)) return false
      if (tab === "ok" && !(p.stock >= p.min)) return false
      if (q) {
        const hay = (p.id + " " + p.nombre + " " + p.ref + " " + p.prov + " " + catLabel(p.cat)).toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [productos, tab, query])

  const toggleSel = (id: string) =>
    setSel(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })

  const toggleAll = () =>
    setSel(prev => prev.size === filtered.length ? new Set() : new Set(filtered.map(p => p.id)))

  const allSelected = filtered.length > 0 && sel.size === filtered.length

  const addProducto = (p: Producto) => {
    setProductos(prev => [p, ...prev])
    setShowModal(false)
  }

  const updateProducto = (updated: Producto) => {
    setProductos(prev => prev.map(p => p.id === updated.id ? updated : p))
    setDrawer(null)
  }

  const tabs = [
    { k: "all", l: "Todos",      c: counts.all },
    { k: "ok",  l: "En stock",   c: counts.ok },
    { k: "low", l: "Stock bajo", c: counts.low },
    { k: "out", l: "Agotados",   c: counts.out },
  ]

  return (
    <div className="p-6">
      {/* Page header */}
      <div className="flex items-end justify-between mb-5">
        <div>
          <h1 className="text-[26px] font-semibold tracking-tight">Inventario</h1>
          <p className="text-[13px] text-[#8a7f70] mt-1">
            {productos.length} productos · Valor total {fmt(valorTotal)} · {counts.low + counts.out} alertas de stock
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-vs-chip text-vs-ink px-4 py-2 rounded-full text-[13px] font-medium hover:bg-[#ebe3d6] active:scale-95 transition-all duration-150">
            Importar CSV
          </button>
          <button className="flex items-center gap-2 bg-vs-chip text-vs-ink px-4 py-2 rounded-full text-[13px] font-medium hover:bg-[#ebe3d6] active:scale-95 transition-all duration-150">
            Exportar
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-vs-ink text-white pl-4 pr-4 py-2 rounded-full text-[13px] font-medium hover:bg-[#1e2228] active:scale-95 transition-all duration-150"
          >
            <Plus size={15} strokeWidth={2} />
            Nuevo producto
          </button>
        </div>
      </div>

      {/* Mini stats */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <MiniStat label="Valor inventario" value={fmt(valorTotal)} icon={<TrendingUp size={18} strokeWidth={1.6} />} tone="violet" />
        <MiniStat label="En stock" value={counts.ok} icon={<Package size={18} strokeWidth={1.6} />} tone="good" />
        <MiniStat label="Stock bajo" value={counts.low} icon={<Bell size={18} strokeWidth={1.6} />} tone="warn" />
        <MiniStat label="Agotados" value={counts.out} icon={<Bell size={18} strokeWidth={1.6} />} tone="warn" />
      </div>

      {/* Filter bar */}
      <div className="bg-vs-card border border-vs-line rounded-[20px] p-3 mb-4 flex items-center gap-2 flex-wrap">
        <div className="flex gap-1 bg-vs-chip p-1 rounded-full">
          {tabs.map(t => (
            <button
              key={t.k}
              onClick={() => setTab(t.k as typeof tab)}
              className={cn(
                "text-[12px] px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5 whitespace-nowrap transition-all duration-150",
                tab === t.k ? "bg-white shadow-sm text-vs-ink" : "text-[#8a7f70] hover:text-vs-ink"
              )}
            >
              {t.l}
              <span className={cn("text-[10.5px] font-mono px-1.5 rounded-md", tab === t.k ? "bg-[#ece7de]" : "bg-white/60")}>
                {String(t.c).padStart(2, "0")}
              </span>
            </button>
          ))}
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2 bg-vs-chip px-3 py-1.5 rounded-full min-w-[260px]">
          <Search size={14} strokeWidth={1.6} className="text-[#a59682] shrink-0" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar producto, SKU, proveedor…"
            className="bg-transparent outline-none text-[12.5px] flex-1 placeholder:text-[#a59682]"
          />
        </div>

        <button className="flex items-center gap-1.5 bg-vs-chip text-vs-ink px-3 py-1.5 rounded-full text-[12px] font-medium hover:bg-[#ebe3d6] active:scale-95 transition-all duration-150">
          <Filter size={12} strokeWidth={1.6} />
          Categoría
        </button>
        <button className="flex items-center gap-1.5 bg-vs-chip text-vs-ink px-3 py-1.5 rounded-full text-[12px] font-medium hover:bg-[#ebe3d6] active:scale-95 transition-all duration-150">
          <Building2 size={12} strokeWidth={1.6} />
          Proveedor
        </button>
      </div>

      {/* Bulk bar */}
      {sel.size > 0 && (
        <div className="bg-vs-ink text-white border border-vs-ink rounded-[16px] px-4 py-2.5 mb-3 flex items-center gap-3 vs-scale-in">
          <span className="text-[12.5px] font-semibold">{sel.size} seleccionado{sel.size > 1 ? "s" : ""}</span>
          <div className="flex-1" />
          <button className="text-[12px] px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors">Generar OC</button>
          <button className="text-[12px] px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors">Ajustar precios</button>
          <button className="text-[12px] px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors">Exportar</button>
          <button onClick={() => setSel(new Set())} className="text-[12px] px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors">Cancelar</button>
        </div>
      )}

      {/* Table */}
      <div className="bg-vs-card border border-vs-line rounded-[20px] overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#faf6f0] border-b border-vs-line">
              <th className="px-4 py-3 w-10">
                <input type="checkbox" checked={allSelected} onChange={toggleAll} className="w-4 h-4 rounded accent-vs-ink" />
              </th>
              <Th>Producto ID</Th>
              <Th>Nombre</Th>
              <Th>Referencia</Th>
              <Th>Categoría</Th>
              <Th right>Costo unit.</Th>
              <Th right>Precio asignado</Th>
              <Th>Stock</Th>
              <Th right>Acciones</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <ProductoRow
                key={p.id}
                p={p}
                selected={sel.has(p.id)}
                onSelect={() => toggleSel(p.id)}
                onView={() => setDrawer({ producto: p, mode: "view" })}
                onEdit={() => setDrawer({ producto: p, mode: "edit" })}
              />
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center py-12 text-[#8a7f70] text-[13px]">
                  Sin resultados para los filtros actuales.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Footer */}
        <div className="flex items-center gap-3 px-4 py-3 border-t border-vs-line-2 bg-[#faf6f0]">
          <div className="text-[12px] text-[#8a7f70]">
            Mostrando <b className="font-mono text-vs-ink">{filtered.length}</b> de{" "}
            <b className="font-mono text-vs-ink">{productos.length}</b> productos
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 rounded-full bg-vs-chip flex items-center justify-center text-[#8a7f70] hover:bg-[#ebe3d6] transition-colors">
              <ChevronLeft size={14} strokeWidth={1.6} />
            </button>
            <button className="w-8 h-8 rounded-full bg-vs-ink text-white text-[12px] font-semibold flex items-center justify-center">1</button>
            <button className="w-8 h-8 rounded-full bg-vs-chip text-[12px] font-semibold flex items-center justify-center hover:bg-[#ebe3d6] transition-colors">2</button>
            <button className="w-8 h-8 rounded-full bg-vs-chip text-[12px] font-semibold flex items-center justify-center hover:bg-[#ebe3d6] transition-colors">3</button>
            <button className="w-8 h-8 rounded-full bg-vs-chip flex items-center justify-center text-[#8a7f70] hover:bg-[#ebe3d6] transition-colors">
              <ChevronRight size={14} strokeWidth={1.6} />
            </button>
          </div>
        </div>
      </div>

      <div className="text-[11px] text-[#a59682] text-center py-4">
        VeloService · v2.4.1 · Última sincronización hace 3 seg
      </div>

      {/* Drawer */}
      {drawer && (
        <ProductoDrawer
          producto={drawer.producto}
          mode={drawer.mode}
          onClose={() => setDrawer(null)}
          onSave={updateProducto}
        />
      )}

      {/* Modal */}
      {showModal && (
        <NuevoProductoModal
          nextId={nextProductoId(productos)}
          onClose={() => setShowModal(false)}
          onCreate={addProducto}
        />
      )}
    </div>
  )
}

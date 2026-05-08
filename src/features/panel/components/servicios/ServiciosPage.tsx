"use client"

import { useState, useMemo } from "react"
import {
  Plus, Search, LayoutGrid, List, ChevronDown,
  Eye, Pencil, Copy, MoreHorizontal, Check, Sparkles,
  Wrench, Circle, Flame, Smile, Package, type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { PageHeader } from "@/components/common/PageHeader"
import {
  CATEGORIAS, SERVICIOS_MOCK, fmt, nextServicioId,
  type CatKey, type Servicio,
} from "./servicios.mock"
import { ServicioDrawer } from "./ServicioDrawer"
import { NuevoServicioModal } from "./NuevoServicioModal"

// ─── Category icon map ─────────────────────────────────────────────────────────

const CAT_ICONS: Record<CatKey, LucideIcon> = {
  rapidos:    Sparkles,
  mantencion: Wrench,
  ruedas:     Circle,
  ebike:      Flame,
  kids:       Smile,
  logistica:  Package,
}

export function CatIcon({ catKey, size = 18 }: { catKey: CatKey; size?: number }) {
  const Icon = CAT_ICONS[catKey]
  return <Icon size={size} strokeWidth={1.6} />
}

// ─── Service card (grid view) ──────────────────────────────────────────────────

function ServicioCard({
  servicio,
  onView,
  onEdit,
}: {
  servicio: Servicio
  onView: () => void
  onEdit: () => void
}) {
  const cat = CATEGORIAS.find(c => c.key === servicio.cat)!
  return (
    <div
      onClick={onView}
      className="bg-vs-card border border-vs-line rounded-[20px] p-4 cursor-pointer group
                 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:border-vs-violet
                 active:translate-y-0 active:shadow-none
                 transition-all duration-200 vs-scale-in"
    >
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110"
          style={{ background: cat.bg, color: cat.fg }}
        >
          <CatIcon catKey={servicio.cat} size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-mono text-[10.5px] text-[#a59682]">{servicio.id}</span>
            {servicio.popular && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#faecd6] text-[#8c6a1e] vs-scale-in">
                POPULAR
              </span>
            )}
            {!servicio.activo && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-vs-warn-bg text-vs-warn">
                INACTIVO
              </span>
            )}
          </div>
          <div className="text-[14px] font-semibold mt-0.5 leading-tight">{servicio.nombre}</div>
        </div>
        <button
          onClick={e => { e.stopPropagation(); onEdit() }}
          className="w-8 h-8 rounded-full bg-vs-chip hover:bg-[#ebe3d6] flex items-center justify-center text-[#2b2f36]
                     opacity-0 group-hover:opacity-100 active:scale-90 transition-all duration-150 shrink-0"
        >
          <Pencil size={13} strokeWidth={1.6} />
        </button>
      </div>

      <div className="text-[12px] text-[#8a7f70] mt-3 leading-relaxed line-clamp-2">
        {servicio.desc}
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-vs-line-2">
        <div>
          <div className="text-[10.5px] text-[#a59682]">Precio</div>
          <div className="text-[15px] font-semibold font-mono leading-none">
            {fmt(servicio.precio)}
            {servicio.precio2 && (
              <span className="text-[11px] text-[#a59682] ml-1">/ {fmt(servicio.precio2)}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-[#8a7f70] bg-vs-chip px-2.5 py-1 rounded-full">
          <Circle size={11} strokeWidth={1.6} className="text-[#a59682]" />
          <span className="font-mono">{servicio.dur} min</span>
        </div>
      </div>
    </div>
  )
}

// ─── Service list row ──────────────────────────────────────────────────────────

function ServicioRow({
  servicio,
  onView,
  onEdit,
}: {
  servicio: Servicio
  onView: () => void
  onEdit: () => void
}) {
  return (
    <tr className="border-b border-vs-line-2 hover:bg-[#faf6f0] transition-colors group">
      <td className="px-4 py-3.5 align-middle font-mono font-semibold text-[12.5px]">
        {servicio.id}
      </td>
      <td className="px-4 py-3.5 align-middle">
        <div className="text-[13px] font-semibold">{servicio.nombre}</div>
        <div className="text-[11px] text-[#8a7f70] line-clamp-1 max-w-[360px]">{servicio.desc}</div>
      </td>
      <td className="px-4 py-3.5 align-middle">
        <div className="flex flex-wrap gap-1 max-w-[260px]">
          {servicio.incluye.slice(0, 2).map((item, i) => (
            <span key={i} className="text-[10.5px] bg-vs-chip px-2 py-0.5 rounded-full">{item}</span>
          ))}
          {servicio.incluye.length > 2 && (
            <span className="text-[10.5px] text-[#8a7f70]">+{servicio.incluye.length - 2}</span>
          )}
        </div>
      </td>
      <td className="px-4 py-3.5 align-middle text-right font-mono text-[12.5px]">
        {servicio.dur} min
      </td>
      <td className="px-4 py-3.5 align-middle text-right">
        <div className="text-[13px] font-semibold font-mono">{fmt(servicio.precio)}</div>
        {servicio.precio2 && (
          <div className="text-[10px] text-[#a59682]">/ {fmt(servicio.precio2)}</div>
        )}
      </td>
      <td className="px-4 py-3.5 align-middle">
        <div className="flex items-center gap-1 flex-wrap">
          {servicio.activo
            ? <span className="text-[10.5px] font-semibold px-1.5 py-0.5 rounded bg-vs-good-bg text-vs-good">ACTIVO</span>
            : <span className="text-[10.5px] font-semibold px-1.5 py-0.5 rounded bg-vs-warn-bg text-vs-warn">INACTIVO</span>
          }
          {servicio.popular && (
            <span className="text-[10.5px] font-semibold px-1.5 py-0.5 rounded bg-[#faecd6] text-[#8c6a1e]">POPULAR</span>
          )}
        </div>
      </td>
      <td className="px-4 py-3.5 align-middle">
        <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <button
            onClick={onView}
            className="w-8 h-8 rounded-full bg-vs-chip hover:bg-[#ebe3d6] flex items-center justify-center text-[#2b2f36] active:scale-90 transition-all"
          >
            <Eye size={13} strokeWidth={1.6} />
          </button>
          <button
            onClick={onEdit}
            className="w-8 h-8 rounded-full bg-vs-chip hover:bg-[#ebe3d6] flex items-center justify-center text-[#2b2f36] active:scale-90 transition-all"
          >
            <Pencil size={13} strokeWidth={1.6} />
          </button>
          <button className="w-8 h-8 rounded-full bg-vs-chip hover:bg-vs-violet-bg flex items-center justify-center text-vs-violet active:scale-90 transition-all">
            <Copy size={13} strokeWidth={1.6} />
          </button>
          <button className="w-8 h-8 rounded-full bg-vs-chip hover:bg-[#ebe3d6] flex items-center justify-center text-[#2b2f36] active:scale-90 transition-all">
            <MoreHorizontal size={13} strokeWidth={1.6} />
          </button>
        </div>
      </td>
    </tr>
  )
}

// ─── Category section ──────────────────────────────────────────────────────────

function CategorySection({
  catKey,
  items,
  view,
  collapsed,
  onToggle,
  onView,
  onEdit,
  onAdd,
}: {
  catKey: CatKey
  items: Servicio[]
  view: "grid" | "list"
  collapsed: boolean
  onToggle: () => void
  onView: (s: Servicio) => void
  onEdit: (s: Servicio) => void
  onAdd: () => void
}) {
  const cat = CATEGORIAS.find(c => c.key === catKey)!

  return (
    <section className="vs-scale-in">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-3">
        <button
          onClick={onToggle}
          className="w-7 h-7 rounded-full bg-vs-chip hover:bg-[#ebe3d6] flex items-center justify-center transition-all duration-200 active:scale-90 shrink-0"
          style={{ transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)" }}
        >
          <ChevronDown size={14} strokeWidth={1.8} />
        </button>

        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 hover:scale-105"
          style={{ background: cat.bg, color: cat.fg }}
        >
          <CatIcon catKey={catKey} size={17} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5">
            <h2 className="text-[15px] font-semibold tracking-tight">{cat.label}</h2>
            <span className="font-mono text-[11px] text-[#8a7f70] bg-vs-chip px-2 py-0.5 rounded-full">
              {items.length}
            </span>
          </div>
          <div className="text-[11.5px] text-[#a59682]">{cat.desc}</div>
        </div>

        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 text-[12px] bg-vs-chip text-[#4a4438] px-3 py-1.5 rounded-full
                     hover:bg-[#ebe3d6] active:scale-95 transition-all duration-150 shrink-0"
        >
          <Plus size={13} strokeWidth={2} />
          Añadir a {cat.label.toLowerCase()}
        </button>
      </div>

      {/* Collapsible content */}
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-in-out"
        style={{ gridTemplateRows: collapsed ? "0fr" : "1fr" }}
      >
        <div className="overflow-hidden">
          {view === "grid" ? (
            <div className="grid grid-cols-3 gap-3 pb-1">
              {items.map(s => (
                <ServicioCard
                  key={s.id}
                  servicio={s}
                  onView={() => onView(s)}
                  onEdit={() => onEdit(s)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-vs-card border border-vs-line rounded-[20px] overflow-hidden mb-1">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#faf6f0] border-b border-vs-line">
                    {["Código", "Servicio", "Incluye", "Duración", "Precio", "Estado"].map(h => (
                      <th key={h} className="px-4 py-3 text-[11px] uppercase tracking-widest text-[#a59682] font-medium">
                        {h}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-[11px] uppercase tracking-widest text-[#a59682] font-medium text-right">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(s => (
                    <ServicioRow
                      key={s.id}
                      servicio={s}
                      onView={() => onView(s)}
                      onEdit={() => onEdit(s)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

type DrawerState = { servicio: Servicio; mode: "view" | "edit" } | null
type ModalState = { defaultCat?: CatKey } | null

export function ServiciosPage() {
  const [servicios, setServicios] = useState<Servicio[]>(SERVICIOS_MOCK)
  const [view, setView] = useState<"grid" | "list">("grid")
  const [activeTab, setActiveTab] = useState<"all" | CatKey>("all")
  const [query, setQuery] = useState("")
  const [collapsed, setCollapsed] = useState<Set<CatKey>>(new Set())
  const [drawer, setDrawer] = useState<DrawerState>(null)
  const [modal, setModal] = useState<ModalState>(null)

  const counts = useMemo(() => {
    const m: Record<string, number> = { all: servicios.length }
    CATEGORIAS.forEach(c => { m[c.key] = servicios.filter(s => s.cat === c.key).length })
    return m
  }, [servicios])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return servicios.filter(s => {
      if (activeTab !== "all" && s.cat !== activeTab) return false
      if (q) {
        const hay = [s.id, s.nombre, s.desc, ...s.incluye].join(" ").toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [servicios, activeTab, query])

  const grouped = useMemo(() => {
    const map: Record<CatKey, Servicio[]> = {
      rapidos: [], mantencion: [], ruedas: [], ebike: [], kids: [], logistica: [],
    }
    filtered.forEach(s => map[s.cat].push(s))
    return map
  }, [filtered])

  const toggleCollapse = (key: CatKey) =>
    setCollapsed(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })

  const handleSave = (updated: Servicio) => {
    setServicios(prev => prev.map(s => s.id === updated.id ? updated : s))
    setDrawer(null)
  }

  const handleCreate = (nuevo: Servicio) => {
    setServicios(prev => [...prev, nuevo])
    setModal(null)
  }

  const totalOTs = servicios.reduce((a, s) => a + s.ots30, 0)
  const ticketProm = Math.round(servicios.reduce((a, s) => a + s.precio * s.ots30, 0) / totalOTs)

  const tabs = [
    { key: "all" as const, label: "Todos", count: counts.all },
    ...CATEGORIAS.map(c => ({ key: c.key, label: c.label, count: counts[c.key] ?? 0 })),
  ]

  const ACTIONS = (
    <>
      <button className="bg-vs-chip text-vs-ink px-4 py-2 rounded-full text-[13px] font-medium hover:bg-[#ebe3d6] active:scale-95 transition-all duration-150">
        Importar
      </button>
      <button className="bg-vs-chip text-vs-ink px-4 py-2 rounded-full text-[13px] font-medium hover:bg-[#ebe3d6] active:scale-95 transition-all duration-150">
        Exportar
      </button>
      <button
        onClick={() => setModal({})}
        className="flex items-center gap-2 bg-vs-ink text-white px-4 py-2 rounded-full text-[13px] font-medium hover:bg-[#1e2228] active:scale-95 transition-all duration-150"
      >
        <Plus size={15} strokeWidth={2} />
        Nuevo servicio
      </button>
    </>
  )

  return (
    <div>
      <PageHeader
        breadcrumb={[{ label: "Panel", href: "/dashboard" }, { label: "Servicios" }]}
        title="Catálogo de servicios"
        subtitle={`${servicios.length} servicios activos · ${CATEGORIAS.length} categorías · Ticket promedio ${fmt(ticketProm)}`}
        actions={ACTIONS}
      />

      {/* Filter bar */}
      <div className="bg-vs-card border border-vs-line rounded-[24px] p-3 mb-5 flex items-center gap-2 flex-wrap">
        {/* Tab pills */}
        <div className="flex gap-1 bg-vs-chip p-1 rounded-full overflow-x-auto max-w-full shrink-0">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "text-[12px] px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5 whitespace-nowrap transition-all duration-200 active:scale-95",
                activeTab === tab.key
                  ? "bg-white shadow-sm text-vs-ink"
                  : "text-[#8a7f70] hover:text-vs-ink"
              )}
            >
              {tab.label}
              <span className={cn(
                "text-[10.5px] font-mono px-1.5 rounded-md transition-colors duration-200",
                activeTab === tab.key ? "bg-[#ece7de]" : "bg-white/60"
              )}>
                {String(tab.count).padStart(2, "0")}
              </span>
            </button>
          ))}
        </div>

        <div className="flex-1" />

        {/* Search */}
        <div className="flex items-center gap-2 bg-vs-chip px-3 py-1.5 rounded-full min-w-[240px] transition-shadow duration-200 focus-within:shadow-[0_0_0_2px_#6b5bd120]">
          <Search size={14} strokeWidth={1.6} className="text-[#a59682] shrink-0" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar servicio…"
            className="bg-transparent outline-none text-[12.5px] flex-1 placeholder:text-[#a59682]"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-[#a59682] hover:text-vs-ink transition-colors active:scale-90 vs-scale-in"
            >
              ×
            </button>
          )}
        </div>

        {/* View toggle */}
        <div className="flex bg-vs-chip p-1 rounded-full gap-0.5">
          <button
            onClick={() => setView("grid")}
            className={cn(
              "w-8 h-7 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90",
              view === "grid" ? "bg-white shadow-sm text-vs-ink" : "text-[#8a7f70] hover:text-vs-ink"
            )}
          >
            <LayoutGrid size={14} strokeWidth={1.6} />
          </button>
          <button
            onClick={() => setView("list")}
            className={cn(
              "w-8 h-7 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90",
              view === "list" ? "bg-white shadow-sm text-vs-ink" : "text-[#8a7f70] hover:text-vs-ink"
            )}
          >
            <List size={14} strokeWidth={1.6} />
          </button>
        </div>
      </div>

      {/* Grouped sections */}
      <div className="space-y-6">
        {CATEGORIAS.map(cat => {
          const items = grouped[cat.key]
          if (!items || items.length === 0) return null
          return (
            <CategorySection
              key={cat.key}
              catKey={cat.key}
              items={items}
              view={view}
              collapsed={collapsed.has(cat.key)}
              onToggle={() => toggleCollapse(cat.key)}
              onView={s => setDrawer({ servicio: s, mode: "view" })}
              onEdit={s => setDrawer({ servicio: s, mode: "edit" })}
              onAdd={() => setModal({ defaultCat: cat.key })}
            />
          )
        })}

        {filtered.length === 0 && (
          <div className="bg-vs-card border border-vs-line rounded-[24px] p-12 text-center text-[#8a7f70] text-[13px] vs-scale-in">
            Sin servicios para los filtros actuales.
          </div>
        )}
      </div>

      <div className="text-[11px] text-[#a59682] text-center py-6">
        VeloService · v2.4.1 · Última sincronización hace 2 seg
      </div>

      {drawer && (
        <ServicioDrawer
          servicio={drawer.servicio}
          mode={drawer.mode}
          onClose={() => setDrawer(null)}
          onSave={handleSave}
          onNuevaOT={() => setDrawer(null)}
        />
      )}

      {modal !== null && (
        <NuevoServicioModal
          defaultCat={modal.defaultCat}
          nextId={nextServicioId(servicios)}
          onClose={() => setModal(null)}
          onCreate={handleCreate}
        />
      )}
    </div>
  )
}

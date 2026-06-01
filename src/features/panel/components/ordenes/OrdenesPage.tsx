"use client"

import { useState, useMemo } from "react"
import { PageHeader } from "@/components/common/PageHeader"
import {
  Plus, Search, SlidersHorizontal, Wrench, Calendar,
  Eye, Pencil, MoreHorizontal, ChevronLeft, ChevronRight, ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  MECANICOS_MOCK, TIPO_CONFIG, ESTADO_CONFIG,
  type OrdenTrabajo, type EstadoOT, type TipoOT,
} from "./ordenes.mock"
import { OTDrawer } from "./OTDrawer"
import { useOrdenes } from "@/features/panel/context/OrdenesContext"

// ─── Small chips ───────────────────────────────────────────────────────────────

export function TipoChip({ tipo }: { tipo: TipoOT }) {
  const cfg = TIPO_CONFIG[tipo]
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ background: cfg.bg, color: cfg.fg }}
    >
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: cfg.fg }} />
      {cfg.label}
    </span>
  )
}

export function EstadoChip({ estado }: { estado: EstadoOT }) {
  const cfg = ESTADO_CONFIG[estado]
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ background: cfg.bg, color: cfg.fg }}
    >
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: cfg.dot }} />
      {cfg.label}
    </span>
  )
}

export function MecPill({ mecanicoId }: { mecanicoId: string }) {
  const found = MECANICOS_MOCK.find(m => m.id === mecanicoId)
  const mec = found ?? MECANICOS_MOCK[3]
  const unassigned = mecanicoId === "--" || !found
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div
        className={cn(
          "w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0",
          unassigned
            ? "border border-dashed border-[#b8a88d] text-[#a59682]"
            : "text-white"
        )}
        style={{ background: unassigned ? "transparent" : mec.color }}
      >
        {unassigned ? "?" : mec.iniciales}
      </div>
      <span className={cn(
        "text-[12px] truncate",
        unassigned ? "text-[#a59682] italic" : "text-[#2b2f36] font-medium"
      )}>
        {mec.nombre}
      </span>
    </div>
  )
}

// ─── Table row ─────────────────────────────────────────────────────────────────

function OTRow({
  orden,
  selected,
  onSelect,
  onView,
  onEdit,
}: {
  orden: OrdenTrabajo
  selected: boolean
  onSelect: () => void
  onView: () => void
  onEdit: () => void
}) {
  const [fecha, hora = ""] = orden.fechaIngreso.split(/\s(?:Â·|·)\s/)
  return (
    <tr className="border-b border-vs-line-2 hover:bg-[#faf6f0] transition-colors group">
      <td className="px-4 py-3.5 align-middle">
        <input
          type="checkbox"
          checked={selected}
          onChange={onSelect}
          className="w-4 h-4 rounded accent-vs-ink"
        />
      </td>
      <td className="px-4 py-3.5 align-middle">
        <div className="flex items-center gap-2">
          <span className="font-mono font-semibold text-[12.5px]">{orden.id}</span>
          {orden.prioridad === "alta" && (
            <span className="text-[9.5px] font-semibold text-vs-warn bg-vs-warn-bg px-1.5 py-0.5 rounded">
              URG
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-3.5 align-middle">
        <TipoChip tipo={orden.tipo} />
      </td>
      <td className="px-4 py-3.5 align-middle">
        <div className="text-[12.5px] font-medium">{fecha}</div>
        <div className="text-[11px] text-[#8a7f70] font-mono">{hora}</div>
      </td>
      <td className="px-4 py-3.5 align-middle">
        <MecPill mecanicoId={orden.mecanicoId} />
      </td>
      <td className="px-4 py-3.5 align-middle">
        <div className="text-[12.5px] font-medium">{orden.clienteNombre}</div>
        {orden.clienteTelefono && (
          <div className="text-[11px] text-[#8a7f70]">{orden.clienteTelefono}</div>
        )}
      </td>
      <td className="px-4 py-3.5 align-middle max-w-[300px]">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-[12.5px] font-semibold truncate">{orden.biciMarca}</span>
          <span className="text-[10.5px] text-[#a59682] font-mono shrink-0">· {orden.biciColor}</span>
        </div>
        <div className="text-[11px] text-[#8a7f70] mb-0.5">{orden.biciTipo} · {orden.biciTalla}</div>
        <div className="text-[11.5px] text-[#4a4438] leading-snug line-clamp-2">{orden.descripcion}</div>
      </td>
      <td className="px-4 py-3.5 align-middle">
        <EstadoChip estado={orden.estado} />
      </td>
      <td className="px-4 py-3.5 align-middle">
        <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onView}
            title="Ver detalle"
            className="w-8 h-8 rounded-full bg-vs-chip hover:bg-[#ebe3d6] flex items-center justify-center text-[#2b2f36] transition-colors"
          >
            <Eye size={14} strokeWidth={1.6} />
          </button>
          <button
            onClick={onEdit}
            title="Editar"
            className="w-8 h-8 rounded-full bg-vs-chip hover:bg-[#ebe3d6] flex items-center justify-center text-[#2b2f36] transition-colors"
          >
            <Pencil size={14} strokeWidth={1.6} />
          </button>
          <button
            title="Más acciones"
            className="w-8 h-8 rounded-full bg-vs-chip hover:bg-[#ebe3d6] flex items-center justify-center text-[#2b2f36] transition-colors"
          >
            <MoreHorizontal size={14} strokeWidth={1.6} />
          </button>
        </div>
      </td>
    </tr>
  )
}

// ─── Tab bar ───────────────────────────────────────────────────────────────────

type TabKey = "all" | EstadoOT

const TABS: { key: TabKey; label: string }[] = [
  { key: "all",      label: "Todas" },
  { key: "recibido", label: "Recibidas" },
  { key: "proceso",  label: "En proceso" },
  { key: "espera",   label: "Esp. repuesto" },
  { key: "listo",    label: "Listas" },
  { key: "entregado",label: "Entregadas" },
]

// ─── Page ──────────────────────────────────────────────────────────────────────

export function OrdenesPage() {
  const { ordenes, isLoading, isError, error, updateOrden, openNuevaOT } = useOrdenes()
  const [activeTab, setActiveTab] = useState<TabKey>("all")
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [drawer, setDrawer] = useState<{ orden: OrdenTrabajo; mode: "view" | "edit" } | null>(null)

  const counts = useMemo(() => {
    const c = { all: ordenes.length, recibido: 0, proceso: 0, espera: 0, listo: 0, entregado: 0 }
    ordenes.forEach(o => { c[o.estado]++ })
    return c as Record<TabKey, number>
  }, [ordenes])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return ordenes.filter(o => {
      if (activeTab !== "all" && o.estado !== activeTab) return false
      if (q) {
        const hay = [o.id, o.clienteNombre, o.biciMarca, o.descripcion].join(" ").toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [ordenes, activeTab, query])

  const toggleSelect = (id: string) =>
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const toggleAll = () =>
    setSelected(prev =>
      prev.size === filtered.length ? new Set() : new Set(filtered.map(o => o.id))
    )

  const handleSaveEdit = (updated: OrdenTrabajo) => {
    updateOrden(updated)
    setDrawer(null)
  }

  const allSelected = filtered.length > 0 && selected.size === filtered.length

  const ACTIONS = (
    <>
      <button className="flex items-center gap-1.5 bg-vs-chip text-vs-ink px-4 py-2 rounded-full text-[13px] font-medium hover:bg-[#ebe3d6] transition-colors">
        <Calendar size={14} strokeWidth={1.6} />
        Este mes
        <ChevronDown size={14} strokeWidth={1.6} className="text-[#a59682]" />
      </button>
      <button className="bg-vs-chip text-vs-ink px-4 py-2 rounded-full text-[13px] font-medium hover:bg-[#ebe3d6] transition-colors">
        Exportar CSV
      </button>
      <button
        onClick={openNuevaOT}
        className="flex items-center gap-2 bg-vs-ink text-white px-4 py-2 rounded-full text-[13px] font-medium hover:bg-[#1e2228] transition-colors"
      >
        <Plus size={16} strokeWidth={2} />
        Nueva OT
      </button>
    </>
  )

  return (
    <div>
      <PageHeader
        breadcrumb={[{ label: "Panel", href: "/dashboard" }, { label: "Órdenes de servicio" }]}
        title="Órdenes de servicio"
        subtitle={`Gestiona las OTs del taller · ${counts.all} activas · Sucursal Providencia`}
        actions={ACTIONS}
      />

      {/* Tab bar + search + filters */}
      <div className="bg-vs-card border border-vs-line rounded-[24px] p-3 mb-4 flex items-center gap-2 flex-wrap">
        <div className="flex gap-1 bg-vs-chip p-1 rounded-full overflow-x-auto shrink-0">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "text-[12px] px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5 whitespace-nowrap transition-colors",
                activeTab === tab.key
                  ? "bg-white shadow-sm text-vs-ink"
                  : "text-[#8a7f70] hover:text-vs-ink"
              )}
            >
              {tab.label}
              <span className={cn(
                "text-[10.5px] font-mono px-1.5 rounded-md",
                activeTab === tab.key ? "bg-[#ece7de]" : "bg-white/60"
              )}>
                {String(counts[tab.key]).padStart(2, "0")}
              </span>
            </button>
          ))}
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2 bg-vs-chip px-3 py-1.5 rounded-full min-w-[220px]">
          <Search size={14} strokeWidth={1.6} className="text-[#a59682] shrink-0" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar ID, cliente, marca…"
            className="bg-transparent outline-none text-[12.5px] flex-1 placeholder:text-[#a59682]"
          />
        </div>

        <button className="flex items-center gap-1.5 text-[12px] bg-vs-chip px-3 py-1.5 rounded-full text-[#4a4438] hover:bg-[#ebe3d6] transition-colors">
          <SlidersHorizontal size={13} strokeWidth={1.6} />
          Tipo
        </button>
        <button className="flex items-center gap-1.5 text-[12px] bg-vs-chip px-3 py-1.5 rounded-full text-[#4a4438] hover:bg-[#ebe3d6] transition-colors">
          <Wrench size={13} strokeWidth={1.6} />
          Mecánico
        </button>
        <button className="flex items-center gap-1.5 text-[12px] bg-vs-chip px-3 py-1.5 rounded-full text-[#4a4438] hover:bg-[#ebe3d6] transition-colors">
          <Calendar size={13} strokeWidth={1.6} />
          Fecha
        </button>
      </div>

      {/* Bulk selection bar */}
      {selected.size > 0 && (
        <div className="bg-vs-ink text-white border border-vs-ink rounded-[24px] px-4 py-2.5 mb-3 flex items-center gap-3">
          <span className="text-[12.5px] font-semibold">
            {selected.size} seleccionada{selected.size > 1 ? "s" : ""}
          </span>
          <div className="flex-1" />
          <button className="text-[12px] px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
            Reasignar
          </button>
          <button className="text-[12px] px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
            Cambiar estado
          </button>
          <button className="text-[12px] px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
            Exportar
          </button>
          <button
            onClick={() => setSelected(new Set())}
            className="text-[12px] px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            Cancelar
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-vs-card border border-vs-line rounded-[24px] overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#faf6f0] border-b border-vs-line">
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="w-4 h-4 rounded accent-vs-ink"
                />
              </th>
              {["Orden ID", "Tipo", "Fecha ingreso", "Mecánico", "Cliente", "Descripción · Bicicleta", "Estado"].map(h => (
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
            {isLoading && (
              <tr>
                <td colSpan={9} className="text-center py-12 text-[#8a7f70] text-[13px]">
                  Cargando ordenes...
                </td>
              </tr>
            )}
            {isError && (
              <tr>
                <td colSpan={9} className="text-center py-12 text-vs-warn text-[13px]">
                  No se pudieron cargar las ordenes. {error?.message ?? "Intenta nuevamente."}
                </td>
              </tr>
            )}
            {!isLoading && !isError && filtered.map(orden => (
              <OTRow
                key={orden.backendId ?? orden.id}
                orden={orden}
                selected={selected.has(orden.id)}
                onSelect={() => toggleSelect(orden.id)}
                onView={() => setDrawer({ orden, mode: "view" })}
                onEdit={() => setDrawer({ orden, mode: "edit" })}
              />
            ))}
            {!isLoading && !isError && filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center py-12 text-[#8a7f70] text-[13px]">
                  Sin resultados para los filtros actuales.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination footer */}
        <div className="flex items-center gap-3 px-4 py-3 border-t border-vs-line-2 bg-[#faf6f0]">
          <div className="text-[12px] text-[#8a7f70]">
            Mostrando{" "}
            <b className="font-mono text-vs-ink">{filtered.length}</b>{" "}
            de{" "}
            <b className="font-mono text-vs-ink">{ordenes.length}</b>{" "}
            órdenes
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 rounded-full bg-vs-chip flex items-center justify-center text-[#8a7f70] hover:bg-[#ebe3d6] transition-colors">
              <ChevronLeft size={14} strokeWidth={1.8} />
            </button>
            <button className="w-8 h-8 rounded-full bg-vs-ink text-white text-[12px] font-semibold flex items-center justify-center">
              1
            </button>
            <button className="w-8 h-8 rounded-full bg-vs-chip text-[12px] font-semibold flex items-center justify-center hover:bg-[#ebe3d6] transition-colors">
              2
            </button>
            <button className="w-8 h-8 rounded-full bg-vs-chip text-[12px] font-semibold flex items-center justify-center hover:bg-[#ebe3d6] transition-colors">
              3
            </button>
            <button className="w-8 h-8 rounded-full bg-vs-chip flex items-center justify-center text-[#8a7f70] hover:bg-[#ebe3d6] transition-colors">
              <ChevronRight size={14} strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </div>

      <div className="text-[11px] text-[#a59682] text-center py-4">
        VeloService · v2.4.1 · Última sincronización hace 8 seg
      </div>

      {/* Drawer */}
      {drawer && (
        <OTDrawer
          orden={drawer.orden}
          mode={drawer.mode}
          onClose={() => setDrawer(null)}
          onSave={handleSaveEdit}
        />
      )}

    </div>
  )
}

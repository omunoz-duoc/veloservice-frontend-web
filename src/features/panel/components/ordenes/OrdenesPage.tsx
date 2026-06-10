"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { PageHeader } from "@/components/common/PageHeader"
import {
  Plus, Search, SlidersHorizontal, Wrench, Calendar,
  Eye, Pencil, ChevronLeft, ChevronRight, ChevronDown,
  Check, X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { OTDrawer } from "./OTDrawer"
import { useOrdenes } from "@/features/panel/context/OrdenesContext"
import { useOrdenesQuery } from "@/features/panel/hooks/useOrdenes"
import { BulkReasignarModal } from "./BulkReasignarModal"
import { BulkEstadoModal } from "./BulkEstadoModal"
import { useMecanicosActivos } from "@/features/panel/hooks/useMecanicosActivos"


export const TIPO_CONFIG: Record<string, { label: string; fg: string; bg: string }> = {
  personalizacion: { label: "Personalización", fg: "#3a6ea5", bg: "#e4eaf2" },
  mantencion:  { label: "Mantención",  fg: "#6b5bd1", bg: "#ebe7fa" },
  reparacion:  { label: "Reparación",  fg: "#c85a2a", bg: "#fbeadd" },
  revision:    { label: "Revisión",    fg: "#111418", bg: "#ece7de" },
  diagnostico: { label: "Diagnostico", fg: "#3a6ea5", bg: "#e4eaf2" },
  garantia:    { label: "Garantía",    fg: "#2f7d4f", bg: "#e4f1e8" },
  armado:      { label: "Armado",      fg: "#8c6a1e", bg: "#faecd6" },
}

export const ESTADO_CONFIG: Record<string, { label: string; fg: string; bg: string; dot: string }> = {
  recibido:  { label: "Recibido",      fg: "#6b5d46", bg: "#efe9df", dot: "#a59682" },
  diagnostico: { label: "Diagnostico", fg: "#3a6ea5", bg: "#e4eaf2", dot: "#3a6ea5" },
  proceso:   { label: "En proceso",    fg: "#6b5bd1", bg: "#ebe7fa", dot: "#6b5bd1" },
  espera:    { label: "Esp. repuesto", fg: "#c85a2a", bg: "#fbeadd", dot: "#c85a2a" },
  calidad:   { label: "Control calidad", fg: "#8c6a1e", bg: "#faecd6", dot: "#8c6a1e" },
  listo:     { label: "Listo",         fg: "#2f7d4f", bg: "#e4f1e8", dot: "#2f7d4f" },
  entregado: { label: "Entregado",     fg: "#3a6ea5", bg: "#e4eaf2", dot: "#3a6ea5" },
  cancelado: { label: "Cancelado",     fg: "#6b5d46", bg: "#ece7de", dot: "#6b5d46" },
}

const TIPO_FALLBACK = { label: "Otro", fg: "#6b5d46", bg: "#efe9df" }
const ESTADO_FALLBACK = { label: "Sin estado", fg: "#6b5d46", bg: "#efe9df", dot: "#a59682" }

export const PRIORIDAD_CONFIG: Record<string, { label: string; fg: string; bg: string }> = {
  baja:  { label: "Baja",  fg: "#6b5d46", bg: "#efe9df" },
  media: { label: "Media", fg: "#3a6ea5", bg: "#e4eaf2" },
  alta:  { label: "Alta",  fg: "#c85a2a", bg: "#fbeadd" },
  urgente: { label: "Urgente", fg: "#8c1e1e", bg: "#f7dddd" },
}


export const TIPOS_BICI: string[] = [
  "MTB", "MTB Full", "Ruta", "Gravel", "Urbana", "BMX", "eBike MTB", "eBike Urbana", "Otro",
]

import type { OrdenTrabajo, EstadoOT } from "./ordenes.types"
// ─── Small chips ───────────────────────────────────────────────────────────────

export function TipoChip({ tipo }: { tipo?: { codigo?: string; id?: string; nombre?: string } }) {
  const cfg = TIPO_CONFIG[tipo?.codigo ?? ""] ?? TIPO_FALLBACK
  const label = cfg === TIPO_FALLBACK ? (tipo?.nombre || tipo?.codigo || cfg.label) : cfg.label
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ background: cfg.bg, color: cfg.fg }}
    >
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: cfg.fg }} />
      {label}
    </span>
  )
}

export function EstadoChip({ estado }: { estado: string }) {
  const cfg = ESTADO_CONFIG[estado ?? ""] ?? ESTADO_FALLBACK
  const label = cfg === ESTADO_FALLBACK ? (estado || cfg.label) : cfg.label
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ background: cfg.bg, color: cfg.fg }}
    >
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: cfg.dot }} />
      {label}
    </span>
  )
}

export function MecPill({ mecanicoId }: { mecanicoId: string }) {
  const normalizedMecanico = mecanicoId.trim().toLowerCase()
  const unassigned = normalizedMecanico === "--" || !normalizedMecanico
  const iniciales = mecanicoId.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div
        className={cn(
          "w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0",
          unassigned
            ? "border border-dashed border-[#b8a88d] text-[#a59682]"
            : "text-white"
        )}
        style={{ background: unassigned ? "transparent" : "#6b5bd1" }}
      >
        {unassigned ? "?" : iniciales}
      </div>
      <span className={cn(
        "text-[12px] truncate",
        unassigned ? "text-[#a59682] italic" : "text-[#2b2f36] font-medium"
      )}>
        {unassigned ? "Sin asignar" : mecanicoId}
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
  const [fecha, hora] = orden.fechaIngreso.split(" · ")
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
          {/* <button
            title="Más acciones"
            className="w-8 h-8 rounded-full bg-vs-chip hover:bg-[#ebe3d6] flex items-center justify-center text-[#2b2f36] transition-colors"
          >
            <MoreHorizontal size={14} strokeWidth={1.6} />
          </button> */}
        </div>
      </td>
    </tr>
  )
}

// ─── Filter helpers ────────────────────────────────────────────────────────────

const MES_IDX: Record<string, number> = {
  Ene:0,Feb:1,Mar:2,Abr:3,May:4,Jun:5,Jul:6,Ago:7,Sep:8,Oct:9,Nov:10,Dic:11,
}

function parseFechaIngreso(s: string): Date | null {
  const m = s.match(/^(\d{1,2})\s+(\w{3})\s+·\s+(\d{2}):(\d{2})$/)
  if (!m) return null
  const month = MES_IDX[m[2]]
  if (month === undefined) return null
  const now = new Date()
  const year = month > now.getMonth() + 1 ? now.getFullYear() - 1 : now.getFullYear()
  return new Date(year, month, +m[1], +m[3], +m[4])
}


function normalizeMecanicoId(value: string) {
  return value.trim().toLowerCase()
}

function FilterDropdown({ label, icon, options, selected, onChange }: {
  label: string
  icon: React.ReactNode
  options: { value: string; label: string; color?: string }[]
  selected: string[]
  onChange: (next: string[]) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", h)
    return () => document.removeEventListener("mousedown", h)
  }, [])

  const toggle = (v: string) => {
    const next = selected.includes(v) ? selected.filter(x => x !== v) : [...selected, v]
    onChange(next)
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={cn(
          "flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-full transition-colors",
          selected.length > 0
            ? "bg-vs-ink text-white"
            : "bg-vs-chip text-[#4a4438] hover:bg-[#ebe3d6]"
        )}
      >
        {icon}
        {label}
        {selected.length > 0 && (
          <span className="bg-white/25 text-[10px] font-mono px-1.5 rounded-full leading-5">
            {selected.length}
          </span>
        )}
        <ChevronDown size={12} strokeWidth={1.6} className={cn("transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute top-full mt-1.5 left-0 z-50 bg-white border border-vs-line rounded-[16px] shadow-lg min-w-[180px] p-1.5">
          {options.map(opt => (
            <button
              key={opt.value}
              onClick={() => toggle(opt.value)}
              className="flex items-center gap-2 w-full px-3 py-1.5 rounded-[10px] hover:bg-vs-chip text-left transition-colors"
            >
              <div className={cn(
                "w-4 h-4 rounded-[4px] border flex items-center justify-center shrink-0",
                selected.includes(opt.value) ? "bg-vs-ink border-vs-ink" : "border-[#c8bfb0]"
              )}>
                {selected.includes(opt.value) && <Check size={10} strokeWidth={2.5} className="text-white" />}
              </div>
              {opt.color && (
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: opt.color }} />
              )}
              <span className="text-[12px] text-vs-ink">{opt.label}</span>
            </button>
          ))}
          {selected.length > 0 && (
            <button
              onClick={() => onChange([])}
              className="flex items-center gap-1.5 w-full px-3 py-1.5 mt-0.5 rounded-[10px] text-[11.5px] text-[#a59682] hover:text-vs-ink hover:bg-vs-chip transition-colors"
            >
              <X size={11} strokeWidth={1.8} />
              Limpiar filtro
            </button>
          )}
        </div>
      )}
    </div>
  )
}

function DateRangeFilter({ desde, hasta, onChange }: {
  desde: string
  hasta: string
  onChange: (desde: string, hasta: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [localDesde, setLocalDesde] = useState(desde)
  const [localHasta, setLocalHasta] = useState(hasta)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", h)
    return () => document.removeEventListener("mousedown", h)
  }, [])

  const isActive = !!(desde || hasta)

  const apply = () => { onChange(localDesde, localHasta); setOpen(false) }

  const clear = () => {
    setLocalDesde(""); setLocalHasta("")
    onChange("", ""); setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={cn(
          "flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-full transition-colors",
          isActive ? "bg-vs-ink text-white" : "bg-vs-chip text-[#4a4438] hover:bg-[#ebe3d6]"
        )}
      >
        <Calendar size={13} strokeWidth={1.6} />
        Fecha
        {isActive && <Check size={11} strokeWidth={2} className="ml-0.5" />}
        <ChevronDown size={12} strokeWidth={1.6} className={cn("transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute top-full mt-1.5 left-0 z-50 bg-white border border-vs-line rounded-[16px] shadow-lg p-3 min-w-[210px]">
          <div className="space-y-2.5">
            <div>
              <p className="text-[10.5px] text-[#a59682] uppercase tracking-wide font-medium mb-1">Desde</p>
              <input
                type="date"
                value={localDesde}
                onChange={e => setLocalDesde(e.target.value)}
                className="block w-full text-[12px] bg-vs-chip rounded-[8px] px-2.5 py-1.5 outline-none"
              />
            </div>
            <div>
              <p className="text-[10.5px] text-[#a59682] uppercase tracking-wide font-medium mb-1">Hasta</p>
              <input
                type="date"
                value={localHasta}
                min={localDesde}
                onChange={e => setLocalHasta(e.target.value)}
                className="block w-full text-[12px] bg-vs-chip rounded-[8px] px-2.5 py-1.5 outline-none"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={apply}
              className="flex-1 text-[12px] bg-vs-ink text-white rounded-[10px] py-1.5 hover:bg-[#1e2228] transition-colors"
            >
              Aplicar
            </button>
            {(localDesde || localHasta) && (
              <button
                onClick={clear}
                className="text-[12px] px-3 bg-vs-chip text-vs-ink rounded-[10px] py-1.5 hover:bg-[#ebe3d6] transition-colors"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Tab bar ───────────────────────────────────────────────────────────────────

type TabKey = "all" | EstadoOT

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "Todas" },
  { key: "recibido", label: "Recibidas" },
  { key: "diagnostico", label: "Diagnóstico" },
  { key: "proceso", label: "En reparación" },
  { key: "espera", label: "Esp. repuesto" },
  { key: "calidad", label: "Control calidad" },
  { key: "listo", label: "Listas" },
  { key: "entregado", label: "Entregadas" },
  { key: "cancelado", label: "Canceladas" },
]

// ─── Page ──────────────────────────────────────────────────────────────────────

export function OrdenesPage() {
  const { openNuevaOT } = useOrdenes()
  const { data: ordenes = [], isLoading, isFetching, isError, error } = useOrdenesQuery()
  const [activeTab, setActiveTab] = useState<TabKey>("all")
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [drawer, setDrawer] = useState<{ ordenId: string } | null>(null)
  const [filterTipos, setFilterTipos] = useState<string[]>([])
  const [filterMecanicos, setFilterMecanicos] = useState<string[]>([])
  const [filterDesde, setFilterDesde] = useState("")
  const [filterHasta, setFilterHasta] = useState("")
  const [bulkModal, setBulkModal] = useState<"reasignar" | "estado" | null>(null)
  const { data: mecanicosData } = useMecanicosActivos()
  const mecanicos = Array.isArray(mecanicosData) ? mecanicosData : mecanicosData?.mecanicos ?? []

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: ordenes.length, recibido: 0, proceso: 0, espera: 0, listo: 0, entregado: 0 }
    ordenes.forEach(o => { c[o.estado] = (c[o.estado] ?? 0) + 1 })
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
      if (filterTipos.length > 0 && (!o.tipo || !filterTipos.includes(o.tipo.codigo))) return false
      if (filterMecanicos.length > 0 && !filterMecanicos.includes(normalizeMecanicoId(o.mecanicoId))) return false
      if (filterDesde || filterHasta) {
        const fecha = parseFechaIngreso(o.fechaIngreso)
        if (fecha) {
          if (filterDesde && fecha < new Date(filterDesde)) return false
          if (filterHasta) {
            const hasta = new Date(filterHasta)
            hasta.setHours(23, 59, 59)
            if (fecha > hasta) return false
          }
        }
      }
      return true
    })
  }, [ordenes, activeTab, query, filterTipos, filterMecanicos, filterDesde, filterHasta])

  const toggleSelect = (id: string) =>
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })

  const toggleAll = () =>
  setSelected(prev =>
    prev.size === filtered.length
      ? new Set()
      : new Set(filtered.map(o => o.backendId ?? o.id))
  )

  const allSelected = filtered.length > 0 && selected.size === filtered.length

  const ACTIONS = (
    <>
      <button className="flex items-center gap-1.5 bg-vs-chip text-vs-ink px-4 py-2 rounded-full text-[13px] font-medium hover:bg-[#ebe3d6] transition-colors hidden">
        <Calendar size={14} strokeWidth={1.6} />
        Este mes
        <ChevronDown size={14} strokeWidth={1.6} className="text-[#a59682]" />
      </button>
      <button className="bg-vs-chip text-vs-ink px-4 py-2 rounded-full text-[13px] font-medium hover:bg-[#ebe3d6] transition-colors hidden">
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
        subtitle={isError ? "No se pudieron cargar las OTs" : `Gestiona las OTs del taller · ${counts.all} activas · Sucursal Providencia`}
        actions={ACTIONS}
      />

      {isError && (
        <div className="bg-vs-warn-bg border border-vs-warn/20 text-vs-warn rounded-[16px] px-4 py-3 mb-4 text-[13px]">
          {error instanceof Error ? error.message : "Error al cargar órdenes. Intenta nuevamente."}
        </div>
      )}

      {/* Tab bar + search + filters */}
      <div className="bg-vs-card border border-vs-line rounded-[24px] p-3 mb-4  items-center gap-2 flex-wrap">
        <div className="flex mb-4">
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
        </div>

        <div className="flex gap-3">
          <FilterDropdown
            label="Tipo"
            icon={<SlidersHorizontal size={13} strokeWidth={1.6} />}
            options={Object.entries(TIPO_CONFIG).map(([v, cfg]) => ({ value: v, label: cfg.label, color: cfg.fg }))}
            selected={filterTipos}
            onChange={setFilterTipos}
          />
          <FilterDropdown
            label="Mecánico"
            icon={<Wrench size={13} strokeWidth={1.6} />}
            options={mecanicos.map(m => ({ value: `${m.nombre} ${m.apellido}`.trim().toLowerCase(),
            label: `${m.nombre} ${m.apellido}`.trim(),color: "#6b5bd1",}))}
            selected={filterMecanicos}
            onChange={setFilterMecanicos}
          />
          <DateRangeFilter
            desde={filterDesde}
            hasta={filterHasta}
            onChange={(d, h) => { setFilterDesde(d); setFilterHasta(h) }}
          />
        </div>
      </div>

      {/* Bulk selection bar */}
      {selected.size > 0 && (
        <div className="bg-vs-ink text-white border border-vs-ink rounded-[24px] px-4 py-2.5 mb-3 flex items-center gap-3">
          <span className="text-[12.5px] font-semibold">
            {selected.size} seleccionada{selected.size > 1 ? "s" : ""}
          </span>
          <div className="flex-1" />
          <button
            onClick={() => setBulkModal("reasignar")}
            className="text-[12px] px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            Reasignar
          </button>
          <button
            onClick={() => setBulkModal("estado")}
            className="text-[12px] px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            Cambiar estado
          </button>
          <button className="text-[12px] px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors hidden">
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
      <div className="relative bg-vs-card border border-vs-line rounded-[24px] overflow-hidden">
        {isFetching && !isLoading && (
          <div className="absolute left-0 right-0 top-0 z-10 border-b border-vs-line bg-[#faf6f0]/95 px-4 py-2 text-center text-[12px] font-medium text-[#6b5d46]">
            Actualizando...
          </div>
        )}
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
                  Cargando órdenes…
                </td>
              </tr>
            )}
            {!isLoading && filtered.map(orden => (
              <OTRow
                key={orden.id}
                orden={orden}
                selected={selected.has(orden.backendId ?? orden.id)}
                onSelect={() => toggleSelect(orden.backendId ?? orden.id)}
                onView={() => setDrawer({ ordenId: orden.backendId ?? orden.id })}
                onEdit={() => setDrawer({ ordenId: orden.backendId ?? orden.id })}
              />
            ))}
            {!isLoading && filtered.length === 0 && (
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
          ordenId={drawer.ordenId}
          onClose={() => setDrawer(null)}
        />
      )}

      {bulkModal === "reasignar" && (
        <BulkReasignarModal
          ids={[...selected]}
          onClose={() => setBulkModal(null)}
          onSuccess={() => { setBulkModal(null); setSelected(new Set()) }}
        />
      )}
      {bulkModal === "estado" && (
        <BulkEstadoModal
          ids={[...selected]}
          onClose={() => setBulkModal(null)}
          onSuccess={() => { setBulkModal(null); setSelected(new Set()) }}
        />
      )}

    </div>
  )
}

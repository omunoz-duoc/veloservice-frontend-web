"use client"

import { useState, useMemo } from "react"
import { Search, Plus, Filter, ChevronLeft, ChevronRight, Mail, Bike, Settings, Pencil, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  TIERS, fmtGasto, avatarInitials, avatarColor, nextClienteId,
  type Cliente, type TierKey,
} from "./clientes.mock"
import { ClienteDrawer, TierChip, ClienteAvatar, type DrawerMode } from "./ClienteDrawer"
import { NuevoClienteModal } from "./NuevoClienteModal"
import { useClientes } from "../../hooks/useClientes"

// ─── Table header cell ─────────────────────────────────────────────────────────

function Th({ children, right }: { children?: React.ReactNode; right?: boolean }) {
  return (
    <th className={cn("px-4 py-3 text-[11px] uppercase tracking-widest text-[#a59682] font-medium", right && "text-right")}>
      {children}
    </th>
  )
}

// ─── Table row ─────────────────────────────────────────────────────────────────

function ClienteRow({
  c,
  selected,
  onSelect,
  onManage,
  onBikes,
  onEdit,
}: {
  c: Cliente
  selected: boolean
  onSelect: () => void
  onManage: () => void
  onBikes: () => void
  onEdit: () => void
}) {
  return (
    <tr className="border-b border-vs-line-2 hover:bg-[#faf7f1] transition-colors duration-100">
      <td className="px-4 py-3.5 align-middle">
        <input
          type="checkbox"
          checked={selected}
          onChange={onSelect}
          className="w-4 h-4 rounded accent-vs-ink"
        />
      </td>
      <td className="px-4 py-3.5 align-middle">
        <span className="font-mono font-semibold text-[12.5px]">{c.id}</span>
      </td>
      <td className="px-4 py-3.5 align-middle">
        <div className="flex items-center gap-3">
          <ClienteAvatar nombre={c.nombre} tier={c.tier} size={36} />
          <div className="min-w-0">
            <div className="text-[13px] font-semibold truncate">{c.nombre}</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <TierChip tier={c.tier} />
              <span className="text-[10.5px] text-[#a59682] font-mono">· {c.ciudad}</span>
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3.5 align-middle">
        <div className="text-[10.5px] text-[#a59682] uppercase tracking-wide">{c.idType}</div>
        <div className="text-[12.5px] font-mono font-semibold">{c.idNum}</div>
      </td>
      <td className="px-4 py-3.5 align-middle">
        <div className="flex items-center gap-1.5 text-[12px]">
          <Mail size={12} strokeWidth={1.6} className="text-[#a59682] shrink-0" />
          <span className="truncate max-w-[200px]">{c.email}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-[#8a7f70] mt-0.5">
          <span className="font-mono">{c.tel}</span>
        </div>
      </td>
      <td className="px-4 py-3.5 align-middle">
        <div className="flex items-center gap-1.5">
          <Bike size={13} strokeWidth={1.6} className="text-vs-violet" />
          <span className="text-[13px] font-semibold font-mono">{c.bicis}</span>
        </div>
        <div className="text-[10.5px] text-[#8a7f70] mt-0.5">{c.ots} OTs históricas</div>
      </td>
      <td className="px-4 py-3.5 align-middle text-right">
        <div className="text-[13px] font-semibold font-mono">{fmtGasto(c.gasto)}</div>
        <div className="text-[10.5px] text-[#8a7f70]">últ. {c.ultima}</div>
      </td>
      <td className="px-4 py-3.5 align-middle">
        <div className="flex items-center gap-1 justify-end">
          <button
            onClick={onManage}
            className="flex items-center gap-1.5 bg-vs-chip hover:bg-[#ebe3d6] px-3 py-1.5 rounded-full text-[11px] font-medium text-vs-ink active:scale-95 transition-all duration-150"
          >
            <Settings size={12} strokeWidth={1.6} />
            Gestionar
          </button>
          <button
            onClick={onBikes}
            title="Bicicletas asociadas"
            className="w-8 h-8 rounded-full bg-vs-chip hover:bg-[#ebe3d6] flex items-center justify-center text-vs-violet active:scale-90 transition-all duration-150"
          >
            <Bike size={13} strokeWidth={1.6} />
          </button>
          <button
            onClick={onEdit}
            title="Editar datos"
            className="w-8 h-8 rounded-full bg-vs-chip hover:bg-[#ebe3d6] flex items-center justify-center text-vs-ink active:scale-90 transition-all duration-150"
          >
            <Pencil size={12} strokeWidth={1.6} />
          </button>
          <button
            title="Más acciones"
            className="w-8 h-8 rounded-full bg-vs-chip hover:bg-[#ebe3d6] flex items-center justify-center text-vs-ink active:scale-90 transition-all duration-150 hidden"
          >
            <MoreHorizontal size={13} strokeWidth={1.6} />
          </button>
        </div>
      </td>
    </tr>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export function ClientesPage() {
  const { data: fetched = [], isLoading } = useClientes()
  const [localClientes, setLocalClientes] = useState<Cliente[]>([])
  const clientes = localClientes.length > 0 ? localClientes : fetched
  const [tab, setTab] = useState<"all" | TierKey>("all")
  const [query, setQuery] = useState("")
  const [sel, setSel] = useState<Set<string>>(new Set())
  const [drawer, setDrawer] = useState<{ cliente: Cliente; mode: DrawerMode } | null>(null)
  const [showModal, setShowModal] = useState(false)

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: clientes.length, vip: 0, frecuente: 0, regular: 0, nuevo: 0 }
    clientes.forEach(x => c[x.tier]++)
    return c
  }, [clientes])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return clientes.filter(c => {
      if (tab !== "all" && c.tier !== tab) return false
      if (q) {
        const hay = (c.id + " " + c.nombre + " " + c.idNum + " " + c.email + " " + c.tel).toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [clientes, tab, query])

  const toggleSel = (id: string) =>
    setSel(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })

  const toggleAll = () =>
    setSel(prev => prev.size === filtered.length ? new Set() : new Set(filtered.map(c => c.id)))

  const allSelected = filtered.length > 0 && sel.size === filtered.length

  const addCliente = (c: Cliente) => {
    setLocalClientes(prev => [c, ...(prev.length > 0 ? prev : fetched)])
    setShowModal(false)
  }

  const updateCliente = (updated: Cliente) => {
    setLocalClientes(prev =>
      (prev.length > 0 ? prev : fetched).map(c => c.id === updated.id ? updated : c)
    )
    setDrawer(null)
  }

  const tabs = [
    { k: "all",       l: "Todos",     c: counts.all },
    { k: "vip",       l: "VIP",       c: counts.vip },
    { k: "frecuente", l: "Frecuentes", c: counts.frecuente },
    { k: "regular",   l: "Regulares", c: counts.regular },
    { k: "nuevo",     l: "Nuevos",    c: counts.nuevo },
  ]

  const totalBicis = clientes.reduce((a, c) => a + c.bicis, 0)

  return (
    <div className="p-6">
      {/* Page header */}
      <div className="flex items-end justify-between mb-5">
        <div>
          <h1 className="text-[26px] font-semibold tracking-tight">Ciclistas</h1>
          <p className="text-[13px] text-[#8a7f70] mt-1">
            {clientes.length} clientes registrados · {totalBicis} bicicletas en cartera · Sucursal Providencia
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-vs-chip text-vs-ink px-4 py-2 rounded-full text-[13px] font-medium hover:bg-[#ebe3d6] active:scale-95 transition-all duration-150 hidden">
            Importar CSV
          </button>
          <button className="flex items-center gap-2 bg-vs-chip text-vs-ink px-4 py-2 rounded-full text-[13px] font-medium hover:bg-[#ebe3d6] active:scale-95 transition-all duration-150 hidden">
            Exportar
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-vs-ink text-white pl-4 pr-4 py-2 rounded-full text-[13px] font-medium hover:bg-[#1e2228] active:scale-95 transition-all duration-150"
          >
            <Plus size={15} strokeWidth={2} />
            Nuevo ciclista
          </button>
        </div>
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
            placeholder="Buscar nombre, RUT, email…"
            className="bg-transparent outline-none text-[12.5px] flex-1 placeholder:text-[#a59682]"
          />
        </div>

        <button className="flex items-center gap-1.5 bg-vs-chip text-vs-ink px-3 py-1.5 rounded-full text-[12px] font-medium hover:bg-[#ebe3d6] active:scale-95 transition-all duration-150 hidden">
          <Filter size={12} strokeWidth={1.6} />
          Ciudad
        </button>
        <button className="flex items-center gap-1.5 bg-vs-chip text-vs-ink px-3 py-1.5 rounded-full text-[12px] font-medium hover:bg-[#ebe3d6] active:scale-95 transition-all duration-150 hidden">
          Canal
        </button>
      </div>

      {/* Bulk selection bar */}
      {sel.size > 0 && (
        <div className="bg-vs-ink text-white border border-vs-ink rounded-[16px] px-4 py-2.5 mb-3 flex items-center gap-3 vs-scale-in">
          <span className="text-[12.5px] font-semibold">{sel.size} seleccionado{sel.size > 1 ? "s" : ""}</span>
          <div className="flex-1" />
          <button className="text-[12px] px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors">Enviar recordatorio</button>
          <button className="text-[12px] px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors">Cambiar tier</button>
          <button className="text-[12px] px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors">Exportar</button>
          <button onClick={() => setSel(new Set())} className="text-[12px] px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors">Cancelar</button>
        </div>
      )}

      {/* Table */}
      {isLoading ? (
        <div className="text-center py-8 text-[13px] text-[#a59682]">Cargando ciclistas…</div>
      ) : (
      <div className="bg-vs-card border border-vs-line rounded-[20px] overflow-hidden">
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
              <Th>Cliente ID</Th>
              <Th>Nombre</Th>
              <Th>Identificación</Th>
              <Th>Contacto</Th>
              <Th>Bicicletas</Th>
              <Th right>Gasto total</Th>
              <Th right>Acciones</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <ClienteRow
                key={c.id}
                c={c}
                selected={sel.has(c.id)}
                onSelect={() => toggleSel(c.id)}
                onManage={() => setDrawer({ cliente: c, mode: "manage" })}
                onBikes={() => setDrawer({ cliente: c, mode: "bikes" })}
                onEdit={() => setDrawer({ cliente: c, mode: "edit" })}
              />
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-12 text-[#8a7f70] text-[13px]">
                  Sin resultados para los filtros actuales.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Table footer */}
        <div className="flex items-center gap-3 px-4 py-3 border-t border-vs-line-2 bg-[#faf6f0]">
          <div className="text-[12px] text-[#8a7f70]">
            Mostrando <b className="font-mono text-vs-ink">{filtered.length}</b> de{" "}
            <b className="font-mono text-vs-ink">{clientes.length}</b> ciclistas
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
      )}

      {/* Footer note */}
      <div className="text-[11px] text-[#a59682] text-center py-4">
        VeloService · v2.4.1 · Última sincronización hace 4 seg
      </div>

      {/* Drawer */}
      {drawer && (
        <ClienteDrawer
          cliente={drawer.cliente}
          mode={drawer.mode}
          onClose={() => setDrawer(null)}
          onSave={updateCliente}
        />
      )}

      {/* Modal */}
      {showModal && (
        <NuevoClienteModal
          nextId={nextClienteId(clientes)}
          onClose={() => setShowModal(false)}
          onCreate={addCliente}
        />
      )}
    </div>
  )
}

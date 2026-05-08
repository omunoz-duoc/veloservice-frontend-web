"use client"

import { useState, useMemo } from "react"
import { Plus, Download, Filter, Check, Eye, Printer, MoreHorizontal, Truck, Clock, Building2, Phone, Mail, Star, X } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  PROVEEDORES_MOCK, OCS_MOCK, ESTADOS, TIMELINE_STEPS, fmt,
  type Proveedor, type OrdenCompra, type EstadoOC,
} from "./proveedores.mock"
import { ProveedorDrawer } from "./ProveedorDrawer"
import { RecepcionDrawer, type RecepcionResult } from "./RecepcionDrawer"

// ─── KPI Card ──────────────────────────────────────────────────────────────────

type KpiTone = "violet" | "amber" | "info" | "good"

const KPI_TONES: Record<KpiTone, { fg: string; bg: string }> = {
  violet: { fg: "#6b5bd1", bg: "#ebe7fa" },
  amber:  { fg: "#a07910", bg: "#faecd6" },
  info:   { fg: "#3a6ea5", bg: "#e4eaf2" },
  good:   { fg: "#2f7d4f", bg: "#e4f1e8" },
}

function KpiCard({ label, value, sub, tone, icon }: {
  label: string; value: string | number; sub: string; tone: KpiTone; icon: React.ReactNode
}) {
  const t = KPI_TONES[tone]
  return (
    <div className="bg-vs-card border border-vs-line rounded-[20px] p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: t.bg, color: t.fg }}>
            {icon}
          </div>
          <div className="text-[12.5px] font-medium text-[#4a4438]">{label}</div>
        </div>
      </div>
      <div className="text-[24px] font-semibold font-mono leading-none">{value}</div>
      <div className="text-[11px] text-[#8a7f70] mt-2">{sub}</div>
    </div>
  )
}

// ─── Timeline dots ─────────────────────────────────────────────────────────────

function TimelineMini({ estado }: { estado: EstadoOC }) {
  if (estado === "cancelada") {
    return <div className="text-[11px] text-vs-warn font-medium">Cancelada</div>
  }
  const idx = TIMELINE_STEPS.findIndex(s => s.k === estado)
  return (
    <div className="flex items-center gap-1">
      {TIMELINE_STEPS.map((s, i) => (
        <div key={s.k} className="flex items-center gap-1">
          <div className={cn("w-1.5 h-1.5 rounded-full", i <= idx ? "bg-vs-ink" : "bg-[#d9d3c6]")} />
          {i < TIMELINE_STEPS.length - 1 && (
            <div className={cn("w-3 h-px", i < idx ? "bg-vs-ink" : "bg-[#d9d3c6]")} />
          )}
        </div>
      ))}
    </div>
  )
}

// ─── OC table row ──────────────────────────────────────────────────────────────

function OCRow({
  oc, prov, onReceive, onProvClick,
}: {
  oc: OrdenCompra
  prov: Proveedor | undefined
  onReceive: () => void
  onProvClick: () => void
}) {
  const e = ESTADOS[oc.estado]
  const canReceive = ["transito", "confirmada"].includes(oc.estado)

  return (
    <tr className="border-b border-vs-line-2 hover:bg-[#faf7f1] transition-colors duration-100">
      <td className="px-4 py-3.5 align-middle font-mono font-semibold text-[12.5px]">{oc.id}</td>
      <td className="px-4 py-3.5 align-middle">
        <button onClick={onProvClick} className="text-[12.5px] font-semibold text-left hover:underline">
          {prov?.nombre ?? oc.prov}
        </button>
        <div className="text-[10.5px] text-[#a59682]">{prov?.ciudad}</div>
      </td>
      <td className="px-4 py-3.5 align-middle">
        <div className="text-[12px] font-medium">{oc.fecha}</div>
        <div className="text-[11px] text-[#8a7f70] flex items-center gap-1 mt-0.5">
          <Clock size={10} strokeWidth={1.6} />
          <span>{oc.entrega}</span>
        </div>
      </td>
      <td className="px-4 py-3.5 align-middle text-[12.5px] font-mono">{oc.items}</td>
      <td className="px-4 py-3.5 align-middle">
        <span
          className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
          style={{ background: e.bg, color: e.fg }}
        >
          {e.label}
        </span>
      </td>
      <td className="px-4 py-3.5 align-middle">
        <TimelineMini estado={oc.estado} />
      </td>
      <td className="px-4 py-3.5 align-middle">
        {oc.tracking ? (
          <div>
            <div className="text-[11.5px] font-medium flex items-center gap-1">
              <Truck size={11} strokeWidth={1.6} className="shrink-0" />
              <span>{oc.tracking.split(" · ")[0]}</span>
            </div>
            <div className="font-mono text-[10.5px] text-[#8a7f70]">{oc.tracking.split(" · ")[1]}</div>
          </div>
        ) : oc.doc !== "—" ? (
          <div className="text-[11.5px] font-mono">{oc.doc}</div>
        ) : oc.estado === "recibida" ? (
          <div className="text-[11px] text-vs-good">Recibida {oc.recibida}</div>
        ) : (
          <span className="text-[11px] text-[#a59682]">—</span>
        )}
      </td>
      <td className="px-4 py-3.5 align-middle text-right font-mono font-semibold text-[13px]">
        {fmt(oc.total)}
      </td>
      <td className="px-4 py-3.5 align-middle">
        <div className="flex items-center gap-1 justify-end">
          {canReceive && (
            <button
              onClick={onReceive}
              className="flex items-center gap-1.5 bg-vs-good text-white px-3 py-1.5 rounded-full text-[11.5px] font-semibold hover:opacity-90 active:scale-95 transition-all duration-150"
            >
              <Check size={12} strokeWidth={2.5} />
              Recibir
            </button>
          )}
          {oc.estado === "recibida" && (
            <span className="flex items-center gap-1.5 text-[11px] font-semibold px-2 py-1 rounded-full bg-vs-good-bg text-vs-good">
              <Check size={11} strokeWidth={2.5} />
              Stock OK
            </span>
          )}
          <button className="w-8 h-8 rounded-full bg-vs-chip hover:bg-[#ebe3d6] flex items-center justify-center text-vs-ink active:scale-90 transition-all duration-150" title="Ver">
            <Eye size={13} strokeWidth={1.6} />
          </button>
          <button className="w-8 h-8 rounded-full bg-vs-chip hover:bg-[#ebe3d6] flex items-center justify-center text-vs-ink active:scale-90 transition-all duration-150" title="Imprimir">
            <Printer size={12} strokeWidth={1.6} />
          </button>
          <button className="w-8 h-8 rounded-full bg-vs-chip hover:bg-[#ebe3d6] flex items-center justify-center text-vs-ink active:scale-90 transition-all duration-150">
            <MoreHorizontal size={13} strokeWidth={1.6} />
          </button>
        </div>
      </td>
    </tr>
  )
}

// ─── Proveedor card ────────────────────────────────────────────────────────────

function ProveedorCard({ prov, ocs, onClick }: { prov: Proveedor; ocs: OrdenCompra[]; onClick: () => void }) {
  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(prov.rating))
  const pendientes = ocs.filter(o => o.prov === prov.id && ["enviada", "confirmada", "transito"].includes(o.estado)).length

  return (
    <div
      onClick={onClick}
      className="bg-vs-card border border-vs-line rounded-[24px] p-5 cursor-pointer hover:border-vs-violet transition-colors duration-150 vs-scale-in"
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-vs-info-bg text-vs-info shrink-0">
          <Building2 size={20} strokeWidth={1.6} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <span className="font-mono text-[10.5px] text-[#a59682]">{prov.id}</span>
            {!prov.activo && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-vs-warn-bg text-vs-warn">INACTIVO</span>
            )}
            {pendientes > 0 && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#faecd6] text-[#a07910]">
                {pendientes} pendiente{pendientes > 1 ? "s" : ""}
              </span>
            )}
          </div>
          <div className="text-[14.5px] font-semibold leading-tight truncate">{prov.nombre}</div>
          <div className="text-[11.5px] text-[#8a7f70]">{prov.rubro}</div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <div className="flex gap-0.5">
            {stars.map((on, i) => (
              <Star
                key={i}
                size={11}
                strokeWidth={1.5}
                className={on ? "text-[#a07910] fill-[#a07910]" : "text-[#d9d3c6]"}
              />
            ))}
          </div>
          <span className="font-mono text-[10.5px] text-[#8a7f70]">{prov.rating.toFixed(1)}</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="bg-vs-chip rounded-xl p-2.5">
          <div className="text-[10px] text-[#a59682] uppercase tracking-widest">Plazo</div>
          <div className="font-mono font-semibold text-[13px]">{prov.plazo} días</div>
        </div>
        <div className="bg-vs-chip rounded-xl p-2.5">
          <div className="text-[10px] text-[#a59682] uppercase tracking-widest">OCs 90d</div>
          <div className="font-mono font-semibold text-[13px]">{prov.ots90}</div>
        </div>
        <div className="bg-vs-chip rounded-xl p-2.5">
          <div className="text-[10px] text-[#a59682] uppercase tracking-widest">Total 90d</div>
          <div className="font-mono font-semibold text-[12.5px]">{fmt(prov.total90)}</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mt-4">
        {prov.marcas.map(m => (
          <span key={m} className="bg-vs-chip px-2 py-0.5 rounded-full text-[11px]">{m}</span>
        ))}
      </div>

      <div className="flex items-center gap-3 mt-4 pt-3 border-t border-vs-line-2 text-[11.5px] text-[#8a7f70]">
        <span className="flex items-center gap-1">
          <Phone size={11} strokeWidth={1.6} />
          {prov.tel}
        </span>
        <span className="flex items-center gap-1 truncate flex-1 min-w-0">
          <Mail size={11} strokeWidth={1.6} className="shrink-0" />
          <span className="truncate">{prov.mail}</span>
        </span>
      </div>
    </div>
  )
}

// ─── Toast ─────────────────────────────────────────────────────────────────────

function Toast({ result, onClose }: { result: RecepcionResult; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-[70] vs-scale-in">
      <div
        className="bg-vs-card border border-vs-line flex items-stretch max-w-[420px] rounded-[20px] overflow-hidden"
        style={{ boxShadow: "0 12px 40px rgba(0,0,0,.18)" }}
      >
        <div className="bg-vs-good w-1.5 shrink-0" />
        <div className="p-4 pr-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-7 h-7 rounded-full bg-vs-good-bg text-vs-good flex items-center justify-center shrink-0">
              <Check size={13} strokeWidth={2.5} />
            </span>
            <div className="font-semibold text-[13px]">Recepción confirmada · {result.oc.id}</div>
            <button onClick={onClose} className="ml-auto text-[#a59682] hover:text-vs-ink transition-colors">
              <X size={14} strokeWidth={1.6} />
            </button>
          </div>
          <div className="text-[12px] text-[#4a4438] leading-relaxed">
            <b className="font-mono">{result.units} unidades</b> de <b>{result.items} productos</b> ingresaron al inventario por <b className="font-mono">{fmt(result.total)}</b>.
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Th ────────────────────────────────────────────────────────────────────────

function Th({ children }: { children?: React.ReactNode }) {
  return <th className="px-4 py-3 text-[11px] uppercase tracking-widest text-[#a59682] font-medium">{children}</th>
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export function ProveedoresPage() {
  const [tab, setTab] = useState<"ocs" | "proveedores">("ocs")
  const [estadoFilter, setEstadoFilter] = useState<"all" | EstadoOC>("all")
  const [ocs, setOcs] = useState<OrdenCompra[]>(OCS_MOCK)
  const [reception, setReception] = useState<OrdenCompra | null>(null)
  const [provDrawer, setProvDrawer] = useState<Proveedor | null>(null)
  const [toast, setToast] = useState<RecepcionResult | null>(null)

  const provById = (id: string) => PROVEEDORES_MOCK.find(p => p.id === id)

  const kpiOCsAbiertas = ocs.filter(o => ["enviada", "confirmada", "transito"].includes(o.estado)).length
  const kpiTransito = ocs.filter(o => o.estado === "transito").length
  const kpiPorRecibir = ocs
    .filter(o => ["transito", "confirmada"].includes(o.estado))
    .reduce((a, o) => a + o.total, 0)
  const kpiProvActivos = PROVEEDORES_MOCK.filter(p => p.activo).length

  const filteredOCs = useMemo(() =>
    ocs.filter(o => estadoFilter === "all" || o.estado === estadoFilter),
    [ocs, estadoFilter]
  )

  const confirmReception = (result: RecepcionResult) => {
    setOcs(prev => prev.map(o => o.id === result.oc.id ? { ...o, estado: "recibida" as EstadoOC, recibida: "24 Abr" } : o))
    setReception(null)
    setToast(result)
    setTimeout(() => setToast(null), 6000)
  }

  const estadoTabs: { k: "all" | EstadoOC; l: string }[] = [
    { k: "all",        l: "Todos" },
    { k: "borrador",   l: "Borrador" },
    { k: "enviada",    l: "Enviadas" },
    { k: "confirmada", l: "Confirmadas" },
    { k: "transito",   l: "En tránsito" },
    { k: "recibida",   l: "Recibidas" },
  ]

  return (
    <div className="p-6">
      {/* Page header */}
      <div className="flex items-end justify-between mb-5">
        <div>
          <h1 className="text-[26px] font-semibold tracking-tight">Proveedores & compras</h1>
          <p className="text-[13px] text-[#8a7f70] mt-1">
            {PROVEEDORES_MOCK.length} proveedores · {ocs.length} OCs · Conectado a inventario en tiempo real
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-vs-chip text-vs-ink px-4 py-2 rounded-full text-[13px] font-medium hover:bg-[#ebe3d6] active:scale-95 transition-all duration-150">
            <Download size={14} strokeWidth={1.6} />
            Exportar
          </button>
          <button className="flex items-center gap-2 bg-vs-chip text-vs-ink px-4 py-2 rounded-full text-[13px] font-medium hover:bg-[#ebe3d6] active:scale-95 transition-all duration-150">
            <Plus size={14} strokeWidth={2} />
            Nuevo proveedor
          </button>
          <button className="flex items-center gap-2 bg-vs-ink text-white px-4 py-2 rounded-full text-[13px] font-medium hover:bg-[#1e2228] active:scale-95 transition-all duration-150">
            <Plus size={14} strokeWidth={2} />
            Nueva OC
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        <KpiCard label="OCs abiertas"       value={kpiOCsAbiertas}                          sub="enviadas, confirmadas, en tránsito"   tone="violet" icon={<Filter size={16} strokeWidth={1.6} />} />
        <KpiCard label="En tránsito"         value={kpiTransito}                             sub="con tracking activo"                  tone="amber"  icon={<Truck size={16} strokeWidth={1.6} />} />
        <KpiCard label="Valor por recibir"   value={fmt(kpiPorRecibir)}                      sub="confirmado + tránsito"                tone="info"   icon={<Building2 size={16} strokeWidth={1.6} />} />
        <KpiCard label="Proveedores activos" value={`${kpiProvActivos}/${PROVEEDORES_MOCK.length}`} sub="con OCs últimos 90 días"        tone="good"   icon={<Building2 size={16} strokeWidth={1.6} />} />
      </div>

      {/* Tab bar */}
      <div className="bg-vs-card border border-vs-line rounded-[20px] p-3 mb-4 flex items-center gap-2 flex-wrap">
        <div className="flex gap-1 bg-vs-chip p-1 rounded-full">
          {[
            { k: "ocs",         l: "Órdenes de compra", c: ocs.length },
            { k: "proveedores", l: "Proveedores",        c: PROVEEDORES_MOCK.length },
          ].map(t => (
            <button
              key={t.k}
              onClick={() => setTab(t.k as typeof tab)}
              className={cn(
                "text-[12.5px] px-3.5 py-1.5 rounded-full font-medium flex items-center gap-1.5 transition-all duration-150",
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

        {tab === "ocs" && (
          <div className="flex gap-1 bg-vs-chip p-1 rounded-full">
            {estadoTabs.map(s => (
              <button
                key={s.k}
                onClick={() => setEstadoFilter(s.k)}
                className={cn(
                  "text-[12px] px-3 py-1.5 rounded-full font-medium transition-all duration-150",
                  estadoFilter === s.k ? "bg-white shadow-sm text-vs-ink" : "text-[#8a7f70] hover:text-vs-ink"
                )}
              >
                {s.l}
              </button>
            ))}
          </div>
        )}

        <div className="flex-1" />
        <button className="flex items-center gap-1.5 bg-vs-chip text-vs-ink px-3 py-1.5 rounded-full text-[12px] font-medium hover:bg-[#ebe3d6] active:scale-95 transition-all duration-150">
          <Filter size={12} strokeWidth={1.6} />
          Filtros
        </button>
        <button className="flex items-center gap-1.5 bg-vs-chip text-vs-ink px-3 py-1.5 rounded-full text-[12px] font-medium hover:bg-[#ebe3d6] active:scale-95 transition-all duration-150">
          <Download size={12} strokeWidth={1.6} />
          CSV
        </button>
      </div>

      {/* Content */}
      {tab === "ocs" ? (
        <div className="bg-vs-card border border-vs-line rounded-[20px] overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#faf6f0] border-b border-vs-line">
                <Th>OC</Th>
                <Th>Proveedor</Th>
                <Th>Fecha · Entrega</Th>
                <Th>Items</Th>
                <Th>Estado</Th>
                <Th>Pipeline</Th>
                <Th>Tracking / Doc</Th>
                <th className="px-4 py-3 text-[11px] uppercase tracking-widest text-[#a59682] font-medium text-right">Total</th>
                <th className="px-4 py-3 text-[11px] uppercase tracking-widest text-[#a59682] font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredOCs.map(oc => (
                <OCRow
                  key={oc.id}
                  oc={oc}
                  prov={provById(oc.prov)}
                  onReceive={() => setReception(oc)}
                  onProvClick={() => { const p = provById(oc.prov); if (p) setProvDrawer(p) }}
                />
              ))}
              {filteredOCs.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-[#8a7f70] text-[13px]">
                    Sin resultados para el filtro seleccionado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="flex items-center gap-3 px-5 py-3 border-t border-vs-line-2 bg-[#faf6f0] text-[12px] text-[#8a7f70]">
            <span>
              Mostrando <b className="font-mono text-vs-ink">{filteredOCs.length}</b> de{" "}
              <b className="font-mono text-vs-ink">{ocs.length}</b> órdenes
            </span>
            <div className="flex-1" />
            <span>
              Total mostrado:{" "}
              <b className="font-mono text-vs-ink">{fmt(filteredOCs.reduce((a, o) => a + o.total, 0))}</b>
            </span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {PROVEEDORES_MOCK.map(p => (
            <ProveedorCard
              key={p.id}
              prov={p}
              ocs={ocs}
              onClick={() => setProvDrawer(p)}
            />
          ))}
        </div>
      )}

      <div className="text-[11px] text-[#a59682] text-center py-6">
        VeloService · v2.4.1 · Última sincronización hace 2 seg
      </div>

      {/* Drawers */}
      {reception && provById(reception.prov) && (
        <RecepcionDrawer
          oc={reception}
          prov={provById(reception.prov)!}
          onConfirm={confirmReception}
          onClose={() => setReception(null)}
        />
      )}
      {provDrawer && (
        <ProveedorDrawer
          prov={provDrawer}
          ocs={ocs}
          onClose={() => setProvDrawer(null)}
        />
      )}

      {/* Toast */}
      {toast && <Toast result={toast} onClose={() => setToast(null)} />}
    </div>
  )
}

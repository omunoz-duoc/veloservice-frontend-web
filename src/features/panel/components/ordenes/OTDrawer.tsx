"use client"

import { FileText, Pencil, X } from "lucide-react"
import { useOrdenDetalleQuery } from "@/features/panel/hooks/useOrdenes"
import type { OrdenTrabajoDetalle } from "@/features/panel/types/ordenes.types"

const TIPO_COLORS: Record<string, { fg: string; bg: string }> = {
  diagnostico: { fg: "#3a6ea5", bg: "#e4eaf2" },
  mantencion: { fg: "#6b5bd1", bg: "#ebe7fa" },
  reparacion: { fg: "#c85a2a", bg: "#fbeadd" },
  overhaul: { fg: "#111418", bg: "#ece7de" },
  garantia: { fg: "#2f7d4f", bg: "#e4f1e8" },
  armado: { fg: "#4a7c59", bg: "#e8f0ea" },
}

const ESTADO_COLORS: Record<string, { fg: string; bg: string; dot: string }> = {
  recibido: { fg: "#6b5d46", bg: "#efe9df", dot: "#a59682" },
  en_reparacion: { fg: "#6b5bd1", bg: "#ebe7fa", dot: "#6b5bd1" },
  en_espera: { fg: "#c85a2a", bg: "#fbeadd", dot: "#c85a2a" },
  listo: { fg: "#2f7d4f", bg: "#e4f1e8", dot: "#2f7d4f" },
  entregado: { fg: "#3a6ea5", bg: "#e4eaf2", dot: "#3a6ea5" },
}

const PRIORIDAD_COLORS: Record<string, { fg: string; bg: string }> = {
  baja: { fg: "#6b5d46", bg: "#efe9df" },
  media: { fg: "#3a6ea5", bg: "#e4eaf2" },
  alta: { fg: "#c85a2a", bg: "#fbeadd" },
}

const NEUTRAL = { fg: "#6b5d46", bg: "#efe9df" }
const NEUTRAL_STATUS = { ...NEUTRAL, dot: "#a59682" }
const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

function formatFecha(iso: string | null): string {
  if (!iso) return "—"
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "—"
  return `${d.getUTCDate()} ${MESES[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

function formatPeso(n: number): string {
  return `$${n.toLocaleString("es-CL")}`
}

function capitalize(s: string) {
  return s ? `${s.charAt(0).toUpperCase()}${s.slice(1).toLowerCase()}` : "—"
}

function fullName(person: { nombre: string; apellido: string }) {
  return [person.nombre, person.apellido].filter(Boolean).join(" ") || "—"
}

function initials(person: { nombre: string; apellido: string }) {
  const first = person.nombre.charAt(0)
  const second = person.apellido.charAt(0)
  return `${first}${second}`.toUpperCase() || "?"
}

function Field({
  label,
  value,
  mono = false,
}: {
  label: string
  value: React.ReactNode
  mono?: boolean
}) {
  return (
    <div className="min-w-0">
      <div className="text-[11px] text-[#8a7f70] mb-1.5 uppercase tracking-wider">{label}</div>
      <div className={mono ? "text-[13px] text-[#4a4438] font-mono break-words" : "text-[13px] text-[#2b2f36] font-medium break-words"}>
        {value}
      </div>
    </div>
  )
}

function ReadBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[13px] leading-relaxed text-[#2b2f36] bg-vs-chip rounded-xl p-3 border border-vs-line-2 whitespace-pre-wrap">
      {children}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="pt-4 border-t border-vs-line-2">
      <div className="text-[11px] text-[#8a7f70] uppercase tracking-widest mb-3">{title}</div>
      {children}
    </div>
  )
}

function StatusChip({ orden }: { orden: OrdenTrabajoDetalle }) {
  const cfg = ESTADO_COLORS[orden.estado.codigo] ?? NEUTRAL_STATUS
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full"
      style={{ background: cfg.bg, color: cfg.fg }}
    >
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: cfg.dot }} />
      {orden.estado.nombre}
    </span>
  )
}

function PriorityBadge({ prioridad }: { prioridad: string }) {
  const cfg = PRIORIDAD_COLORS[prioridad] ?? NEUTRAL
  return (
    <span
      className="inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full"
      style={{ background: cfg.bg, color: cfg.fg }}
    >
      {capitalize(prioridad)}
    </span>
  )
}

function MechanicPill({ mecanico }: { mecanico: OrdenTrabajoDetalle["mecanico"] }) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="w-7 h-7 rounded-full bg-vs-violet text-white flex items-center justify-center text-[10px] font-semibold shrink-0">
        {initials(mecanico)}
      </div>
      <span className="text-[12px] text-[#2b2f36] font-medium truncate">{fullName(mecanico)}</span>
    </div>
  )
}

function DrawerSkeleton({ onClose }: { onClose: () => void }) {
  const bar = "h-4 rounded-full bg-[#e7ded1] animate-pulse"

  return (
    <DrawerFrame onClose={onClose}>
      <div className="flex items-center gap-3 p-5 border-b border-vs-line-2">
        <div className="w-10 h-10 rounded-full bg-[#e7ded1] animate-pulse shrink-0" />
        <div className="flex-1 min-w-0 space-y-2">
          <div className={`${bar} w-32`} />
          <div className={`${bar} w-24`} />
        </div>
        <div className="w-20 h-8 rounded-full bg-[#e7ded1] animate-pulse" />
      </div>
      <div className="p-5 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className={`${bar} w-28`} />
          <div className={`${bar} w-20`} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className={`${bar} w-full`} />
          <div className={`${bar} w-full`} />
          <div className={`${bar} w-full`} />
        </div>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="pt-4 border-t border-vs-line-2 space-y-3">
            <div className={`${bar} w-24`} />
            <div className="grid grid-cols-2 gap-4">
              <div className={`${bar} w-full`} />
              <div className={`${bar} w-full`} />
            </div>
            <div className="h-20 rounded-xl bg-[#e7ded1] animate-pulse" />
          </div>
        ))}
      </div>
    </DrawerFrame>
  )
}

function DrawerFrame({
  children,
  onClose,
}: {
  children: React.ReactNode
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex">
      <div onClick={onClose} className="flex-1 bg-black/30 backdrop-blur-sm" />
      <div className="w-full max-w-[560px] bg-vs-bg h-full overflow-y-auto flex flex-col">
        <div className="bg-vs-card border border-vs-line rounded-[24px] m-3 mb-0 flex flex-col ">
          {children}
        </div>
        <div className="h-5" />
      </div>
    </div>
  )
}

export function OTDrawer({
  ordenId,
  onClose,
  onEdit,
}: {
  ordenId: string
  onClose: () => void
  onEdit: () => void
}) {
  const query = useOrdenDetalleQuery(ordenId)
  const orden = query.data

  if (query.isLoading) {
    return <DrawerSkeleton onClose={onClose} />
  }

  if (query.isError || !orden) {
    return (
      <DrawerFrame onClose={onClose}>
        <div className="flex items-center justify-end p-4 border-b border-vs-line-2">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-vs-chip hover:bg-[#ebe3d6] flex items-center justify-center transition-colors shrink-0"
          >
            <X size={16} strokeWidth={1.6} />
          </button>
        </div>
        <div className="flex-1 min-h-[360px] flex flex-col items-center justify-center gap-3 p-5 text-center">
          <div className="text-[13px] text-[#4a4438]">No se pudo cargar la orden.</div>
          <button
            onClick={() => void query.refetch()}
            className="bg-vs-ink text-white px-4 py-2 rounded-full text-[12px] font-medium hover:bg-[#1e2228] transition-colors"
          >
            Reintentar
          </button>
        </div>
      </DrawerFrame>
    )
  }

  const tipoCfg = TIPO_COLORS[orden.tipo.codigo] ?? NEUTRAL
  const serviciosTotal = orden.servicios.reduce((sum, s) => sum + s.precioBase, 0)
  const productosTotal = orden.productos.reduce((sum, p) => sum + p.precioVenta * p.cantidad, 0)
  const total = serviciosTotal + productosTotal
  const hasLineItems = orden.servicios.length > 0 || orden.productos.length > 0
  const bikeName = [orden.bicicleta.marca, orden.bicicleta.modelo].filter(Boolean).join(" ") || "—"

  return (
    <DrawerFrame onClose={onClose}>
      <div className="flex items-center gap-3 p-5 border-b border-vs-line-2">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
          style={{ background: tipoCfg.bg, color: tipoCfg.fg }}
        >
          <FileText size={16} strokeWidth={1.6} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] text-[#8a7f70] uppercase tracking-widest">Detalle de orden</div>
          <div className="text-[16px] font-semibold font-mono">{orden.numeroOrden}</div>
        </div>
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 bg-vs-chip text-vs-ink px-3 py-1.5 rounded-full text-[12px] font-medium hover:bg-[#ebe3d6] transition-colors"
        >
          <Pencil size={13} strokeWidth={1.6} />
          Editar
        </button>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-vs-chip hover:bg-[#ebe3d6] flex items-center justify-center transition-colors shrink-0"
        >
          <X size={16} strokeWidth={1.6} />
        </button>
      </div>

      <div className="p-5 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Estado" value={<StatusChip orden={orden} />} />
          <Field label="Prioridad" value={<PriorityBadge prioridad={orden.prioridad} />} />
        </div>

        <Section title="Fechas">
          <div className="grid grid-cols-3 gap-4">
            <Field label="Fecha de ingreso" value={formatFecha(orden.fechaIngreso)} />
            <Field label="Fecha prometida" value={formatFecha(orden.fechaPrometida)} />
            <Field label="Fecha de entrega" value={formatFecha(orden.fechaEntrega)} />
          </div>
        </Section>

        <Section title="Mecánico">
          <MechanicPill mecanico={orden.mecanico} />
        </Section>

        <Section title="Cliente">
          <div className="space-y-4">
            <Field label="Nombre" value={fullName(orden.cliente)} />
            <Field label="RUT" value={orden.cliente.rut || "—"} mono />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Teléfono" value={orden.cliente.telefono || "—"} />
              <Field label="Email" value={orden.cliente.email || "—"} />
            </div>
          </div>
        </Section>

        <Section title="Bicicleta">
          <div className="space-y-4">
            <Field label="Marca / Modelo" value={bikeName} />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Tipo" value={orden.bicicleta.tipo || "—"} />
              <Field label="Color" value={orden.bicicleta.color || "—"} />
            </div>
            <Field label="N° de serie" value={orden.bicicleta.numeroSerie || "—"} mono />
          </div>
        </Section>

        <Section title="Trabajo">
          <div className="space-y-4">
            <Field label="Diagnóstico inicial" value={<ReadBox>{orden.diagnosticoInicial}</ReadBox>} />
            <Field label="Diagnóstico final" value={<ReadBox>{orden.diagnosticoFinal || "—"}</ReadBox>} />
            <Field label="Obs. del cliente" value={<ReadBox>{orden.observacionesCliente}</ReadBox>} />
          </div>
        </Section>

        {orden.servicios.length > 0 && (
          <Section title="Servicios">
            <div className="divide-y divide-vs-line-2">
              {orden.servicios.map(servicio => (
                <div key={servicio.id} className="flex items-center justify-between gap-4 py-2 first:pt-0">
                  <div className="text-[13px] text-[#2b2f36] font-medium">{servicio.nombre}</div>
                  <div className="text-[13px] text-[#2b2f36] font-mono shrink-0">{formatPeso(servicio.precioBase)}</div>
                </div>
              ))}
              {orden.servicios.length > 1 && (
                <div className="flex items-center justify-between gap-4 pt-3 text-[13px] font-semibold">
                  <span>Total servicios</span>
                  <span className="font-mono">{formatPeso(serviciosTotal)}</span>
                </div>
              )}
            </div>
          </Section>
        )}

        {orden.productos.length > 0 && (
          <Section title="Productos">
            <div className="divide-y divide-vs-line-2">
              {orden.productos.map(producto => (
                <div key={producto.id} className="py-2 first:pt-0">
                  <div className="text-[13px] text-[#2b2f36] font-medium">{producto.nombre}</div>
                  <div className="flex items-center justify-between gap-4 mt-1">
                    <div className="text-[11.5px] text-[#8a7f70] font-mono">
                      {producto.sku || "S/SKU"} ×{producto.cantidad}
                    </div>
                    <div className="text-[13px] text-[#2b2f36] font-mono">
                      {formatPeso(producto.precioVenta * producto.cantidad)}
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between gap-4 pt-3 text-[13px] font-semibold">
                <span>Total productos</span>
                <span className="font-mono">{formatPeso(productosTotal)}</span>
              </div>
            </div>
          </Section>
        )}

        {hasLineItems && (
          <div className="border-t border-vs-line-2 pt-4 flex items-center justify-between gap-4">
            <div className="text-[14px] font-semibold text-[#2b2f36]">Total</div>
            <div className="text-[15px] font-semibold text-[#2b2f36] font-mono">{formatPeso(total)}</div>
          </div>
        )}

        {orden.comentarios.length > 0 && (
          <Section title="Comentarios">
            <ul className="space-y-4 relative pl-5 before:absolute before:left-[6px] before:top-1 before:bottom-1 before:w-px before:bg-vs-line-2">
              {orden.comentarios.map((comentario, i) => (
                <li key={`${comentario.createdAt}-${i}`} className="relative">
                  <span className="absolute -left-5 top-1.5 w-3 h-3 rounded-full bg-vs-violet-bg border-2 border-white" />
                  <div className="text-[11.5px] text-[#8a7f70]">
                    {comentario.usuario} · {formatFecha(comentario.createdAt)}
                  </div>
                  <div className="text-[13px] leading-relaxed text-[#2b2f36] mt-1">{comentario.texto}</div>
                </li>
              ))}
            </ul>
          </Section>
        )}
      </div>
    </DrawerFrame>
  )
}

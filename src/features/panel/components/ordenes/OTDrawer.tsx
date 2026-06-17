"use client"

import { useEffect, useMemo, useState, type ReactNode } from "react"
import { useQuery } from "@tanstack/react-query"
import { Check, FileText, Loader2, Pencil, X } from "lucide-react"
import { useMecanicosActivos } from "@/features/panel/hooks/useMecanicosActivos"
import { useOrdenDetalleQuery, useUpdateOrdenMutation } from "@/features/panel/hooks/useOrdenes"
import { useServiciosQuery } from "@/features/panel/hooks/useServicios"
import { nuevaOTService } from "@/features/panel/services/nuevaOT.provider"
import type { EstadoOT, OrdenTrabajo, Prioridad, ProductoResult, TipoOT } from "@/features/panel/components/ordenes/ordenes.types"
import type { OrdenProductoCambioPayload, OrdenServicioCambioPayload, OrdenTrabajoDetalle } from "@/features/panel/types/ordenes.types"
import type { Servicio } from "@/features/panel/types/servicios.types"

type Person = { nombre?: string | null; apellido?: string | null }
type MecanicoOptionSource = Person & { id: string }
type ProductoCatalogo = ProductoResult & { sku?: string }

type DraftServicio = {
  lineId: string
  servicioId: string
  nombre: string
  precioBase: number
  precioAplicado: number
  descuentoAplicado: number
  notas?: string
  originalPrecioAplicado?: number
  originalDescuentoAplicado?: number
  originalNotas?: string
  isNew: boolean
  isDeleted?: boolean
}

type DraftProducto = {
  lineId: string
  productoId: string
  nombre: string
  sku?: string
  cantidad: number
  precioVenta: number
  precioAplicado: number
  notas?: string
  proporcionadoPorCliente: boolean
  originalCantidad?: number
  originalNotas?: string
  originalProporcionadoPorCliente?: boolean
  stock?: number
  isNew: boolean
  isDeleted?: boolean
}

const TIPO_COLORS: Record<string, { fg: string; bg: string }> = {
  diagnostico: { fg: "#3a6ea5", bg: "#e4eaf2" },
  revision: { fg: "#3a6ea5", bg: "#e4eaf2" },
  mantencion: { fg: "#6b5bd1", bg: "#ebe7fa" },
  reparacion: { fg: "#c85a2a", bg: "#fbeadd" },
  overhaul: { fg: "#111418", bg: "#ece7de" },
  garantia: { fg: "#2f7d4f", bg: "#e4f1e8" },
  armado: { fg: "#4a7c59", bg: "#e8f0ea" },
  personalizacion: { fg: "#3a6ea5", bg: "#e4eaf2" },
}

const ESTADO_COLORS: Record<string, { fg: string; bg: string; dot: string }> = {
  recibido: { fg: "#6b5d46", bg: "#efe9df", dot: "#a59682" },
  diagnostico: { fg: "#3a6ea5", bg: "#e4eaf2", dot: "#3a6ea5" },
  proceso: { fg: "#6b5bd1", bg: "#ebe7fa", dot: "#6b5bd1" },
  en_proceso: { fg: "#6b5bd1", bg: "#ebe7fa", dot: "#6b5bd1" },
  en_reparacion: { fg: "#6b5bd1", bg: "#ebe7fa", dot: "#6b5bd1" },
  espera: { fg: "#c85a2a", bg: "#fbeadd", dot: "#c85a2a" },
  en_espera: { fg: "#c85a2a", bg: "#fbeadd", dot: "#c85a2a" },
  calidad: { fg: "#8c6a1e", bg: "#faecd6", dot: "#8c6a1e" },
  listo: { fg: "#2f7d4f", bg: "#e4f1e8", dot: "#2f7d4f" },
  entregado: { fg: "#3a6ea5", bg: "#e4eaf2", dot: "#3a6ea5" },
  cancelado: { fg: "#6b5d46", bg: "#ece7de", dot: "#6b5d46" },
}

const PRIORIDAD_COLORS: Record<string, { fg: string; bg: string }> = {
  baja: { fg: "#6b5d46", bg: "#efe9df" },
  media: { fg: "#3a6ea5", bg: "#e4eaf2" },
  alta: { fg: "#c85a2a", bg: "#fbeadd" },
}

const TIPO_OPTIONS: Array<{ value: TipoOT; label: string }> = [
  { value: "mantencion", label: "Mantencion" },
  { value: "reparacion", label: "Reparacion" },
  { value: "revision", label: "Revision" },
  { value: "garantia", label: "Garantia" },
  { value: "armado", label: "Armado" },
]

const ESTADO_OPTIONS: Array<{ value: EstadoOT; label: string }> = [
  { value: "recibido", label: "Recibido" },
  { value: "diagnostico", label: "Diagnostico" },
  { value: "espera", label: "Esp. repuesto" },
  { value: "proceso", label: "En proceso" },
  { value: "calidad", label: "Control calidad" },
  { value: "listo", label: "Listo" },
  { value: "entregado", label: "Entregado" },
  { value: "cancelado", label: "Cancelado" },
]

const PRIORIDAD_OPTIONS: Array<{ value: Prioridad; label: string }> = [
  { value: "baja", label: "Baja" },
  { value: "media", label: "Media" },
  { value: "alta", label: "Alta" },
]

const TIPO_MAP: Record<string, TipoOT> = {
  personalizacion: "personalizacion",
  mantencion: "mantencion",
  mantencion_general: "mantencion",
  mantenimiento: "mantencion",
  reparacion: "reparacion",
  revision: "revision",
  diagnostico: "revision",
  garantia: "garantia",
  armado: "armado",
  overhaul: "revision",
}

const ESTADO_MAP: Record<string, EstadoOT> = {
  pendiente: "recibido",
  recibido: "recibido",
  recibida: "recibido",
  en_diagnostico: "diagnostico",
  diagnostico: "diagnostico",
  en_reparacion: "proceso",
  en_proceso: "proceso",
  esperando_repuesto: "espera",
  esperando_repuestos: "espera",
  espera_repuesto: "espera",
  control_calidad: "calidad",
  lista_para_entrega: "listo",
  listo: "listo",
  entregado: "entregado",
  entregada: "entregado",
  cancelada: "cancelado",
  cancelado: "cancelado",
}

const NEUTRAL = { fg: "#6b5d46", bg: "#efe9df" }
const NEUTRAL_STATUS = { ...NEUTRAL, dot: "#a59682" }
const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

function normalizeCode(value: string | null | undefined) {
  return (value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "_")
}

function normalizeTipo(codigo: string | null | undefined): TipoOT {
  return TIPO_MAP[normalizeCode(codigo)] ?? "mantencion"
}

function normalizeEstado(codigo: string | null | undefined): EstadoOT {
  return ESTADO_MAP[normalizeCode(codigo)] ?? "recibido"
}

function normalizePrioridad(prioridad: string | null | undefined): Prioridad {
  const value = normalizeCode(prioridad)
  if (value === ["ur", "gente"].join("")) return "alta"
  if (value === "baja" || value === "alta") return value
  return "media"
}

function isUuid(value: string | null | undefined) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value ?? "")
}

function formatFecha(iso: string | null | undefined): string {
  if (!iso) return "-"
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "-"
  return `${d.getUTCDate()} ${MESES[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

function formatPeso(n: number | null | undefined): string {
  const safeValue = typeof n === "number" && Number.isFinite(n) ? n : 0
  return `$${safeValue.toLocaleString("es-CL")}`
}

function capitalize(s: string) {
  return s ? `${s.charAt(0).toUpperCase()}${s.slice(1).toLowerCase()}` : "-"
}

function fullName(person: Person | null | undefined) {
  return [person?.nombre, person?.apellido].filter(Boolean).join(" ") || "-"
}

function initials(person: Person | null | undefined) {
  const first = person?.nombre?.charAt(0) ?? ""
  const second = person?.apellido?.charAt(0) ?? ""
  return `${first}${second}`.toUpperCase() || "?"
}

function serviceCatalogPrice(servicio: Servicio) {
  return servicio.precioBase ?? 0
}

function draftServicioFromBackend(servicio: OrdenTrabajoDetalle["servicios"][number]): DraftServicio {
  const precioAplicado = servicio.precioAplicado ?? servicio.precioBase ?? 0
  const descuentoAplicado = servicio.descuentoAplicado ?? 0
  return {
    lineId: servicio.id,
    servicioId: servicio.servicioId,
    nombre: servicio.nombre,
    precioBase: servicio.precioBase ?? precioAplicado,
    precioAplicado,
    descuentoAplicado,
    notas: servicio.notas,
    originalPrecioAplicado: precioAplicado,
    originalDescuentoAplicado: descuentoAplicado,
    originalNotas: servicio.notas,
    isNew: false,
  }
}

function draftServicioFromCatalog(servicio: Servicio, notas: string): DraftServicio {
  const precioBase = serviceCatalogPrice(servicio)
  return {
    lineId: `draft-servicio-${servicio.id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    servicioId: servicio.id,
    nombre: servicio.nombre,
    precioBase,
    precioAplicado: precioBase,
    descuentoAplicado: 0,
    notas: notas.trim() || undefined,
    isNew: true,
  }
}

function servicioChanged(servicio: DraftServicio) {
  return !servicio.isNew && !servicio.isDeleted && (
    servicio.precioAplicado !== servicio.originalPrecioAplicado ||
    servicio.descuentoAplicado !== servicio.originalDescuentoAplicado ||
    (servicio.notas ?? "") !== (servicio.originalNotas ?? "")
  )
}

function sanitizeMoneyInput(value: string) {
  return Math.max(0, Math.floor(Number(value)) || 0)
}

function productoPrecioUnitario(producto: OrdenTrabajoDetalle["productos"][number]) {
  return producto.precioAplicado ?? producto.precioVenta ?? 0
}

function normalizeCantidad(cantidad: number, stock?: number) {
  const safe = Number.isFinite(cantidad) ? Math.max(1, Math.floor(cantidad)) : 1
  return typeof stock === "number" && stock > 0 ? Math.min(safe, stock) : safe
}

function sanitizeCantidadInput(value: string, stock?: number) {
  return normalizeCantidad(Number(value), stock)
}

function draftProductoFromBackend(producto: OrdenTrabajoDetalle["productos"][number]): DraftProducto {
  const proporcionadoPorCliente = producto.proporcionadoPorCliente ?? false
  return {
    lineId: producto.id,
    productoId: producto.productoId,
    nombre: producto.nombre,
    sku: producto.sku,
    cantidad: normalizeCantidad(producto.cantidad),
    precioVenta: producto.precioVenta ?? productoPrecioUnitario(producto),
    precioAplicado: productoPrecioUnitario(producto),
    notas: producto.notas,
    proporcionadoPorCliente,
    originalCantidad: normalizeCantidad(producto.cantidad),
    originalNotas: producto.notas,
    originalProporcionadoPorCliente: proporcionadoPorCliente,
    isNew: false,
  }
}

function draftProductoFromCatalog(
  producto: ProductoCatalogo,
  cantidad: number,
  notas: string,
  proporcionadoPorCliente: boolean
): DraftProducto {
  const safeCantidad = normalizeCantidad(cantidad, producto.stock)
  return {
    lineId: `draft-producto-${producto.id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    productoId: producto.id,
    nombre: producto.nombre,
    sku: producto.sku,
    cantidad: safeCantidad,
    precioVenta: producto.precioVenta,
    precioAplicado: producto.precioVenta,
    notas: notas.trim() || undefined,
    proporcionadoPorCliente,
    stock: producto.stock,
    isNew: true,
  }
}

function productoChanged(producto: DraftProducto) {
  return !producto.isNew && !producto.isDeleted && (
    producto.cantidad !== producto.originalCantidad ||
    (producto.notas ?? "") !== (producto.originalNotas ?? "") ||
    producto.proporcionadoPorCliente !== producto.originalProporcionadoPorCliente
  )
}

function detalleToDraft(orden: OrdenTrabajoDetalle): OrdenTrabajo {
  const tipoCodigo = normalizeTipo(orden.tipo.codigo)

  return {
    id: orden.numeroOrden,
    backendId: orden.id,
    tipo: {
      id: orden.tipo.id,
      codigo: tipoCodigo,
      nombre: orden.tipo.nombre,
    },
    estado: normalizeEstado(orden.estado.codigo),
    prioridad: normalizePrioridad(orden.prioridad),
    fechaIngreso: formatFecha(orden.fechaIngreso),
    fechaEstimada: orden.fechaPrometida ?? "",
    mecanicoId: isUuid(orden.mecanico?.id) ? orden.mecanico.id : "",
    clienteNombre: fullName(orden.cliente),
    clienteTelefono: orden.cliente?.telefono,
    clienteEmail: orden.cliente?.email,
    biciMarca: [orden.bicicleta?.marca, orden.bicicleta?.modelo].filter(Boolean).join(" "),
    biciTipo: orden.bicicleta?.tipo ?? "Otro",
    biciColor: orden.bicicleta?.color ?? "",
    biciNumSerie: orden.bicicleta?.numeroSerie,
    descripcion: orden.diagnosticoInicial || orden.observacionesCliente || "Sin descripcion",
    notasInternas: orden.diagnosticoFinal ?? undefined,
  }
}

function Field({ label, value, mono = false }: { label: string; value: ReactNode; mono?: boolean }) {
  return (
    <div className="min-w-0">
      <div className="text-[11px] text-[#8a7f70] mb-1.5 uppercase tracking-wider">{label}</div>
      <div className={mono ? "text-[13px] text-[#4a4438] font-mono break-words" : "text-[13px] text-[#2b2f36] font-medium break-words"}>
        {value}
      </div>
    </div>
  )
}

function EditSelect<TValue extends string>({
  label,
  value,
  options,
  disabled,
  onChange,
}: {
  label: string
  value: TValue
  options: Array<{ value: TValue; label: string }>
  disabled: boolean
  onChange: (value: TValue) => void
}) {
  return (
    <label className="min-w-0">
      <span className="text-[11px] text-[#8a7f70] mb-1.5 uppercase tracking-wider block">{label}</span>
      <select
        value={value}
        disabled={disabled}
        onChange={e => onChange(e.target.value as TValue)}
        className="w-full rounded-xl border border-vs-line-2 bg-vs-chip px-3 py-2 text-[13px] font-medium text-[#2b2f36] outline-none disabled:opacity-60"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function ReadBox({ children }: { children: ReactNode }) {
  return (
    <div className="text-[13px] leading-relaxed text-[#2b2f36] bg-vs-chip rounded-xl p-3 border border-vs-line-2 whitespace-pre-wrap">
      {children}
    </div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="pt-4 border-t border-vs-line-2">
      <div className="text-[11px] text-[#8a7f70] uppercase tracking-widest mb-3">{title}</div>
      {children}
    </div>
  )
}

function StatusChip({ orden }: { orden: OrdenTrabajoDetalle }) {
  const codigo = normalizeEstado(orden.estado.codigo)
  const cfg = ESTADO_COLORS[codigo] ?? NEUTRAL_STATUS
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
  const cfg = PRIORIDAD_COLORS[normalizePrioridad(prioridad)] ?? NEUTRAL
  return (
    <span
      className="inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full"
      style={{ background: cfg.bg, color: cfg.fg }}
    >
      {capitalize(prioridad)}
    </span>
  )
}

function MechanicPill({ mecanico }: { mecanico: OrdenTrabajoDetalle["mecanico"] | null | undefined }) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="w-7 h-7 rounded-full bg-vs-violet text-white flex items-center justify-center text-[10px] font-semibold shrink-0">
        {initials(mecanico)}
      </div>
      <span className="text-[12px] text-[#2b2f36] font-medium truncate">{fullName(mecanico)}</span>
    </div>
  )
}

function ServicioLine({
  servicio,
  isEditing,
  disabled,
  onPrecioChange,
  onDescuentoChange,
  onNotasChange,
  onRemove,
  onRestore,
}: {
  servicio: DraftServicio
  isEditing: boolean
  disabled: boolean
  onPrecioChange: (lineId: string, value: string) => void
  onDescuentoChange: (lineId: string, value: string) => void
  onNotasChange: (lineId: string, value: string) => void
  onRemove: (lineId: string) => void
  onRestore: (lineId: string) => void
}) {
  const isChanged = servicioChanged(servicio)

  return (
    <div className={servicio.isDeleted ? "rounded-xl border border-vs-warn/20 bg-vs-warn-bg/40 px-3 py-2.5 space-y-2 opacity-80" : "rounded-xl border border-vs-line-2 bg-white px-3 py-2.5 space-y-2"}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-[13px] text-[#2b2f36] font-medium truncate">{servicio.nombre}</div>
            {isEditing && servicio.isNew && <span className="rounded-full bg-vs-good-bg px-2 py-0.5 text-[10px] font-semibold text-vs-good">Nuevo</span>}
            {isEditing && isChanged && <span className="rounded-full bg-vs-violet-bg px-2 py-0.5 text-[10px] font-semibold text-vs-violet">Editado</span>}
            {isEditing && servicio.isDeleted && <span className="rounded-full bg-vs-warn-bg px-2 py-0.5 text-[10px] font-semibold text-vs-warn">Marcado para eliminar</span>}
          </div>
          {!isEditing && servicio.notas && <div className="text-[12px] text-[#4a4438] mt-1 whitespace-pre-wrap">Notas: {servicio.notas}</div>}
        </div>
        {!isEditing && (
          <div className="text-right shrink-0">
            <div className="text-[13px] text-[#2b2f36] font-mono">{formatPeso(servicio.precioAplicado)}</div>
            {servicio.descuentoAplicado > 0 && <div className="text-[11px] text-[#8a7f70] mt-0.5">Desc. {formatPeso(servicio.descuentoAplicado)}</div>}
          </div>
        )}
      </div>

      {isEditing && (
        <div className="space-y-2">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <label className="space-y-1">
              <span className="text-[11px] text-[#8a7f70] uppercase tracking-wider block">Precio aplicado</span>
              <input
                type="number"
                min={0}
                value={servicio.precioAplicado}
                disabled={disabled || servicio.isDeleted}
                onChange={event => onPrecioChange(servicio.lineId, event.target.value)}
                className="w-full rounded-xl border border-vs-line-2 bg-white px-3 py-2 text-[13px] outline-none disabled:opacity-60"
              />
            </label>
            <label className="space-y-1">
              <span className="text-[11px] text-[#8a7f70] uppercase tracking-wider block">Descuento</span>
              <input
                type="number"
                min={0}
                value={servicio.descuentoAplicado}
                disabled={disabled || servicio.isDeleted}
                onChange={event => onDescuentoChange(servicio.lineId, event.target.value)}
                className="w-full rounded-xl border border-vs-line-2 bg-white px-3 py-2 text-[13px] outline-none disabled:opacity-60"
              />
            </label>
          </div>
          <label className="space-y-1 block">
            <span className="text-[11px] text-[#8a7f70] uppercase tracking-wider block">Notas</span>
            <input
              value={servicio.notas ?? ""}
              disabled={disabled || servicio.isDeleted}
              onChange={event => onNotasChange(servicio.lineId, event.target.value)}
              placeholder="Opcional"
              className="w-full rounded-xl border border-vs-line-2 bg-white px-3 py-2 text-[13px] outline-none disabled:opacity-60"
            />
          </label>
          <div className="flex items-center justify-between gap-3">
            <div className="text-[12px] text-[#2b2f36] font-mono">{formatPeso(servicio.precioAplicado)}</div>
            {servicio.isDeleted ? (
              <button type="button" onClick={() => onRestore(servicio.lineId)} disabled={disabled} className="text-[12px] font-medium text-vs-violet hover:text-vs-ink disabled:opacity-60">Deshacer</button>
            ) : (
              <button type="button" onClick={() => onRemove(servicio.lineId)} disabled={disabled} className="text-[12px] font-medium text-vs-warn hover:bg-vs-warn-bg px-2 py-1 rounded-lg disabled:opacity-60">Eliminar</button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function ProductoLine({
  producto,
  isEditing,
  disabled,
  onCantidadChange,
  onNotasChange,
  onProporcionadoChange,
  onRemove,
  onRestore,
}: {
  producto: DraftProducto
  isEditing: boolean
  disabled: boolean
  onCantidadChange: (lineId: string, value: string) => void
  onNotasChange: (lineId: string, value: string) => void
  onProporcionadoChange: (lineId: string, value: boolean) => void
  onRemove: (lineId: string) => void
  onRestore: (lineId: string) => void
}) {
  const isChanged = productoChanged(producto)
  const lineTotal = producto.precioAplicado * producto.cantidad

  return (
    <div className={producto.isDeleted ? "rounded-xl border border-vs-warn/20 bg-vs-warn-bg/40 px-3 py-2.5 space-y-2 opacity-80" : "rounded-xl border border-vs-line-2 bg-white px-3 py-2.5 space-y-2"}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-[13px] text-[#2b2f36] font-medium truncate">{producto.nombre}</div>
            {isEditing && producto.isNew && <span className="rounded-full bg-vs-good-bg px-2 py-0.5 text-[10px] font-semibold text-vs-good">Nuevo</span>}
            {isEditing && isChanged && <span className="rounded-full bg-vs-violet-bg px-2 py-0.5 text-[10px] font-semibold text-vs-violet">Editado</span>}
            {isEditing && producto.isDeleted && <span className="rounded-full bg-vs-warn-bg px-2 py-0.5 text-[10px] font-semibold text-vs-warn">Marcado para eliminar</span>}
          </div>
          <div className="text-[11.5px] text-[#8a7f70] font-mono mt-1">
            {producto.sku || "S/SKU"} x{producto.cantidad}
          </div>
          {!isEditing && producto.notas && <div className="text-[12px] text-[#4a4438] mt-1 whitespace-pre-wrap">Notas: {producto.notas}</div>}
          {!isEditing && producto.proporcionadoPorCliente && <div className="text-[11.5px] text-[#8a7f70] mt-1">Proporcionado por cliente</div>}
        </div>
        {!isEditing && (
          <div className="text-[13px] text-[#2b2f36] font-mono shrink-0">{formatPeso(lineTotal)}</div>
        )}
      </div>

      {isEditing && (
        <div className="space-y-2">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <label className="space-y-1">
              <span className="text-[11px] text-[#8a7f70] uppercase tracking-wider block">Cantidad</span>
              <input
                type="number"
                min={1}
                max={producto.stock}
                value={producto.cantidad}
                disabled={disabled || producto.isDeleted}
                onChange={event => onCantidadChange(producto.lineId, event.target.value)}
                className="w-full rounded-xl border border-vs-line-2 bg-white px-3 py-2 text-[13px] outline-none disabled:opacity-60"
              />
            </label>
            <div className="space-y-1">
              <span className="text-[11px] text-[#8a7f70] uppercase tracking-wider block">Total linea</span>
              <div className="rounded-xl border border-vs-line-2 bg-vs-chip px-3 py-2 text-[13px] font-mono text-[#2b2f36]">
                {formatPeso(lineTotal)}
              </div>
            </div>
          </div>
          <label className="space-y-1 block">
            <span className="text-[11px] text-[#8a7f70] uppercase tracking-wider block">Notas</span>
            <input
              value={producto.notas ?? ""}
              disabled={disabled || producto.isDeleted}
              onChange={event => onNotasChange(producto.lineId, event.target.value)}
              placeholder="Opcional"
              className="w-full rounded-xl border border-vs-line-2 bg-white px-3 py-2 text-[13px] outline-none disabled:opacity-60"
            />
          </label>
          <div className="flex items-center justify-between gap-3">
            <label className="inline-flex items-center gap-2 text-[12px] text-[#4a4438]">
              <input
                type="checkbox"
                checked={producto.proporcionadoPorCliente}
                disabled={disabled || producto.isDeleted}
                onChange={event => onProporcionadoChange(producto.lineId, event.target.checked)}
                className="h-4 w-4 rounded border-vs-line-2"
              />
              Cliente lo proporciona
            </label>
            {producto.isDeleted ? (
              <button type="button" onClick={() => onRestore(producto.lineId)} disabled={disabled} className="text-[12px] font-medium text-vs-violet hover:text-vs-ink disabled:opacity-60">Deshacer</button>
            ) : (
              <button type="button" onClick={() => onRemove(producto.lineId)} disabled={disabled} className="text-[12px] font-medium text-vs-warn hover:bg-vs-warn-bg px-2 py-1 rounded-lg disabled:opacity-60">Eliminar</button>
            )}
          </div>
          {typeof producto.stock === "number" && (
            <div className="text-[11.5px] text-[#8a7f70]">Stock disponible: {producto.stock}</div>
          )}
        </div>
      )}
    </div>
  )
}

function DrawerFrame({
  children,
  onClose,
  disableClose = false,
}: {
  children: ReactNode
  onClose: () => void
  disableClose?: boolean
}) {
  return (
    <div className="fixed inset-0 z-50 flex">
      <div onClick={disableClose ? undefined : onClose} className="flex-1 bg-black/30 backdrop-blur-sm" />
      <div className="flex h-full w-full max-w-[560px] flex-col overflow-y-auto bg-black/30 backdrop-blur-sm">
        <div className="bg-vs-card border border-vs-line rounded-[24px] m-3 mb-0 flex flex-col">
          {children}
        </div>
        <div className="h-5" />
      </div>
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className={`${bar} w-28`} />
          <div className={`${bar} w-20`} />
        </div>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="pt-4 border-t border-vs-line-2 space-y-3">
            <div className={`${bar} w-24`} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

export function OTDrawer({
  ordenId,
  onClose,
}: {
  ordenId: string
  onClose: () => void
}) {
  const query = useOrdenDetalleQuery(ordenId)
  const updateOrden = useUpdateOrdenMutation()
  const mecanicosQuery = useMecanicosActivos()
  const serviciosQuery = useServiciosQuery()
  const orden = query.data
  const [mode, setMode] = useState<"view" | "edit">("view")
  const [draft, setDraft] = useState<OrdenTrabajo | null>(null)
  const [draftServicios, setDraftServicios] = useState<DraftServicio[]>([])
  const [selectedServicioId, setSelectedServicioId] = useState("")
  const [servicioNotas, setServicioNotas] = useState("")
  const [servicioError, setServicioError] = useState<string | null>(null)
  const [draftProductos, setDraftProductos] = useState<DraftProducto[]>([])
  const [selectedProductoId, setSelectedProductoId] = useState("")
  const [productoCantidad, setProductoCantidad] = useState(1)
  const [productoNotas, setProductoNotas] = useState("")
  const [productoProporcionado, setProductoProporcionado] = useState(false)
  const [productoError, setProductoError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const productosQuery = useQuery({
    queryKey: ["ordenes", "productos-catalogo"],
    queryFn: async () => {
      const response = await nuevaOTService.getProductos()
      return response.productos as ProductoCatalogo[]
    },
    staleTime: 30_000,
    enabled: mode === "edit",
  })

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!orden) return
    setDraft(detalleToDraft(orden))
    setDraftServicios((orden.servicios ?? []).map(draftServicioFromBackend))
    setSelectedServicioId("")
    setServicioNotas("")
    setServicioError(null)
    setDraftProductos((orden.productos ?? []).map(draftProductoFromBackend))
    setSelectedProductoId("")
    setProductoCantidad(1)
    setProductoNotas("")
    setProductoProporcionado(false)
    setProductoError(null)
    setMode("view")
    setSaveError(null)
  }, [orden])
  /* eslint-enable react-hooks/set-state-in-effect */

  const mecanicoOptions = useMemo(() => {
    const current = draft?.mecanicoId
      ? [{ value: draft.mecanicoId, label: orden ? fullName(orden.mecanico) : draft.mecanicoId }]
      : [{ value: "", label: "Sin asignar" }]
    const mecanicosData = mecanicosQuery.data as
      | MecanicoOptionSource[]
      | { mecanicos?: MecanicoOptionSource[] }
      | undefined
    const mecanicos = Array.isArray(mecanicosData) ? mecanicosData : mecanicosData?.mecanicos ?? []
    const remote = mecanicos.map(mecanico => ({
      value: mecanico.id,
      label: fullName(mecanico),
    })) ?? []
    const options = [...current, ...remote]

    return options.filter((option, index, list) =>
      list.findIndex(item => item.value === option.value) === index
    )
  }, [draft, mecanicosQuery.data, orden])

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

  const isEditing = mode === "edit"
  const isSaving = updateOrden.isPending
  const tipoCfg = TIPO_COLORS[normalizeTipo(orden.tipo.codigo)] ?? NEUTRAL
  const servicios = draftServicios
  const productos = draftProductos
  const comentarios = orden.comentarios ?? []
  const serviciosTotal = servicios.reduce((sum, s) => s.isDeleted ? sum : sum + s.precioAplicado, 0)
  const productosTotal = productos.reduce((sum, p) => p.isDeleted ? sum : sum + p.precioAplicado * p.cantidad, 0)
  const total = serviciosTotal + productosTotal
  const hasLineItems = servicios.some(servicio => !servicio.isDeleted) || productos.some(producto => !producto.isDeleted)
  const bikeName = [orden.bicicleta?.marca, orden.bicicleta?.modelo].filter(Boolean).join(" ") || "-"
  const serviciosDisponibles = serviciosQuery.data ?? []
  const servicioOptions = serviciosDisponibles.map(servicio => ({
    value: servicio.id,
    label: `${servicio.nombre} - ${formatPeso(serviceCatalogPrice(servicio))}`,
  }))
  const selectedServicio = serviciosDisponibles.find(servicio => servicio.id === selectedServicioId)
  const productosDisponibles = productosQuery.data ?? []
  const productoOptions = productosDisponibles.map(producto => ({
    value: producto.id,
    label: `${producto.nombre} - ${formatPeso(producto.precioVenta)}${typeof producto.stock === "number" ? ` - Stock ${producto.stock}` : ""}`,
  }))
  const selectedProducto = productosDisponibles.find(producto => producto.id === selectedProductoId)

  const resetEdit = () => {
    setDraft(detalleToDraft(orden))
    setDraftServicios((orden.servicios ?? []).map(draftServicioFromBackend))
    setSelectedServicioId("")
    setServicioNotas("")
    setServicioError(null)
    setDraftProductos((orden.productos ?? []).map(draftProductoFromBackend))
    setSelectedProductoId("")
    setProductoCantidad(1)
    setProductoNotas("")
    setProductoProporcionado(false)
    setProductoError(null)
    setMode("view")
    setSaveError(null)
  }

  const resetProductoForm = () => {
    setSelectedProductoId("")
    setProductoCantidad(1)
    setProductoNotas("")
    setProductoProporcionado(false)
  }

  const resetServicioForm = () => {
    setSelectedServicioId("")
    setServicioNotas("")
  }

  const handleAddDraftServicio = () => {
    if (!isEditing) return
    if (!selectedServicio) {
      setServicioError("Selecciona un servicio.")
      return
    }
    const existing = draftServicios.find(servicio => servicio.servicioId === selectedServicio.id)
    if (existing) {
      if (existing.isDeleted) {
        setDraftServicios(current => current.map(servicio =>
          servicio.lineId === existing.lineId ? { ...servicio, isDeleted: false, notas: servicio.notas || servicioNotas.trim() || undefined } : servicio
        ))
        setServicioError("El servicio ya existia y fue restaurado en el draft.")
      } else {
        setServicioError("El servicio ya esta asociado a la orden.")
      }
      resetServicioForm()
      return
    }
    setDraftServicios(current => [draftServicioFromCatalog(selectedServicio, servicioNotas), ...current])
    resetServicioForm()
    setServicioError(null)
  }

  const handleServicioPrecioChange = (lineId: string, value: string) => {
    setDraftServicios(current => current.map(servicio =>
      servicio.lineId === lineId ? { ...servicio, precioAplicado: sanitizeMoneyInput(value) } : servicio
    ))
  }

  const handleServicioDescuentoChange = (lineId: string, value: string) => {
    setDraftServicios(current => current.map(servicio =>
      servicio.lineId === lineId ? { ...servicio, descuentoAplicado: sanitizeMoneyInput(value) } : servicio
    ))
  }

  const handleServicioNotasChange = (lineId: string, value: string) => {
    setDraftServicios(current => current.map(servicio =>
      servicio.lineId === lineId ? { ...servicio, notas: value } : servicio
    ))
  }

  const handleRemoveDraftServicio = (lineId: string) => {
    setDraftServicios(current => current.flatMap(servicio => {
      if (servicio.lineId !== lineId) return [servicio]
      return servicio.isNew ? [] : [{ ...servicio, isDeleted: true }]
    }))
  }

  const handleRestoreDraftServicio = (lineId: string) => {
    setDraftServicios(current => current.map(servicio =>
      servicio.lineId === lineId ? { ...servicio, isDeleted: false } : servicio
    ))
  }

  const buildServiciosCambios = (): OrdenServicioCambioPayload[] => {
    return draftServicios.flatMap<OrdenServicioCambioPayload>(servicio => {
      if (servicio.isNew) {
        if (servicio.isDeleted) return []
        return [{
          accion: "AGREGAR",
          servicioId: servicio.servicioId,
          notas: servicio.notas?.trim() || undefined,
        }]
      }
      if (servicio.isDeleted) return [{ accion: "ELIMINAR", lineaId: servicio.lineId }]
      if (servicioChanged(servicio)) {
        return [{
          accion: "ACTUALIZAR",
          lineaId: servicio.lineId,
          precioAplicado: servicio.precioAplicado,
          descuentoAplicado: servicio.descuentoAplicado,
          notas: servicio.notas?.trim() || undefined,
        }]
      }
      return []
    })
  }

  const handleAddDraftProducto = () => {
    if (!isEditing) return
    if (!selectedProducto) {
      setProductoError("Selecciona un producto.")
      return
    }
    const cantidad = normalizeCantidad(productoCantidad, selectedProducto.stock)
    if (typeof selectedProducto.stock === "number" && selectedProducto.stock <= 0) {
      setProductoError("El producto no tiene stock disponible.")
      return
    }
    const existing = draftProductos.find(producto => producto.productoId === selectedProducto.id)
    if (existing) {
      setDraftProductos(current => current.map(producto => {
        if (producto.lineId !== existing.lineId) return producto
        const stock = selectedProducto.stock ?? producto.stock
        const nextCantidad = normalizeCantidad(producto.cantidad + cantidad, stock)
        return {
          ...producto,
          cantidad: nextCantidad,
          stock,
          notas: producto.notas || productoNotas.trim() || undefined,
          proporcionadoPorCliente: producto.proporcionadoPorCliente || productoProporcionado,
          isDeleted: false,
        }
      }))
      setProductoError(existing.isDeleted ? "El producto ya existia y fue restaurado en el draft." : "El producto ya existia; se aumento la cantidad.")
      resetProductoForm()
      return
    }
    setDraftProductos(current => [draftProductoFromCatalog(selectedProducto, cantidad, productoNotas, productoProporcionado), ...current])
    resetProductoForm()
    setProductoError(null)
  }

  const handleProductoCantidadChange = (lineId: string, value: string) => {
    setDraftProductos(current => current.map(producto =>
      producto.lineId === lineId ? { ...producto, cantidad: sanitizeCantidadInput(value, producto.stock) } : producto
    ))
  }

  const handleProductoNotasChange = (lineId: string, value: string) => {
    setDraftProductos(current => current.map(producto =>
      producto.lineId === lineId ? { ...producto, notas: value } : producto
    ))
  }

  const handleProductoProporcionadoChange = (lineId: string, value: boolean) => {
    setDraftProductos(current => current.map(producto =>
      producto.lineId === lineId ? { ...producto, proporcionadoPorCliente: value } : producto
    ))
  }

  const handleRemoveDraftProducto = (lineId: string) => {
    setDraftProductos(current => current.flatMap(producto => {
      if (producto.lineId !== lineId) return [producto]
      return producto.isNew ? [] : [{ ...producto, isDeleted: true }]
    }))
  }

  const handleRestoreDraftProducto = (lineId: string) => {
    setDraftProductos(current => current.map(producto =>
      producto.lineId === lineId ? { ...producto, isDeleted: false } : producto
    ))
  }

  const buildProductosCambios = (): OrdenProductoCambioPayload[] => {
    return draftProductos.flatMap<OrdenProductoCambioPayload>(producto => {
      if (producto.isNew) {
        if (producto.isDeleted) return []
        return [{
          accion: "AGREGAR",
          productoId: producto.productoId,
          cantidad: normalizeCantidad(producto.cantidad, producto.stock),
          notas: producto.notas?.trim() || undefined,
          proporcionadoPorCliente: producto.proporcionadoPorCliente,
        }]
      }
      if (producto.isDeleted) return [{ accion: "ELIMINAR", lineaId: producto.lineId }]
      if (productoChanged(producto)) {
        return [{
          accion: "ACTUALIZAR",
          lineaId: producto.lineId,
          cantidad: normalizeCantidad(producto.cantidad, producto.stock),
          notas: producto.notas?.trim() || undefined,
          proporcionadoPorCliente: producto.proporcionadoPorCliente,
        }]
      }
      return []
    })
  }

  const handleSave = async () => {
    if (!draft) return
    setSaveError(null)
    try {
      const serviciosCambios = buildServiciosCambios()
      const productosCambios = buildProductosCambios()
      await updateOrden.mutateAsync({
        ...draft,
        estadoOriginal: normalizeEstado(orden.estado.codigo),
        serviciosCambios: serviciosCambios.length > 0 ? serviciosCambios : undefined,
        productosCambios: productosCambios.length > 0 ? productosCambios : undefined,
      })
      setMode("view")
      await query.refetch()
    } catch {
      setSaveError("No se pudo guardar la orden. Intenta nuevamente.")
    }
  }

  return (
    <DrawerFrame onClose={onClose} disableClose={isSaving}>
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
        {isEditing ? (
          <div className="flex items-center gap-2">
            <button
              onClick={resetEdit}
              disabled={isSaving}
              className="bg-vs-chip text-vs-ink px-3 py-1.5 rounded-full text-[12px] font-medium hover:bg-[#ebe3d6] disabled:opacity-60 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => void handleSave()}
              disabled={isSaving || !draft}
              className="flex items-center gap-1.5 bg-vs-ink text-white px-3 py-1.5 rounded-full text-[12px] font-medium hover:bg-[#1e2228] disabled:opacity-60 transition-colors"
            >
              {isSaving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} strokeWidth={1.8} />}
              {isSaving ? "Guardando..." : "Guardar"}
            </button>
          </div>
        ) : (
          <button
            onClick={() => setMode("edit")}
            className="flex items-center gap-1.5 bg-vs-chip text-vs-ink px-3 py-1.5 rounded-full text-[12px] font-medium hover:bg-[#ebe3d6] transition-colors"
          >
            <Pencil size={13} strokeWidth={1.6} />
            Editar
          </button>
        )}
        <button
          onClick={onClose}
          disabled={isSaving}
          className="w-9 h-9 rounded-full bg-vs-chip hover:bg-[#ebe3d6] disabled:opacity-60 flex items-center justify-center transition-colors shrink-0"
        >
          <X size={16} strokeWidth={1.6} />
        </button>
      </div>

      <div className="p-5 space-y-5">
        {saveError && (
          <div className="rounded-xl border border-vs-warn/20 bg-vs-warn-bg px-3 py-2 text-[12px] text-vs-warn">
            {saveError}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {isEditing && draft ? (
            <>
              <EditSelect
                label="Estado"
                value={draft.estado}
                options={ESTADO_OPTIONS}
                disabled={isSaving}
                onChange={estado => setDraft(current => current ? { ...current, estado } : current)}
              />
              <EditSelect
                label="Tipo"
                value={draft.tipo.codigo as TipoOT}
                options={TIPO_OPTIONS}
                disabled={isSaving}
                onChange={tipo => setDraft(current => current ? {
                  ...current,
                  tipo: {
                    ...current.tipo,
                    codigo: tipo,
                    nombre: TIPO_OPTIONS.find(option => option.value === tipo)?.label ?? current.tipo.nombre,
                  },
                } : current)}
              />
              <EditSelect
                label="Prioridad"
                value={draft.prioridad}
                options={PRIORIDAD_OPTIONS}
                disabled={isSaving}
                onChange={prioridad => setDraft(current => current ? { ...current, prioridad } : current)}
              />
            </>
          ) : (
            <>
              <Field label="Estado" value={<StatusChip orden={orden} />} />
              <Field label="Prioridad" value={<PriorityBadge prioridad={orden.prioridad} />} />
            </>
          )}
        </div>

        <Section title="Fechas">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Fecha de ingreso" value={formatFecha(orden.fechaIngreso)} />
            <Field label="Fecha prometida" value={formatFecha(orden.fechaPrometida)} />
            <Field label="Fecha de entrega" value={formatFecha(orden.fechaEntrega)} />
          </div>
        </Section>

        <Section title="Mecanico">
          {isEditing && draft ? (
            <EditSelect
              label="Mecanico"
              value={draft.mecanicoId}
              options={mecanicoOptions}
              disabled={isSaving || mecanicosQuery.isLoading}
              onChange={mecanicoId => setDraft(current => current ? { ...current, mecanicoId } : current)}
            />
          ) : (
            <MechanicPill mecanico={orden.mecanico} />
          )}
        </Section>

        <Section title="Cliente">
          <div className="space-y-4">
            <Field label="Nombre" value={fullName(orden.cliente)} />
            <Field label="RUT" value={orden.cliente?.rut || "-"} mono />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Telefono" value={orden.cliente?.telefono || "-"} />
              <Field label="Email" value={orden.cliente?.email || "-"} />
            </div>
          </div>
        </Section>

        <Section title="Bicicleta">
          <div className="space-y-4">
            <Field label="Marca / Modelo" value={bikeName} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Tipo" value={orden.bicicleta?.tipo || "-"} />
              <Field label="Color" value={orden.bicicleta?.color || "-"} />
            </div>
            <Field label="N de serie" value={orden.bicicleta?.numeroSerie || "-"} mono />
          </div>
        </Section>

        <Section title="Trabajo">
          <div className="space-y-4">
            <Field label="Diagnostico inicial" value={<ReadBox>{orden.diagnosticoInicial || "-"}</ReadBox>} />
            <Field label="Diagnostico final" value={<ReadBox>{orden.diagnosticoFinal || "-"}</ReadBox>} />
            <Field label="Obs. del cliente" value={<ReadBox>{orden.observacionesCliente || "-"}</ReadBox>} />
          </div>
        </Section>

        <Section title="Servicios">
          <div className="space-y-4">
            {isEditing && (
              <div className="rounded-xl border border-vs-line-2 bg-vs-chip p-3 space-y-3">
                <label className="space-y-1 block">
                  <span className="text-[11px] text-[#8a7f70] uppercase tracking-wider block">Servicio</span>
                  <select
                    value={selectedServicioId}
                    disabled={isSaving || serviciosQuery.isLoading || serviciosQuery.isError || servicioOptions.length === 0}
                    onChange={event => {
                      setSelectedServicioId(event.target.value)
                      setServicioError(null)
                    }}
                    className="w-full rounded-xl border border-[#d7cabb] bg-white px-3 py-2 text-[13px] font-medium text-[#2b2f36] shadow-sm outline-none transition-colors hover:border-[#c0ad91] hover:bg-[#fffdf9] focus:border-vs-violet focus:ring-2 focus:ring-vs-violet/15 disabled:opacity-60"
                  >
                    <option value="">Selecciona servicio</option>
                    {servicioOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                </label>
                {serviciosQuery.isLoading && <div className="text-[12px] text-[#8a7f70]">Cargando servicios...</div>}
                {serviciosQuery.isError && <div className="text-[12px] text-vs-warn">No se pudieron cargar servicios.</div>}
                {!serviciosQuery.isLoading && !serviciosQuery.isError && servicioOptions.length === 0 && <div className="text-[12px] text-[#8a7f70]">No hay servicios disponibles.</div>}
                <label className="space-y-1 block">
                  <span className="text-[11px] text-[#8a7f70] uppercase tracking-wider block">Notas</span>
                  <input
                    value={servicioNotas}
                    disabled={isSaving || !selectedServicio}
                    onChange={event => setServicioNotas(event.target.value)}
                    placeholder="Opcional"
                    className="w-full rounded-xl border border-vs-line-2 bg-white px-3 py-2 text-[13px] outline-none disabled:opacity-60"
                  />
                </label>
                {servicioError && <div className="text-[12px] text-vs-warn">{servicioError}</div>}
                <button
                  type="button"
                  disabled={isSaving || !selectedServicio}
                  onClick={handleAddDraftServicio}
                  className="w-full bg-vs-ink text-white text-[13px] font-medium py-2.5 rounded-full hover:bg-[#1e2228] disabled:opacity-50 transition-colors"
                >
                  Agregar servicio
                </button>
              </div>
            )}

            <div className="space-y-2">
              {servicios.length > 0 ? (
                servicios.map(servicio => (
                  <ServicioLine
                    key={servicio.lineId}
                    servicio={servicio}
                    isEditing={isEditing}
                    disabled={isSaving}
                    onPrecioChange={handleServicioPrecioChange}
                    onDescuentoChange={handleServicioDescuentoChange}
                    onNotasChange={handleServicioNotasChange}
                    onRemove={handleRemoveDraftServicio}
                    onRestore={handleRestoreDraftServicio}
                  />
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-vs-line-2 bg-white/60 px-3 py-3 text-[12px] text-[#8a7f70]">Sin servicios asociados.</div>
              )}
              {servicios.length > 0 && (
                <div className="flex items-center justify-between gap-4 pt-3 text-[13px] font-semibold">
                  <span>Total servicios</span>
                  <span className="font-mono">{formatPeso(serviciosTotal)}</span>
                </div>
              )}
            </div>
          </div>
        </Section>

        {(isEditing || productos.length > 0) && (
          <Section title="Productos">
            <div className="space-y-4">
              {isEditing && (
                <div className="rounded-xl border border-vs-line-2 bg-vs-chip p-3 space-y-3">
                  <label className="space-y-1 block">
                    <span className="text-[11px] text-[#8a7f70] uppercase tracking-wider block">Producto</span>
                    <select
                      value={selectedProductoId}
                      disabled={isSaving || productosQuery.isLoading || productosQuery.isError || productoOptions.length === 0}
                      onChange={event => {
                        setSelectedProductoId(event.target.value)
                        setProductoError(null)
                      }}
                      className="w-full rounded-xl border border-[#d7cabb] bg-white px-3 py-2 text-[13px] font-medium text-[#2b2f36] shadow-sm outline-none transition-colors hover:border-[#c0ad91] hover:bg-[#fffdf9] focus:border-vs-violet focus:ring-2 focus:ring-vs-violet/15 disabled:opacity-60"
                    >
                      <option value="">Selecciona producto</option>
                      {productoOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                  </label>
                  {productosQuery.isLoading && <div className="text-[12px] text-[#8a7f70]">Cargando productos...</div>}
                  {productosQuery.isError && <div className="text-[12px] text-vs-warn">No se pudieron cargar productos.</div>}
                  {!productosQuery.isLoading && !productosQuery.isError && productoOptions.length === 0 && <div className="text-[12px] text-[#8a7f70]">No hay productos disponibles.</div>}
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <label className="space-y-1">
                      <span className="text-[11px] text-[#8a7f70] uppercase tracking-wider block">Cantidad</span>
                      <input
                        type="number"
                        min={1}
                        max={selectedProducto?.stock}
                        value={productoCantidad}
                        disabled={isSaving || !selectedProducto}
                        onChange={event => setProductoCantidad(sanitizeCantidadInput(event.target.value, selectedProducto?.stock))}
                        className="w-full rounded-xl border border-vs-line-2 bg-white px-3 py-2 text-[13px] outline-none disabled:opacity-60"
                      />
                    </label>
                    <label className="space-y-1 block">
                      <span className="text-[11px] text-[#8a7f70] uppercase tracking-wider block">Notas</span>
                      <input
                        value={productoNotas}
                        disabled={isSaving || !selectedProducto}
                        onChange={event => setProductoNotas(event.target.value)}
                        placeholder="Opcional"
                        className="w-full rounded-xl border border-vs-line-2 bg-white px-3 py-2 text-[13px] outline-none disabled:opacity-60"
                      />
                    </label>
                  </div>
                  <label className="inline-flex items-center gap-2 text-[12px] text-[#4a4438]">
                    <input
                      type="checkbox"
                      checked={productoProporcionado}
                      disabled={isSaving || !selectedProducto}
                      onChange={event => setProductoProporcionado(event.target.checked)}
                      className="h-4 w-4 rounded border-vs-line-2"
                    />
                    Cliente lo proporciona
                  </label>
                  {productoError && <div className="text-[12px] text-vs-warn">{productoError}</div>}
                  <button
                    type="button"
                    disabled={isSaving || !selectedProducto}
                    onClick={handleAddDraftProducto}
                    className="w-full bg-vs-ink text-white text-[13px] font-medium py-2.5 rounded-full hover:bg-[#1e2228] disabled:opacity-50 transition-colors"
                  >
                    Agregar producto
                  </button>
                </div>
              )}

              <div className="space-y-2">
                {productos.length > 0 ? (
                  productos.map(producto => (
                    <ProductoLine
                      key={producto.lineId}
                      producto={producto}
                      isEditing={isEditing}
                      disabled={isSaving}
                      onCantidadChange={handleProductoCantidadChange}
                      onNotasChange={handleProductoNotasChange}
                      onProporcionadoChange={handleProductoProporcionadoChange}
                      onRemove={handleRemoveDraftProducto}
                      onRestore={handleRestoreDraftProducto}
                    />
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-vs-line-2 bg-white/60 px-3 py-3 text-[12px] text-[#8a7f70]">Sin productos asociados.</div>
                )}
                {productos.length > 0 && (
                  <div className="flex items-center justify-between gap-4 pt-3 text-[13px] font-semibold">
                    <span>Total productos</span>
                    <span className="font-mono">{formatPeso(productosTotal)}</span>
                  </div>
                )}
              </div>
            </div>
          </Section>
        )}

        {hasLineItems && (
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-vs-line-2 pt-4">
            <div className="text-[14px] font-semibold text-[#2b2f36]">Total</div>
            <div className="text-[15px] font-semibold text-[#2b2f36] font-mono">{formatPeso(total)}</div>
          </div>
        )}

        {comentarios.length > 0 && (
          <Section title="Comentarios">
            <ul className="space-y-4 relative pl-5 before:absolute before:left-[6px] before:top-1 before:bottom-1 before:w-px before:bg-vs-line-2">
              {comentarios.map((comentario, i) => (
                <li key={`${comentario.createdAt}-${i}`} className="relative">
                  <span className="absolute -left-5 top-1.5 w-3 h-3 rounded-full bg-vs-violet-bg border-2 border-white" />
                  <div className="text-[11.5px] text-[#8a7f70]">
                    {comentario.usuario} - {formatFecha(comentario.createdAt)}
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

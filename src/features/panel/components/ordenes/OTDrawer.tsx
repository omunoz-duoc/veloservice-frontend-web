"use client"

import { useEffect, useMemo, useState, type ReactNode } from "react"
import { Check, FileText, Loader2, Pencil, X } from "lucide-react"
import { useMecanicosActivos } from "@/features/panel/hooks/useMecanicosActivos"
import { useChangeOrdenEstadoMutation, useOrdenDetalleQuery } from "@/features/panel/hooks/useOrdenes"
import type { EstadoOT, OrdenTrabajo, Prioridad, TipoOT } from "@/features/panel/components/ordenes/ordenes.types"
import type { OrdenTrabajoDetalle } from "@/features/panel/types/ordenes.types"

type Person = { nombre?: string | null; apellido?: string | null }

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
  { value: "personalizacion", label: "Personalizacion" },
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
  overhaul: "mantencion",
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
  return value === "baja" || value === "alta" ? value : "media"
}

function formatFecha(iso: string | null | undefined): string {
  if (!iso) return "-"
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "-"
  return `${d.getUTCDate()} ${MESES[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

function formatPeso(n: number): string {
  return `$${n.toLocaleString("es-CL")}`
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
    mecanicoId: orden.mecanico?.id || fullName(orden.mecanico),
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
      <div className="w-full max-w-[560px] bg-vs-bg h-full overflow-y-auto flex flex-col">
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
        <div className="grid grid-cols-2 gap-4">
          <div className={`${bar} w-28`} />
          <div className={`${bar} w-20`} />
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

export function OTDrawer({
  ordenId,
  onClose,
}: {
  ordenId: string
  onClose: () => void
}) {
  const query = useOrdenDetalleQuery(ordenId)
  const changeOrdenEstado = useChangeOrdenEstadoMutation()
  const mecanicosQuery = useMecanicosActivos()
  const orden = query.data
  const [mode, setMode] = useState<"view" | "edit">("view")
  const [draft, setDraft] = useState<OrdenTrabajo | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    if (!orden) return
    setDraft(detalleToDraft(orden))
    setMode("view")
    setSaveError(null)
  }, [orden])

  const mecanicoOptions = useMemo(() => {
    const current = draft?.mecanicoId
      ? [{ value: draft.mecanicoId, label: orden ? fullName(orden.mecanico) : draft.mecanicoId }]
      : [{ value: "", label: "Sin asignar" }]
    const remote = mecanicosQuery.data?.mecanicos.map(mecanico => ({
      value: mecanico.id,
      label: fullName(mecanico),
    })) ?? []
    const options = [...current, ...remote]

    return options.filter((option, index, list) =>
      list.findIndex(item => item.value === option.value) === index
    )
  }, [draft?.mecanicoId, mecanicosQuery.data?.mecanicos, orden])

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
  const isSaving = changeOrdenEstado.isPending
  const tipoCfg = TIPO_COLORS[normalizeTipo(orden.tipo.codigo)] ?? NEUTRAL
  const servicios = orden.servicios ?? []
  const productos = orden.productos ?? []
  const comentarios = orden.comentarios ?? []
  const serviciosTotal = servicios.reduce((sum, s) => sum + s.precioBase, 0)
  const productosTotal = productos.reduce((sum, p) => sum + p.precioVenta * p.cantidad, 0)
  const total = serviciosTotal + productosTotal
  const hasLineItems = servicios.length > 0 || productos.length > 0
  const bikeName = [orden.bicicleta?.marca, orden.bicicleta?.modelo].filter(Boolean).join(" ") || "-"

  const handleSave = async () => {
    if (!draft) return
    setSaveError(null)
    try {
      await changeOrdenEstado.mutateAsync(draft)
      setMode("view")
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
              onClick={() => {
                setDraft(detalleToDraft(orden))
                setMode("view")
                setSaveError(null)
              }}
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

        <div className="grid grid-cols-2 gap-4">
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
          <div className="grid grid-cols-3 gap-4">
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
            <div className="grid grid-cols-2 gap-4">
              <Field label="Telefono" value={orden.cliente?.telefono || "-"} />
              <Field label="Email" value={orden.cliente?.email || "-"} />
            </div>
          </div>
        </Section>

        <Section title="Bicicleta">
          <div className="space-y-4">
            <Field label="Marca / Modelo" value={bikeName} />
            <div className="grid grid-cols-2 gap-4">
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

        {servicios.length > 0 && (
          <Section title="Servicios">
            <div className="divide-y divide-vs-line-2">
              {servicios.map(servicio => (
                <div key={servicio.id} className="flex items-center justify-between gap-4 py-2 first:pt-0">
                  <div className="text-[13px] text-[#2b2f36] font-medium">{servicio.nombre}</div>
                  <div className="text-[13px] text-[#2b2f36] font-mono shrink-0">{formatPeso(servicio.precioBase)}</div>
                </div>
              ))}
              {servicios.length > 1 && (
                <div className="flex items-center justify-between gap-4 pt-3 text-[13px] font-semibold">
                  <span>Total servicios</span>
                  <span className="font-mono">{formatPeso(serviciosTotal)}</span>
                </div>
              )}
            </div>
          </Section>
        )}

        {productos.length > 0 && (
          <Section title="Productos">
            <div className="divide-y divide-vs-line-2">
              {productos.map(producto => (
                <div key={producto.id} className="py-2 first:pt-0">
                  <div className="text-[13px] text-[#2b2f36] font-medium">{producto.nombre}</div>
                  <div className="flex items-center justify-between gap-4 mt-1">
                    <div className="text-[11.5px] text-[#8a7f70] font-mono">
                      {producto.sku || "S/SKU"} x{producto.cantidad}
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

"use client"

import { useEffect, useState, type ReactNode } from "react"
import { useQuery } from "@tanstack/react-query"
import { Check, FileText, Loader2, Pencil, X } from "lucide-react"
import { useMecanicosActivos } from "@/features/panel/hooks/useMecanicosActivos"
import { useOrdenCatalogosQuery, useOrdenDetalleQuery, useUpdateOrdenMutation } from "@/features/panel/hooks/useOrdenes"
import { inventarioService } from "@/features/panel/services/inventario.provider"
import {
  catalogLabel,
  catalogOptions,
  ESTADO_COLORS,
  normalizeEstadoOrden,
  normalizePrioridadOrden,
  normalizeTipoOrden,
  ORDEN_CATALOGOS_FALLBACK,
  PRIORIDAD_COLORS,
  TIPO_COLORS,
} from "@/features/panel/services/ordenes.catalogos"
import type { Producto } from "@/features/panel/types/inventario.types"
import type { EstadoOT, OrdenTrabajo, Prioridad, TipoOT } from "@/features/panel/components/ordenes/ordenes.types"
import type { OrdenProductoCambioPayload, OrdenTrabajoDetalle } from "@/features/panel/types/ordenes.types"

type Person = { nombre?: string | null; apellido?: string | null }

type DraftProducto = {
  lineId: string
  productoId: string
  nombre: string
  sku: string
  categoria: string
  cantidad: number
  precioVenta: number
  stock?: number
  notas?: string
  originalCantidad?: number
  originalNotas?: string
  isNew: boolean
  isDeleted?: boolean
}

const NEUTRAL = { fg: "#6b5d46", bg: "#efe9df" }
const NEUTRAL_STATUS = { ...NEUTRAL, dot: "#a59682" }
const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

function formatFecha(iso: string | null | undefined): string {
  if (!iso) return "-"
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "-"
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

function formatPeso(n: number): string {
  return `$${n.toLocaleString("es-CL")}`
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
  return {
    id: orden.numeroOrden,
    backendId: orden.id,
    tipo: { id: orden.tipo.id, codigo: normalizeTipoOrden(orden.tipo.codigo), nombre: orden.tipo.nombre },
    estado: normalizeEstadoOrden(orden.estado.codigo),
    prioridad: normalizePrioridadOrden(orden.prioridad),
    fechaIngreso: formatFecha(orden.fechaIngreso),
    fechaEstimada: orden.fechaPrometida ?? "",
    mecanicoId: orden.mecanico?.id || "",
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

function draftProductoFromBackend(producto: OrdenTrabajoDetalle["productos"][number]): DraftProducto {
  return {
    lineId: producto.id,
    productoId: producto.productoId,
    nombre: producto.nombre,
    sku: producto.sku,
    categoria: "",
    cantidad: producto.cantidad,
    precioVenta: producto.precioVenta,
    notas: producto.notas,
    originalCantidad: producto.cantidad,
    originalNotas: producto.notas,
    isNew: false,
  }
}

function createDraftProductoId(productoId: string) {
  return `draft-${productoId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function Field({ label, value, mono = false }: { label: string; value: ReactNode; mono?: boolean }) {
  return (
    <div className="min-w-0">
      <div className="text-[11px] text-[#8a7f70] mb-1.5 uppercase tracking-wider">{label}</div>
      <div className={mono ? "text-[13px] text-[#4a4438] font-mono break-words" : "text-[13px] text-[#2b2f36] font-medium break-words"}>{value}</div>
    </div>
  )
}

function EditSelect<TValue extends string>({ label, value, options, disabled, onChange, isOptionDisabled, selectClassName }: {
  label: string
  value: TValue
  options: Array<{ value: TValue; label: string }>
  disabled: boolean
  onChange: (value: TValue) => void
  placeholder?: string
  isOptionDisabled?: (option: { value: TValue; label: string }) => boolean
  selectClassName?: string
}) {
  return (
    <label className="min-w-0">
      <span className="text-[11px] text-[#8a7f70] mb-1.5 uppercase tracking-wider block">{label}</span>
      <select value={value} disabled={disabled} onChange={e => onChange(e.target.value as TValue)} className={selectClassName ?? "w-full rounded-xl border border-vs-line-2 bg-vs-chip px-3 py-2 text-[13px] font-medium text-[#2b2f36] outline-none disabled:opacity-60"}>
        <option value="">{`Selecciona ${label.toLowerCase()}`}</option>
        {options.map(option => <option key={option.value} value={option.value} disabled={isOptionDisabled?.(option)}>{option.label}</option>)}
      </select>
    </label>
  )
}

function ReadBox({ children }: { children: ReactNode }) {
  return <div className="text-[13px] leading-relaxed text-[#2b2f36] bg-white rounded-xl p-3 border border-vs-line-2 whitespace-pre-wrap">{children}</div>
}

function Section({ title, children, eyebrow }: { title: string; children: ReactNode; eyebrow?: string }) {
  return (
    <section className="rounded-2xl border border-vs-line-2 bg-vs-chip/70 p-4 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-[11px] text-[#6b5d46] uppercase tracking-widest font-semibold">{title}</div>
        {eyebrow && <div className="text-[11px] text-[#8a7f70] font-mono shrink-0">{eyebrow}</div>}
      </div>
      {children}
    </section>
  )
}

function FieldGrid({ children, cols = 2 }: { children: ReactNode; cols?: 2 | 3 | 4 }) {
  const colsClass = cols === 4 ? "grid-cols-2 sm:grid-cols-4" : cols === 3 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2"
  return <div className={`grid ${colsClass} gap-4`}>{children}</div>
}

function EmptyState({ children }: { children: ReactNode }) {
  return <div className="rounded-xl border border-dashed border-vs-line-2 bg-white/60 px-3 py-3 text-[12px] text-[#8a7f70]">{children}</div>
}

function clampCantidad(cantidad: number, stock?: number) {
  const normalized = Math.max(1, Math.floor(cantidad) || 1)
  return stock === undefined ? normalized : Math.min(normalized, Math.max(1, stock))
}

function productChanged(producto: DraftProducto) {
  return !producto.isNew && !producto.isDeleted && (
    producto.cantidad !== producto.originalCantidad ||
    (producto.notas ?? "") !== (producto.originalNotas ?? "")
  )
}

function ProductLine({
  producto,
  isEditing,
  onCantidadChange,
  onNotasChange,
  onRemove,
  onRestore,
}: {
  producto: DraftProducto
  isEditing: boolean
  onCantidadChange?: (lineId: string, cantidad: number) => void
  onNotasChange?: (lineId: string, notas: string) => void
  onRemove?: (lineId: string) => void
  onRestore?: (lineId: string) => void
}) {
  const isChanged = productChanged(producto)
  return (
    <div className={producto.isDeleted ? "rounded-xl border border-vs-warn/20 bg-vs-warn-bg/40 px-3 py-2.5 space-y-2 opacity-80" : "rounded-xl border border-vs-line-2 bg-white px-3 py-2.5 space-y-2"}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="text-[13px] text-[#2b2f36] font-medium truncate">{producto.nombre}</div>
            {isEditing && producto.isNew && <span className="rounded-full bg-vs-good-bg px-2 py-0.5 text-[10px] font-semibold text-vs-good">Nuevo</span>}
            {isEditing && isChanged && <span className="rounded-full bg-vs-violet-bg px-2 py-0.5 text-[10px] font-semibold text-vs-violet">Editado</span>}
            {isEditing && producto.isDeleted && <span className="rounded-full bg-vs-warn-bg px-2 py-0.5 text-[10px] font-semibold text-vs-warn">Marcado para eliminar</span>}
          </div>
          <div className="text-[11.5px] text-[#8a7f70] font-mono mt-0.5">
            {producto.sku || "S/SKU"} - {producto.categoria || "Sin categoria"} - stock {producto.stock ?? "-"}
          </div>
        </div>
        {!isEditing && (
          <div className="text-right shrink-0">
            <div className="text-[12px] text-[#2b2f36] font-mono">{producto.cantidad} x {formatPeso(producto.precioVenta)}</div>
            <div className="text-[11px] text-[#8a7f70] mt-0.5">{formatPeso(producto.precioVenta * producto.cantidad)}</div>
          </div>
        )}
      </div>
      {isEditing ? (
        <div className="space-y-2">
          <div className="grid grid-cols-[96px_1fr] gap-2">
            <label className="space-y-1">
              <span className="text-[11px] text-[#8a7f70] uppercase tracking-wider block">Cantidad</span>
              <input
                type="number"
                min={1}
                max={producto.stock}
                value={producto.cantidad}
                disabled={producto.isDeleted}
                onChange={event => onCantidadChange?.(producto.lineId, Number(event.target.value))}
                className="w-full rounded-xl border border-vs-line-2 bg-white px-3 py-2 text-[13px] outline-none disabled:opacity-60"
              />
            </label>
            <label className="space-y-1 min-w-0">
              <span className="text-[11px] text-[#8a7f70] uppercase tracking-wider block">Notas</span>
              <input
                value={producto.notas ?? ""}
                disabled={producto.isDeleted}
                onChange={event => onNotasChange?.(producto.lineId, event.target.value)}
                placeholder="Opcional"
                className="w-full rounded-xl border border-vs-line-2 bg-white px-3 py-2 text-[13px] outline-none disabled:opacity-60"
              />
            </label>
          </div>
          <div className="flex items-center justify-between gap-3">
            <div className="text-[12px] text-[#2b2f36] font-mono">{producto.cantidad} x {formatPeso(producto.precioVenta)} = {formatPeso(producto.precioVenta * producto.cantidad)}</div>
            {producto.isDeleted ? (
              <button type="button" onClick={() => onRestore?.(producto.lineId)} className="text-[12px] font-medium text-vs-violet hover:text-vs-ink">Deshacer</button>
            ) : (
              <button type="button" onClick={() => onRemove?.(producto.lineId)} className="text-[12px] font-medium text-vs-warn hover:bg-vs-warn-bg px-2 py-1 rounded-lg">Eliminar</button>
            )}
          </div>
        </div>
      ) : (
        producto.notas && <div className="text-[12px] text-[#4a4438] whitespace-pre-wrap">Notas: {producto.notas}</div>
      )}
    </div>
  )
}

function ProductList({
  productos,
  isEditing,
  onCantidadChange,
  onNotasChange,
  onRemove,
  onRestore,
}: {
  productos: DraftProducto[]
  isEditing: boolean
  onCantidadChange?: (lineId: string, cantidad: number) => void
  onNotasChange?: (lineId: string, notas: string) => void
  onRemove?: (lineId: string) => void
  onRestore?: (lineId: string) => void
}) {
  if (productos.length === 0) return <EmptyState>Sin productos asociados.</EmptyState>

  return (
    <div className="space-y-2">
      {productos.map(producto => (
        <ProductLine
          key={producto.lineId}
          producto={producto}
          isEditing={isEditing}
          onCantidadChange={onCantidadChange}
          onNotasChange={onNotasChange}
          onRemove={onRemove}
          onRestore={onRestore}
        />
      ))}
    </div>
  )
}

function SummaryRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={strong ? "flex items-center justify-between gap-4 pt-3 border-t border-vs-line-2 text-[14px] font-semibold text-[#2b2f36]" : "flex items-center justify-between gap-4 text-[13px] text-[#4a4438]"}>
      <span>{label}</span>
      <span className="font-mono text-[#2b2f36]">{value}</span>
    </div>
  )
}

function StatusChip({ orden, estados }: { orden: OrdenTrabajoDetalle; estados: typeof ORDEN_CATALOGOS_FALLBACK.estados }) {
  const codigo = normalizeEstadoOrden(orden.estado.codigo)
  const cfg = ESTADO_COLORS[codigo] ?? NEUTRAL_STATUS
  return <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: cfg.bg, color: cfg.fg }}><span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: cfg.dot }} />{catalogLabel(estados, codigo)}</span>
}

function PriorityBadge({ prioridad, prioridades }: { prioridad: string; prioridades: typeof ORDEN_CATALOGOS_FALLBACK.prioridades }) {
  const normalized = normalizePrioridadOrden(prioridad)
  const cfg = PRIORIDAD_COLORS[normalized] ?? NEUTRAL
  return <span className="inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: cfg.bg, color: cfg.fg }}>{catalogLabel(prioridades, normalized)}</span>
}

function MechanicPill({ mecanico }: { mecanico: OrdenTrabajoDetalle["mecanico"] | null | undefined }) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="w-7 h-7 rounded-full bg-vs-violet text-white flex items-center justify-center text-[10px] font-semibold shrink-0">{initials(mecanico)}</div>
      <span className="text-[12px] text-[#2b2f36] font-medium truncate">{fullName(mecanico)}</span>
    </div>
  )
}

function DrawerFrame({ children, onClose, disableClose = false }: { children: ReactNode; onClose: () => void; disableClose?: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex">
      <div onClick={disableClose ? undefined : onClose} className="flex-1 bg-black/30 backdrop-blur-sm" />
      <div className="w-full max-w-[560px] bg-vs-bg h-full overflow-y-auto flex flex-col">
        <div className="bg-vs-card border border-vs-line rounded-[24px] m-3 mb-0 flex flex-col">{children}</div>
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
      <div className="p-5 space-y-5">{[1, 2, 3, 4].map(i => <div key={i} className={`${bar} w-full`} />)}</div>
    </DrawerFrame>
  )
}

export function OTDrawer({ ordenId, onClose }: { ordenId: string; onClose: () => void }) {
  const query = useOrdenDetalleQuery(ordenId)
  const orden = query.data
  const catalogosQuery = useOrdenCatalogosQuery()
  const catalogos = catalogosQuery.data ?? ORDEN_CATALOGOS_FALLBACK
  const updateOrden = useUpdateOrdenMutation()
  const mecanicosQuery = useMecanicosActivos()
  const [mode, setMode] = useState<"view" | "edit">("view")
  const [draft, setDraft] = useState<OrdenTrabajo | null>(null)
  const [draftProductos, setDraftProductos] = useState<DraftProducto[]>([])
  const [saveError, setSaveError] = useState<string | null>(null)
  const [selectedProductoId, setSelectedProductoId] = useState("")
  const [productoCantidad, setProductoCantidad] = useState(1)
  const [productoNotas, setProductoNotas] = useState("")
  const [productoError, setProductoError] = useState<string | null>(null)

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!orden) return
    setDraft(detalleToDraft(orden))
    setDraftProductos((orden.productos ?? []).map(draftProductoFromBackend))
    setMode("view")
    setSaveError(null)
    setSelectedProductoId("")
    setProductoCantidad(1)
    setProductoNotas("")
    setProductoError(null)
  }, [orden])
  /* eslint-enable react-hooks/set-state-in-effect */

  const currentMecanicoLabel = fullName(orden?.mecanico)
  const currentMecanicoOption = draft?.mecanicoId && currentMecanicoLabel !== "-" ? [{ value: draft.mecanicoId, label: currentMecanicoLabel }] : []
  const remoteMecanicoOptions = mecanicosQuery.data?.mecanicos.map(mecanico => ({ value: mecanico.id, label: fullName(mecanico) })) ?? []
  const mecanicoOptions = [...currentMecanicoOption, ...remoteMecanicoOptions]
    .filter((option, index, list) => option.value && list.findIndex(item => item.value === option.value) === index)

  const productosQuery = useQuery({
    queryKey: ["productos"],
    queryFn: () => inventarioService.getProductos(),
    enabled: mode === "edit",
    staleTime: 30_000,
  })

  if (query.isLoading) return <DrawerSkeleton onClose={onClose} />

  if (query.isError || !orden) {
    return (
      <DrawerFrame onClose={onClose}>
        <div className="flex items-center justify-end p-4 border-b border-vs-line-2">
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-vs-chip hover:bg-[#ebe3d6] flex items-center justify-center transition-colors shrink-0"><X size={16} strokeWidth={1.6} /></button>
        </div>
        <div className="flex-1 min-h-[360px] flex flex-col items-center justify-center gap-3 p-5 text-center">
          <div className="text-[13px] text-[#4a4438]">No se pudo cargar la orden.</div>
          <button onClick={() => void query.refetch()} className="bg-vs-ink text-white px-4 py-2 rounded-full text-[12px] font-medium hover:bg-[#1e2228] transition-colors">Reintentar</button>
        </div>
      </DrawerFrame>
    )
  }

  const isEditing = mode === "edit"
  const isSaving = updateOrden.isPending
  const tipoCfg = TIPO_COLORS[normalizeTipoOrden(orden.tipo.codigo)] ?? NEUTRAL
  const estadoOptions = catalogOptions<EstadoOT>(catalogos.estados)
  const tipoOptions = catalogOptions<TipoOT>(catalogos.tipos)
  const prioridadOptions = catalogOptions<Prioridad>(catalogos.prioridades)
  const servicios = orden.servicios ?? []
  const productos = draftProductos
  const comentarios = orden.comentarios ?? []
  const serviciosTotal = servicios.reduce((sum, s) => sum + s.precioBase, 0)
  const productosTotal = productos.reduce((sum, p) => p.isDeleted ? sum : sum + p.precioVenta * p.cantidad, 0)
  const total = serviciosTotal + productosTotal
  const productosEncontrados = Array.isArray(productosQuery.data?.productos) ? productosQuery.data.productos : []
  const productoOptions = productosEncontrados.map(producto => ({
    value: producto.id,
    label: `${producto.nombre} - ${producto.sku || "S/SKU"} - stock ${producto.stock} - ${formatPeso(producto.precioAsignado)}`,
  }))
  const selectedProducto = productosEncontrados.find(producto => producto.id === selectedProductoId)
  const maxProductoCantidad = selectedProducto?.stock ?? undefined
  const isProductoCantidadValida = !!selectedProducto && productoCantidad >= 1 && (maxProductoCantidad === undefined || productoCantidad <= maxProductoCantidad)

  const addDraftProducto = (producto: Producto, cantidad = 1) => {
    let wasAdded = false
    let wasUpdated = false
    setDraftProductos(current => {
      const existing = current.find(item => item.productoId === producto.id)
      if (existing) {
        wasUpdated = true
        return current.map(item => {
          if (item.lineId !== existing.lineId) return item
          const stock = item.stock ?? producto.stock
          return {
            ...item,
            stock,
            cantidad: clampCantidad(item.cantidad + cantidad, stock),
            isDeleted: false,
          }
        })
      }
      if (producto.stock < 1) {
        setProductoError("No hay stock disponible para este producto.")
        return current
      }
      wasAdded = true
      return [
        {
          lineId: createDraftProductoId(producto.id),
          productoId: producto.id,
          nombre: producto.nombre,
          sku: producto.sku,
          categoria: producto.categoria,
          cantidad,
          precioVenta: producto.precioAsignado,
          stock: producto.stock,
          notas: productoNotas.trim() || undefined,
          isNew: true,
        },
        ...current,
      ]
    })
    if (wasAdded || wasUpdated) {
      setProductoNotas("")
      setSelectedProductoId("")
      setProductoCantidad(1)
      setProductoError(wasUpdated ? "El producto ya estaba en la orden; se actualizo la cantidad en el draft." : null)
    }
  }

  const handleAddDraftProducto = () => {
    if (!isEditing) return
    if (!selectedProducto) {
      setProductoError("Selecciona un producto.")
      return
    }
    if (!isProductoCantidadValida) {
      setProductoError("La cantidad debe ser al menos 1 y no superar el stock disponible.")
      return
    }
    addDraftProducto(selectedProducto, productoCantidad)
  }

  const handleDraftProductoCantidadChange = (lineId: string, cantidad: number) => {
    if (!isEditing) return
    setDraftProductos(current => current.map(producto =>
      producto.lineId === lineId ? { ...producto, cantidad: clampCantidad(cantidad, producto.stock) } : producto
    ))
  }

  const handleDraftProductoNotasChange = (lineId: string, notas: string) => {
    if (!isEditing) return
    setDraftProductos(current => current.map(producto =>
      producto.lineId === lineId ? { ...producto, notas } : producto
    ))
  }

  const handleRemoveDraftProducto = (lineId: string) => {
    if (!isEditing) return
    setDraftProductos(current => current.flatMap(producto => {
      if (producto.lineId !== lineId) return [producto]
      return producto.isNew ? [] : [{ ...producto, isDeleted: true }]
    }))
  }

  const handleRestoreDraftProducto = (lineId: string) => {
    if (!isEditing) return
    setDraftProductos(current => current.map(producto =>
      producto.lineId === lineId ? { ...producto, isDeleted: false } : producto
    ))
  }

  const buildProductosCambios = (): OrdenProductoCambioPayload[] => {
    return draftProductos.flatMap<OrdenProductoCambioPayload>(producto => {
      if (producto.isNew) {
        if (producto.isDeleted) return []
        const cambio: OrdenProductoCambioPayload = {
          accion: "AGREGAR",
          productoId: producto.productoId,
          cantidad: producto.cantidad,
          notas: producto.notas?.trim() || undefined,
          proporcionadoPorCliente: false,
        }
        return [cambio]
      }
      if (producto.isDeleted) {
        const cambio: OrdenProductoCambioPayload = { accion: "ELIMINAR", lineaId: producto.lineId }
        return [cambio]
      }
      if (productChanged(producto)) {
        const cambio: OrdenProductoCambioPayload = {
          accion: "ACTUALIZAR",
          lineaId: producto.lineId,
          cantidad: producto.cantidad,
          notas: producto.notas?.trim() || undefined,
        }
        return [cambio]
      }
      return []
    })
  }

  const handleSave = async () => {
    if (!draft) return
    setSaveError(null)
    try {
      const productosCambios = buildProductosCambios()
      await updateOrden.mutateAsync({
        ...draft,
        original: detalleToDraft(orden),
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
        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: tipoCfg.bg, color: tipoCfg.fg }}>
          <FileText size={16} strokeWidth={1.6} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] text-[#8a7f70] uppercase tracking-widest">Detalle de orden</div>
          <div className="text-[16px] font-semibold font-mono">{orden.numeroOrden}</div>
        </div>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <button onClick={() => { setDraft(detalleToDraft(orden)); setDraftProductos((orden.productos ?? []).map(draftProductoFromBackend)); setMode("view"); setSaveError(null); setSelectedProductoId(""); setProductoCantidad(1); setProductoNotas(""); setProductoError(null) }} disabled={isSaving} className="bg-vs-chip text-vs-ink px-3 py-1.5 rounded-full text-[12px] font-medium hover:bg-[#ebe3d6] disabled:opacity-60 transition-colors">Cancelar</button>
            <button onClick={() => void handleSave()} disabled={isSaving || !draft} className="flex items-center gap-1.5 bg-vs-ink text-white px-3 py-1.5 rounded-full text-[12px] font-medium hover:bg-[#1e2228] disabled:opacity-60 transition-colors">
              {isSaving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} strokeWidth={1.8} />}
              {isSaving ? "Guardando..." : "Guardar"}
            </button>
          </div>
        ) : (
          <button onClick={() => setMode("edit")} className="flex items-center gap-1.5 bg-vs-chip text-vs-ink px-3 py-1.5 rounded-full text-[12px] font-medium hover:bg-[#ebe3d6] transition-colors"><Pencil size={13} strokeWidth={1.6} />Editar</button>
        )}
        <button onClick={onClose} disabled={isSaving} className="w-9 h-9 rounded-full bg-vs-chip hover:bg-[#ebe3d6] disabled:opacity-60 flex items-center justify-center transition-colors shrink-0"><X size={16} strokeWidth={1.6} /></button>
      </div>

      <div className="p-5 space-y-5">
        {saveError && <div className="rounded-xl border border-vs-warn/20 bg-vs-warn-bg px-3 py-2 text-[12px] text-vs-warn">{saveError}</div>}
        {catalogosQuery.isError && <div className="rounded-xl border border-vs-warn/20 bg-vs-warn-bg px-3 py-2 text-[12px] text-vs-warn">No se pudieron cargar los catalogos. Se usara un fallback seguro.</div>}

        <Section title="Informacion de la orden" eyebrow={isEditing ? "EDIT" : "VIEW"}>
          {isEditing && draft ? (
            <FieldGrid cols={2}>
              <EditSelect label="Estado" value={draft.estado} options={estadoOptions} disabled={isSaving || catalogosQuery.isLoading} onChange={estado => setDraft(current => current ? { ...current, estado } : current)} />
              <EditSelect label="Tipo" value={draft.tipo.codigo as TipoOT} options={tipoOptions} disabled={isSaving || catalogosQuery.isLoading} onChange={tipo => setDraft(current => current ? { ...current, tipo: { ...current.tipo, codigo: tipo, nombre: catalogLabel(catalogos.tipos, tipo) } } : current)} />
              <EditSelect label="Prioridad" value={draft.prioridad} options={prioridadOptions} disabled={isSaving || catalogosQuery.isLoading} onChange={prioridad => setDraft(current => current ? { ...current, prioridad } : current)} />
              <div className="min-w-0">
                {mecanicosQuery.isError && <div className="rounded-xl border border-vs-warn/20 bg-vs-warn-bg px-3 py-2 text-[12px] text-vs-warn">No se pudo cargar la lista de mecanicos.</div>}
                {!mecanicosQuery.isLoading && !mecanicosQuery.isError && mecanicoOptions.length === 0 && <div className="rounded-xl border border-vs-line-2 bg-vs-chip px-3 py-2 text-[12px] text-[#8a7f70]">No hay mecanicos disponibles</div>}
                {mecanicoOptions.length > 0 && <EditSelect label="Mecanico" value={draft.mecanicoId} options={mecanicoOptions} disabled={isSaving || mecanicosQuery.isLoading} onChange={mecanicoId => setDraft(current => current ? { ...current, mecanicoId } : current)} />}
                {mecanicosQuery.isLoading && <div className="text-[12px] text-[#8a7f70]">Cargando mecanicos...</div>}
              </div>
            </FieldGrid>
          ) : (
            <FieldGrid cols={2}>
              <Field label="Estado" value={<StatusChip orden={orden} estados={catalogos.estados} />} />
              <Field label="Tipo" value={<span className="inline-flex items-center text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: tipoCfg.bg, color: tipoCfg.fg }}>{catalogLabel(catalogos.tipos, normalizeTipoOrden(orden.tipo.codigo))}</span>} />
              <Field label="Prioridad" value={<PriorityBadge prioridad={orden.prioridad} prioridades={catalogos.prioridades} />} />
              <Field label="Mecanico" value={<MechanicPill mecanico={orden.mecanico} />} />
            </FieldGrid>
          )}
          <div className="grid grid-cols-3 gap-3 rounded-xl border border-vs-line-2 bg-white/60 p-3">
            <Field label="Ingreso" value={formatFecha(orden.fechaIngreso)} />
            <Field label="Prometida" value={formatFecha(orden.fechaPrometida)} />
            <Field label="Entrega" value={formatFecha(orden.fechaEntrega)} />
          </div>
        </Section>

        <Section title="Cliente">
          <div className="space-y-4 rounded-xl border border-vs-line-2 bg-white/60 p-3">
            <Field label="Nombre" value={fullName(orden.cliente)} />
            <Field label="RUT" value={orden.cliente?.rut || "-"} mono />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Telefono" value={orden.cliente?.telefono || "-"} />
              <Field label="Email" value={orden.cliente?.email || "-"} />
            </div>
          </div>
        </Section>

        <Section title="Bicicleta">
          <div className="space-y-4 rounded-xl border border-vs-line-2 bg-white/60 p-3">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Marca" value={orden.bicicleta?.marca || "-"} />
              <Field label="Modelo" value={orden.bicicleta?.modelo || "-"} />
              <Field label="Tipo" value={orden.bicicleta?.tipo || "-"} />
              <Field label="Color" value={orden.bicicleta?.color || "-"} />
            </div>
            <Field label="N de serie" value={orden.bicicleta?.numeroSerie || "-"} mono />
          </div>
        </Section>

        <Section title="Diagnostico">
          <div className="space-y-4">
            <Field label="Diagnostico" value={<ReadBox>{orden.diagnosticoInicial || "-"}</ReadBox>} />
            <Field label="Observaciones" value={<ReadBox>{orden.observacionesCliente || "-"}</ReadBox>} />
            {orden.diagnosticoFinal && <Field label="Diagnostico final" value={<ReadBox>{orden.diagnosticoFinal}</ReadBox>} />}
          </div>
        </Section>

        <Section title="Productos">
          <div className="space-y-4">
            {isEditing && (
            <div className="rounded-xl border border-vs-line-2 bg-vs-chip p-3 space-y-3">
              <EditSelect
                label="Producto"
                value={selectedProductoId}
                options={productoOptions}
                disabled={isSaving || productosQuery.isLoading || productosQuery.isError || productoOptions.length === 0}
                placeholder="Selecciona producto"
                selectClassName="w-full rounded-xl border border-[#d7cabb] bg-white px-3 py-2 text-[13px] font-medium text-[#2b2f36] shadow-sm outline-none transition-colors hover:border-[#c0ad91] hover:bg-[#fffdf9] focus:border-vs-violet focus:ring-2 focus:ring-vs-violet/15 disabled:opacity-60 disabled:hover:border-[#d7cabb] disabled:hover:bg-white"
                onChange={value => {
                  setSelectedProductoId(value)
                  setProductoCantidad(1)
                  setProductoError(null)
                }}
              />
              {productosQuery.isLoading && <div className="text-[12px] text-[#8a7f70]">Cargando productos...</div>}
              {productosQuery.isError && <div className="text-[12px] text-vs-warn">No se pudieron cargar productos.</div>}
              {!productosQuery.isLoading && !productosQuery.isError && productoOptions.length === 0 && <div className="text-[12px] text-[#8a7f70]">No hay productos disponibles.</div>}

              <div className="grid grid-cols-[110px_1fr] gap-2">
                <label className="space-y-1">
                  <span className="text-[11px] text-[#8a7f70] uppercase tracking-wider block">Cantidad</span>
                  <input
                    type="number"
                    min={1}
                    max={maxProductoCantidad}
                    value={productoCantidad}
                    disabled={isSaving || !selectedProducto}
                    onChange={event => {
                      const raw = Math.max(1, Math.floor(Number(event.target.value)) || 1)
                      setProductoCantidad(maxProductoCantidad === undefined ? raw : Math.min(raw, Math.max(1, maxProductoCantidad)))
                      setProductoError(null)
                    }}
                    className="w-full rounded-xl border border-vs-line-2 bg-white px-3 py-2 text-[13px] outline-none disabled:opacity-60"
                  />
                </label>
                <label className="space-y-1 min-w-0">
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

              {productoError && <div className="text-[12px] text-vs-warn">{productoError}</div>}

              <button
                type="button"
                disabled={isSaving || !isProductoCantidadValida}
                onClick={handleAddDraftProducto}
                className="w-full bg-vs-ink text-white text-[13px] font-medium py-2.5 rounded-full hover:bg-[#1e2228] disabled:opacity-50 transition-colors"
              >
                Agregar producto
              </button>
            </div>
            )}

            <div className="rounded-xl border border-vs-line-2 bg-white/60 p-3 space-y-3">
              <ProductList
                productos={productos}
                isEditing={isEditing}
                onCantidadChange={handleDraftProductoCantidadChange}
                onNotasChange={handleDraftProductoNotasChange}
                onRemove={handleRemoveDraftProducto}
                onRestore={handleRestoreDraftProducto}
              />
              {productos.length > 0 && (
                <div className="flex items-center justify-between gap-4 border-t border-vs-line-2 pt-3 text-[13px] font-semibold">
                  <span>Total productos</span>
                  <span className="font-mono">{formatPeso(productosTotal)}</span>
                </div>
              )}
            </div>
          </div>
        </Section>

        <Section title="Servicios">
          {servicios.length > 0 ? (
            <div className="rounded-xl border border-vs-line-2 bg-white/60 p-3">
              <div className="divide-y divide-vs-line-2">
                {servicios.map(servicio => (
                  <div key={servicio.id} className="flex items-center justify-between gap-4 py-2 first:pt-0">
                    <div className="text-[13px] text-[#2b2f36] font-medium">{servicio.nombre}</div>
                    <div className="text-[13px] text-[#2b2f36] font-mono shrink-0">{formatPeso(servicio.precioBase)}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <EmptyState>Sin servicios asociados.</EmptyState>
          )}
        </Section>

        <Section title="Resumen">
          <div className="rounded-xl border border-vs-line-2 bg-white/60 p-3 space-y-3">
            <SummaryRow label="Total productos" value={formatPeso(productosTotal)} />
            <SummaryRow label="Total servicios" value={formatPeso(serviciosTotal)} />
            <SummaryRow label="Total orden" value={formatPeso(total)} strong />
          </div>
        </Section>

        {comentarios.length > 0 && (
          <Section title="Comentarios">
            <ul className="space-y-4 relative pl-5 before:absolute before:left-[6px] before:top-1 before:bottom-1 before:w-px before:bg-vs-line-2">
              {comentarios.map((comentario, i) => (
                <li key={`${comentario.createdAt}-${i}`} className="relative">
                  <span className="absolute -left-5 top-1.5 w-3 h-3 rounded-full bg-vs-violet-bg border-2 border-white" />
                  <div className="text-[11.5px] text-[#8a7f70]">{comentario.usuario} - {formatFecha(comentario.createdAt)}</div>
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

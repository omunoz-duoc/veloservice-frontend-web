"use client"

import { useState, useRef, useEffect } from "react"
import { X, Plus, Minus, Bike, Wrench, Search, User, ChevronLeft, Loader2, ChevronDown } from "lucide-react"
import { TIPOS_BICI } from "./ordenes.constants"
import type {
  Prioridad, ClienteResult, BicicletaResult, ProductoResult, ProductoSeleccionado, CreateOTResponse,
} from "./ordenes.types"
import { useNuevaOT, type NuevoClienteForm, type NuevaBiciForm } from "@/features/panel/hooks/useNuevaOT"
import type { Servicio } from "@/features/panel/types/servicios.types"

// ─── Primitive form components ─────────────────────────────────────────────────

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <div className="text-[11px] text-[#8a7f70] mb-1.5 uppercase tracking-wider">
      {children}
      {required && <span className="text-vs-warn ml-0.5">*</span>}
    </div>
  )
}

function Input({
  value, onChange, placeholder, type = "text", error,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  error?: boolean
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full bg-vs-chip rounded-xl px-3 py-2 text-[12.5px] outline-none border placeholder:text-[#b8a88d] focus:border-[#a59682] transition-colors ${
        error ? "border-vs-warn ring-2 ring-vs-warn/30" : "border-vs-line-2"
      }`}
    />
  )
}

function Select({
  value, onChange, options, disabled,
}: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
  disabled?: boolean
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        className="w-full appearance-none bg-vs-chip rounded-xl px-3 py-2 text-[12.5px] outline-none border border-vs-line-2 pr-8 text-vs-ink focus:border-[#a59682] transition-colors disabled:opacity-60"
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8a7f70] pointer-events-none">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </span>
    </div>
  )
}

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="pt-4 border-t border-vs-line-2 first:pt-0 first:border-0">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-full bg-vs-chip flex items-center justify-center text-[#4a4438]">
          {icon}
        </div>
        <div className="text-[12px] font-semibold text-[#4a4438] uppercase tracking-wider">{title}</div>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

function BackLink({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1 text-[11.5px] text-[#8a7f70] hover:text-[#4a4438] transition-colors"
    >
      <ChevronLeft size={13} strokeWidth={2} />
      {label}
    </button>
  )
}

// ─── ServiciosMultiSelect ─────────────────────────────────────────────────────

function ServiciosMultiSelect({
  servicios, loading,
  selectedIds, onAdd, onRemove,
  error, onFirstFocus,
}: {
  servicios: Servicio[]
  loading: boolean
  selectedIds: string[]
  onAdd: (id: string) => void
  onRemove: (id: string) => void
  error?: boolean
  onFirstFocus: () => void
}) {
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const filtered = query.trim()
    ? servicios.filter(s => s.nombre.toLowerCase().includes(query.toLowerCase()))
    : servicios

  const selectedServicios = servicios.filter(s => selectedIds.includes(s.id))

  return (
    <div className="space-y-2">
      <div ref={containerRef} className="relative">
        <div
          className={`flex items-center gap-2 bg-vs-chip rounded-xl px-3 py-2 border transition-colors cursor-text ${
            error ? "border-vs-warn ring-2 ring-vs-warn/30" : open ? "border-[#a59682]" : "border-vs-line-2"
          }`}
          onClick={() => setOpen(true)}
        >
          <Search size={13} strokeWidth={1.8} className="text-[#8a7f70] shrink-0" />
          <input
            value={query}
            onChange={e => { setQuery(e.target.value); setOpen(true) }}
            onFocus={() => { setOpen(true); onFirstFocus() }}
            placeholder={loading ? "Cargando servicios…" : "Buscar y agregar servicio…"}
            disabled={loading}
            className="flex-1 bg-transparent text-[12.5px] outline-none placeholder:text-[#b8a88d]"
          />
          {loading
            ? <Loader2 size={13} strokeWidth={2} className="text-[#8a7f70] animate-spin shrink-0" />
            : <ChevronDown size={13} strokeWidth={2} className="text-[#8a7f70] shrink-0" />
          }
        </div>

        {open && !loading && (
          <div className="absolute z-10 mt-1 w-full bg-vs-card border border-vs-line rounded-2xl shadow-lg overflow-hidden max-h-52 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-3 py-3 text-[12px] text-[#8a7f70]">Sin resultados para &quot;{query}&quot;</div>
            ) : filtered.map(s => {
              const selected = selectedIds.includes(s.id)
              return (
                <button
                  key={s.id}
                  type="button"
                  onMouseDown={() => { if (selected) onRemove(s.id); else onAdd(s.id) }}
                  className={`w-full text-left px-3 py-2.5 flex items-center justify-between border-b border-vs-line-2 last:border-0 transition-colors ${
                    selected ? "bg-[#ebe7fa] hover:bg-[#e0d9f8]" : "hover:bg-vs-chip"
                  }`}
                >
                  <div>
                    <div className="text-[12.5px] font-medium text-vs-ink">{s.nombre}</div>
                    <div className="text-[11px] text-[#8a7f70]">${s.precioBase.toLocaleString("es-CL")}</div>
                  </div>
                  {selected && (
                    <div className="w-4 h-4 rounded-full bg-[#6b5bd1] flex items-center justify-center shrink-0">
                      <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M2 6l3 3 5-5" />
                      </svg>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Pills */}
      {selectedServicios.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedServicios.map(s => (
            <span
              key={s.id}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#ebe7fa] text-[#6b5bd1] text-[11.5px] font-medium"
            >
              {s.nombre}
              <button
                type="button"
                onClick={() => onRemove(s.id)}
                className="ml-0.5 hover:text-[#4a3bad] transition-colors"
                aria-label={`Quitar ${s.nombre}`}
              >
                <X size={11} strokeWidth={2.5} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── ProductosMultiSelect ─────────────────────────────────────────────────────

function ProductosMultiSelect({
  productos, loading,
  selected, onAdd, onRemove, onUpdateCantidad,
  onFirstFocus,
}: {
  productos: ProductoResult[]
  loading: boolean
  selected: ProductoSeleccionado[]
  onAdd: (id: string) => void
  onRemove: (id: string) => void
  onUpdateCantidad: (id: string, cantidad: number) => void
  onFirstFocus: () => void
}) {
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const selectedIds = selected.map(p => p.productoId)
  const filtered = query.trim()
    ? productos.filter(p => p.nombre.toLowerCase().includes(query.toLowerCase()))
    : productos

  return (
    <div className="space-y-2">
      <div ref={containerRef} className="relative">
        <div
          className={`flex items-center gap-2 bg-vs-chip rounded-xl px-3 py-2 border transition-colors cursor-text ${
            open ? "border-[#a59682]" : "border-vs-line-2"
          }`}
          onClick={() => setOpen(true)}
        >
          <Search size={13} strokeWidth={1.8} className="text-[#8a7f70] shrink-0" />
          <input
            value={query}
            onChange={e => { setQuery(e.target.value); setOpen(true) }}
            onFocus={() => { setOpen(true); onFirstFocus() }}
            placeholder={loading ? "Cargando productos…" : "Buscar y agregar producto…"}
            disabled={loading}
            className="flex-1 bg-transparent text-[12.5px] outline-none placeholder:text-[#b8a88d]"
          />
          {loading
            ? <Loader2 size={13} strokeWidth={2} className="text-[#8a7f70] animate-spin shrink-0" />
            : <ChevronDown size={13} strokeWidth={2} className="text-[#8a7f70] shrink-0" />
          }
        </div>

        {open && !loading && (
          <div className="absolute z-10 mt-1 w-full bg-vs-card border border-vs-line rounded-2xl shadow-lg overflow-hidden max-h-52 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-3 py-3 text-[12px] text-[#8a7f70]">Sin resultados para &quot;{query}&quot;</div>
            ) : filtered.map(p => {
              const isSel = selectedIds.includes(p.id)
              return (
                <button
                  key={p.id}
                  type="button"
                  onMouseDown={() => { if (isSel) onRemove(p.id); else onAdd(p.id) }}
                  className={`w-full text-left px-3 py-2.5 flex items-center justify-between border-b border-vs-line-2 last:border-0 transition-colors ${
                    isSel ? "bg-[#ebe7fa] hover:bg-[#e0d9f8]" : "hover:bg-vs-chip"
                  }`}
                >
                  <div>
                    <div className="text-[12.5px] font-medium text-vs-ink">{p.nombre}</div>
                    <div className="text-[11px] text-[#8a7f70]">
                      ${p.precioVenta.toLocaleString("es-CL")} · stock {p.stock}
                    </div>
                  </div>
                  {isSel && (
                    <div className="w-4 h-4 rounded-full bg-[#6b5bd1] flex items-center justify-center shrink-0">
                      <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M2 6l3 3 5-5" />
                      </svg>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Selected products with inline quantity stepper */}
      {selected.length > 0 && (
        <div className="space-y-1.5">
          {selected.map(p => (
            <div
              key={p.productoId}
              className="flex items-center gap-2 bg-vs-chip rounded-xl px-3 py-2 border border-vs-line-2"
            >
              <div className="flex-1 min-w-0">
                <div className="text-[12.5px] font-medium text-vs-ink truncate">{p.nombre}</div>
                <div className="text-[11px] text-[#8a7f70]">${p.precioVenta.toLocaleString("es-CL")} c/u</div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => onUpdateCantidad(p.productoId, p.cantidad - 1)}
                  disabled={p.cantidad <= 1}
                  className="w-6 h-6 rounded-full bg-vs-card border border-vs-line-2 flex items-center justify-center text-[#4a4438] hover:bg-[#ebe3d6] disabled:opacity-40 transition-colors"
                  aria-label="Disminuir cantidad"
                >
                  <Minus size={12} strokeWidth={2.5} />
                </button>
                <input
                  type="number"
                  min={1}
                  value={p.cantidad}
                  onChange={e => onUpdateCantidad(p.productoId, parseInt(e.target.value, 10))}
                  className="w-9 text-center bg-transparent text-[12.5px] font-medium outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button
                  type="button"
                  onClick={() => onUpdateCantidad(p.productoId, p.cantidad + 1)}
                  className="w-6 h-6 rounded-full bg-vs-card border border-vs-line-2 flex items-center justify-center text-[#4a4438] hover:bg-[#ebe3d6] transition-colors"
                  aria-label="Aumentar cantidad"
                >
                  <Plus size={12} strokeWidth={2.5} />
                </button>
              </div>
              <button
                type="button"
                onClick={() => onRemove(p.productoId)}
                className="ml-1 text-[#8a7f70] hover:text-vs-warn transition-colors shrink-0"
                aria-label={`Quitar ${p.nombre}`}
              >
                <X size={13} strokeWidth={2.2} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── ClienteCombobox ──────────────────────────────────────────────────────────

function ClienteCombobox({
  query, onQueryChange,
  results, loading,
  onSelect, onCreateNew,
  onFirstFocus,
  error,
}: {
  query: string
  onQueryChange: (v: string) => void
  results: ClienteResult[]
  loading: boolean
  onSelect: (c: ClienteResult) => void
  onCreateNew: () => void
  onFirstFocus: () => void
  error?: boolean
}) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const showDropdown = open && (loading || results.length > 0 || query.trim().length > 0)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  return (
    <div ref={containerRef} className="relative">
      <div className={`flex items-center gap-2 bg-vs-chip rounded-xl px-3 py-2 border transition-colors ${
        error ? "border-vs-warn ring-2 ring-vs-warn/30" : open ? "border-[#a59682]" : "border-vs-line-2"
      }`}>
        <Search size={13} strokeWidth={1.8} className="text-[#8a7f70] shrink-0" />
        <input
          value={query}
          onChange={e => { onQueryChange(e.target.value); setOpen(true) }}
          onFocus={() => { setOpen(true); onFirstFocus() }}
          placeholder="Buscar cliente por nombre o RUT…"
          className="flex-1 bg-transparent text-[12.5px] outline-none placeholder:text-[#b8a88d]"
        />
        {loading && <Loader2 size={13} strokeWidth={2} className="text-[#8a7f70] animate-spin shrink-0" />}
      </div>

      {showDropdown && (
        <div className="absolute z-10 mt-1 w-full bg-vs-card border border-vs-line rounded-2xl shadow-lg overflow-hidden">
          {loading && (
            <div className="px-3 py-3 text-[12px] text-[#8a7f70]">Buscando…</div>
          )}
          {!loading && results.length === 0 && query.trim() && (
            <div className="px-3 py-3 text-[12px] text-[#8a7f70]">Sin resultados para &quot;{query}&quot;</div>
          )}
          {!loading && results.map(c => (
            <button
              key={c.id}
              type="button"
              onMouseDown={() => { onSelect(c); setOpen(false) }}
              className="w-full text-left px-3 py-2.5 hover:bg-vs-chip transition-colors border-b border-vs-line-2 last:border-0"
            >
              <div className="text-[12.5px] font-medium text-vs-ink">{c.nombre}</div>
              <div className="text-[11px] text-[#8a7f70]">{c.rut}</div>
            </button>
          ))}
          <button
            type="button"
            onMouseDown={() => { onCreateNew(); setOpen(false) }}
            className="w-full text-left px-3 py-2.5 flex items-center gap-2 text-[12.5px] font-medium text-[#6b5bd1] hover:bg-[#ebe7fa] transition-colors"
          >
            <Plus size={14} strokeWidth={2} />
            Crear nuevo cliente
          </button>
        </div>
      )}
    </div>
  )
}

// ─── ClienteForm ──────────────────────────────────────────────────────────────

function ClienteForm({
  form, onChange, errors, onBack,
}: {
  form: NuevoClienteForm
  onChange: <K extends keyof NuevoClienteForm>(key: K, val: string) => void
  errors: Partial<Record<string, boolean>>
  onBack: () => void
}) {
  return (
    <div className="space-y-3">
      <BackLink onClick={onBack} label="Buscar cliente existente" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <Label required>Nombre</Label>
          <Input value={form.nombre} onChange={v => onChange("nombre", v)} placeholder="Nombre" error={errors["cliente_nombre"]} />
          {errors["cliente_nombre"] && <p className="text-[11px] text-vs-warn mt-1">Requerido</p>}
        </div>
        <div>
          <Label required>Apellido</Label>
          <Input value={form.apellido} onChange={v => onChange("apellido", v)} placeholder="Apellido" error={errors["cliente_apellido"]} />
          {errors["cliente_apellido"] && <p className="text-[11px] text-vs-warn mt-1">Requerido</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <Label required>RUT</Label>
          <Input value={form.rut} onChange={v => onChange("rut", v)} placeholder="12.345.678-9" error={errors["cliente_rut"]} />
          {errors["cliente_rut"] && <p className="text-[11px] text-vs-warn mt-1">Requerido</p>}
        </div>
        <div>
          <Label required>Teléfono</Label>
          <Input value={form.telefono} onChange={v => onChange("telefono", v)} placeholder="+56 9 …" type="tel" error={errors["cliente_telefono"]} />
          {errors["cliente_telefono"] && <p className="text-[11px] text-vs-warn mt-1">Requerido</p>}
        </div>
      </div>
      <div>
        <Label required>Email</Label>
        <Input value={form.email} onChange={v => onChange("email", v)} placeholder="email@ejemplo.com" type="email" error={errors["cliente_email"]} />
        {errors["cliente_email"] && <p className="text-[11px] text-vs-warn mt-1">Requerido</p>}
      </div>
    </div>
  )
}

// ─── BicicletaSelect ──────────────────────────────────────────────────────────

function BicicletaSelect({
  loading, bicicletas, selected, onSelect, onCreateNew, error,
}: {
  loading: boolean
  bicicletas: BicicletaResult[]
  selected: BicicletaResult | null
  onSelect: (b: BicicletaResult | null) => void
  onCreateNew: () => void
  error?: boolean
}) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 text-[12px] text-[#8a7f70]">
        <Loader2 size={14} strokeWidth={2} className="animate-spin" />
        Cargando bicicletas…
      </div>
    )
  }

  const options = [
    ...bicicletas.map(b => ({ value: b.id, label: `${b.marca} ${b.modelo} · ${b.color}` })),
    { value: "__new__", label: "+ Nueva bicicleta" },
  ]

  const handleChange = (v: string) => {
    if (v === "__new__") {
      onCreateNew()
    } else {
      onSelect(bicicletas.find(b => b.id === v) ?? null)
    }
  }

  return (
    <div>
      <Select
        value={selected?.id ?? ""}
        onChange={handleChange}
        options={options}
      />
      {error && <p className="text-[11px] text-vs-warn mt-1">Selecciona una bicicleta</p>}
    </div>
  )
}

// ─── BicicletaForm ────────────────────────────────────────────────────────────

function BicicletaForm({
  form, onChange, errors, showBack, onBack,
}: {
  form: NuevaBiciForm
  onChange: <K extends keyof NuevaBiciForm>(key: K, val: string) => void
  errors: Partial<Record<string, boolean>>
  showBack: boolean
  onBack: () => void
}) {
  const tipoOptions = TIPOS_BICI.map(t => ({ value: t, label: t }))

  return (
    <div className="space-y-3">
      {showBack && <BackLink onClick={onBack} label="Seleccionar bicicleta existente" />}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <Label required>Marca</Label>
          <Input value={form.marca} onChange={v => onChange("marca", v)} placeholder="ej. Trek" error={errors["bici_marca"]} />
          {errors["bici_marca"] && <p className="text-[11px] text-vs-warn mt-1">Requerido</p>}
        </div>
        <div>
          <Label required>Modelo</Label>
          <Input value={form.modelo} onChange={v => onChange("modelo", v)} placeholder="ej. Marlin 7 2024" error={errors["bici_modelo"]} />
          {errors["bici_modelo"] && <p className="text-[11px] text-vs-warn mt-1">Requerido</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <Label required>Tipo</Label>
          <Select value={form.tipo} onChange={v => onChange("tipo", v)} options={tipoOptions} />
        </div>
        <div>
          <Label required>Aro</Label>
          <Input value={form.aro} onChange={v => onChange("aro", v)} placeholder="ej. 29, 700c, 27.5" error={errors["bici_aro"]} />
          {errors["bici_aro"] && <p className="text-[11px] text-vs-warn mt-1">Requerido</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <Label required>Color</Label>
          <Input value={form.color} onChange={v => onChange("color", v)} placeholder="ej. Rojo Volcán" error={errors["bici_color"]} />
          {errors["bici_color"] && <p className="text-[11px] text-vs-warn mt-1">Requerido</p>}
        </div>
        <div>
          <Label>Número de serie</Label>
          <Input value={form.numSerie} onChange={v => onChange("numSerie", v)} placeholder="Opcional" />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <Label>Año</Label>
          <Input value={form.anio} onChange={v => onChange("anio", v)} placeholder="ej. 2024" type="number" />
        </div>
        <div />
      </div>
      <div>
        <Label>Notas</Label>
        <textarea
          value={form.notas}
          onChange={e => onChange("notas", e.target.value)}
          rows={2}
          placeholder="Notas sobre la bicicleta…"
          className="w-full bg-vs-chip rounded-xl px-3 py-2 text-[12.5px] outline-none border border-vs-line-2 leading-relaxed resize-none placeholder:text-[#b8a88d] focus:border-[#a59682] transition-colors"
        />
      </div>
    </div>
  )
}

// ─── Modal ─────────────────────────────────────────────────────────────────────

export function NuevaOTModal({
  onClose, onCreate, prefillCliente,
}: {
  onClose: () => void
  onCreate: (result: CreateOTResponse) => void
  prefillCliente?: ClienteResult
}) {
  const {
    clienteQuery, setClienteQuery,
    clientes, clienteLoading,
    clienteMode,
    selectedCliente,
    newClienteForm,
    switchToNewCliente,
    switchToSearchCliente,
    selectCliente,
    setClienteField,
    loadClientes,
    bicicletas, biciLoading,
    biciMode, setBiciMode,
    selectedBicicleta, setSelectedBicicleta,
    newBiciForm, setBiciField,
    tipos, mecanicos, catalogLoading,
    servicios, serviciosLoading,
    addServicio, removeServicio,
    loadServicios,
    productos, productosLoading,
    addProducto, removeProducto, updateProductoCantidad,
    loadProductos,
    otForm, setOTField,
    errors, submitting, submitError,
    submit,
  } = useNuevaOT({ onClose, onCreate, prefillCliente })

  const clienteResolved = selectedCliente !== null || clienteMode === "new"

  const tipoOptions = catalogLoading
    ? [{ value: "", label: "Cargando tipos…" }]
    : tipos.map(t => ({ value: t.id, label: t.nombre }))

  const mecOptions = [
    { value: "", label: "Sin asignar" },
    ...mecanicos.map(m => ({ value: m.id, label: m.nombre })),
  ]

  const prioOptions = [
    { value: "baja",  label: "Baja" },
    { value: "media", label: "Media" },
    { value: "alta",  label: "Alta" },
  ]

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div onClick={onClose} className="flex-1 bg-black/30 backdrop-blur-sm" />

      {/* Panel */}
      <div className="flex h-full w-full max-w-[540px] flex-col overflow-y-auto bg-black/30 backdrop-blur-sm">
        <div className="bg-vs-card border border-vs-line rounded-[24px] m-3 mb-0 flex flex-col">

          {/* Header */}
          <div className="flex items-center gap-3 p-5 border-b border-vs-line-2">
            <div className="w-10 h-10 rounded-full bg-vs-ink flex items-center justify-center shrink-0">
              <Plus size={18} strokeWidth={2} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="text-[11px] text-[#8a7f70] uppercase tracking-widest">Nueva orden de trabajo</div>
              <div className="text-[15px] font-semibold text-[#4a4438]">Registrar trabajo</div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-vs-chip hover:bg-[#ebe3d6] flex items-center justify-center transition-colors"
            >
              <X size={16} strokeWidth={1.6} />
            </button>
          </div>

          {/* Form */}
          <div className="p-5 space-y-5">

            {/* Section: Cliente */}
            <Section icon={<User size={14} strokeWidth={1.6} />} title="Cliente">
              {clienteMode === "search" ? (
                <>
                  <ClienteCombobox
                    query={clienteQuery}
                    onQueryChange={setClienteQuery}
                    results={clientes}
                    loading={clienteLoading}
                    onSelect={selectCliente}
                    onCreateNew={switchToNewCliente}
                    onFirstFocus={loadClientes}
                    error={errors["clienteQuery"]}
                  />
                  {errors["clienteQuery"] && (
                    <p className="text-[11px] text-vs-warn -mt-3">Selecciona o crea un cliente</p>
                  )}
                </>
              ) : (
                <ClienteForm
                  form={newClienteForm}
                  onChange={setClienteField}
                  errors={errors}
                  onBack={switchToSearchCliente}
                />
              )}
            </Section>

            {/* Section: Bicicleta — only shown after cliente is resolved */}
            {clienteResolved && (
              <Section icon={<Bike size={14} strokeWidth={1.6} />} title="Bicicleta">
                {biciMode === "select" ? (
                  <BicicletaSelect
                    loading={biciLoading}
                    bicicletas={bicicletas}
                    selected={selectedBicicleta}
                    onSelect={setSelectedBicicleta}
                    onCreateNew={() => setBiciMode("new")}
                    error={errors["bicicleta"]}
                  />
                ) : (
                  <BicicletaForm
                    form={newBiciForm}
                    onChange={setBiciField}
                    errors={errors}
                    showBack={bicicletas.length > 0}
                    onBack={() => setBiciMode("select")}
                  />
                )}
              </Section>
            )}

            {/* Section: Orden de trabajo */}
            <Section icon={<Wrench size={14} strokeWidth={1.6} />} title="Orden de trabajo">

              {/* Tipo */}
              <div>
                <Label required>Tipo de trabajo</Label>
                <Select
                  value={otForm.tipoId}
                  onChange={v => setOTField("tipoId", v)}
                  options={tipoOptions}
                  disabled={catalogLoading}
                />
                {errors["tipoId"] && <p className="text-[11px] text-vs-warn mt-1">Selecciona un tipo</p>}
              </div>

              {/* Servicios multi-select */}
              <div>
                <Label required>Servicios</Label>
                <ServiciosMultiSelect
                  servicios={servicios}
                  loading={serviciosLoading}
                  selectedIds={otForm.servicioIds}
                  onAdd={addServicio}
                  onRemove={removeServicio}
                  onFirstFocus={loadServicios}
                  error={errors["servicioIds"]}
                />
                {errors["servicioIds"] && (
                  <p className="text-[11px] text-vs-warn mt-1">Agrega al menos un servicio</p>
                )}
              </div>

              {/* Productos multi-select */}
              <div>
                <Label>Productos</Label>
                <ProductosMultiSelect
                  productos={productos}
                  loading={productosLoading}
                  selected={otForm.productos}
                  onAdd={addProducto}
                  onRemove={removeProducto}
                  onUpdateCantidad={updateProductoCantidad}
                  onFirstFocus={loadProductos}
                />
              </div>

              {/* Prioridad + Fecha */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <Label required>Prioridad</Label>
                  <Select
                    value={otForm.prioridad}
                    onChange={v => setOTField("prioridad", v as Prioridad)}
                    options={prioOptions}
                  />
                </div>
                <div>
                  <Label required>Fecha estimada entrega</Label>
                  <Input
                    type="date"
                    value={otForm.fechaPrometida}
                    onChange={v => setOTField("fechaPrometida", v)}
                    error={errors["fechaPrometida"]}
                  />
                  {errors["fechaPrometida"] && (
                    <p className="text-[11px] text-vs-warn mt-1">Campo requerido</p>
                  )}
                </div>
              </div>

              {/* Mecánico */}
              <div>
                <Label>Mecánico asignado</Label>
                <Select
                  value={otForm.mecanicoId}
                  onChange={v => setOTField("mecanicoId", v)}
                  options={mecOptions}
                  disabled={catalogLoading}
                />
              </div>

              {/* Descripción → diagnosticoInicial */}
              <div>
                <Label required>Descripción del trabajo</Label>
                <textarea
                  value={otForm.diagnosticoInicial}
                  onChange={e => setOTField("diagnosticoInicial", e.target.value)}
                  rows={4}
                  placeholder="Describe el trabajo a realizar, síntomas observados, piezas a reemplazar…"
                  className={`w-full bg-vs-chip rounded-xl px-3 py-2 text-[12.5px] outline-none border leading-relaxed resize-none placeholder:text-[#b8a88d] focus:border-[#a59682] transition-colors ${
                    errors["diagnosticoInicial"] ? "border-vs-warn ring-2 ring-vs-warn/30" : "border-vs-line-2"
                  }`}
                />
                {errors["diagnosticoInicial"] && (
                  <p className="text-[11px] text-vs-warn mt-1">Campo requerido</p>
                )}
              </div>

              {/* Notas internas → observacionesCliente */}
              <div>
                <Label>Notas internas</Label>
                <textarea
                  value={otForm.observacionesCliente}
                  onChange={e => setOTField("observacionesCliente", e.target.value)}
                  rows={2}
                  placeholder="Notas visibles solo para el equipo del taller…"
                  className="w-full bg-vs-chip rounded-xl px-3 py-2 text-[12.5px] outline-none border border-vs-line-2 leading-relaxed resize-none placeholder:text-[#b8a88d] focus:border-[#a59682] transition-colors"
                />
              </div>
            </Section>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-3 p-5 border-t border-vs-line-2 bg-[#faf6f0] rounded-b-[24px] flex-wrap">
            {submitError && (
              <p className="w-full text-[11.5px] text-vs-warn">{submitError}</p>
            )}
            <div className="text-[11.5px] text-[#8a7f70]">
              Estado inicial: <span className="font-semibold text-[#6b5d46]">Recibido</span>
            </div>
            <div className="flex-1" />
            <button
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 rounded-full bg-vs-chip text-vs-ink text-[13px] font-medium hover:bg-[#ebe3d6] transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={submit}
              disabled={submitting || catalogLoading}
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-vs-ink text-white text-[13px] font-medium hover:bg-[#1e2228] transition-colors disabled:opacity-50"
            >
              {submitting
                ? <Loader2 size={15} strokeWidth={2} className="animate-spin" />
                : <Plus size={15} strokeWidth={2} />
              }
              Crear OT
            </button>
          </div>
        </div>
        <div className="h-5" />
      </div>
    </div>
  )
}

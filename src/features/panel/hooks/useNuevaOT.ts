"use client"

import { useState, useRef, useCallback, useEffect, useMemo } from "react"
import { getApiErrorMessage } from "@/lib/api/api-error"
import { useAuthStore } from "@/features/auth/store/auth.store"
import {
  type Prioridad,
  type ClienteResult,
  type BicicletaResult,
  type TipoTrabajo,
  type MecanicoApi,
  type ProductoResult,
  type ProductoSeleccionado,
  type CreateOTPayload,
  type CreateOTResponse,
} from "../components/ordenes/ordenes.types"
import { nuevaOTService } from "../services/nuevaOT.provider"
import { serviciosService } from "../services/servicios.provider"
import type { Servicio } from "../types/servicios.types"

// Role that is taller-scoped and must send sucursalId from localStorage.
const ADMIN_TALLER_ROL = "admin_taller"
// TODO: temporary key — will be renamed when the active-sucursal selector is finalized.
const SUCURSAL_STORAGE_KEY = "sucursalId"

// ─── Sub-form types ────────────────────────────────────────────────────────────

export type NuevoClienteForm = {
  nombre: string; apellido: string; rut: string
  telefono: string; email: string
}

export type NuevaBiciForm = {
  marca: string; modelo: string; tipo: string; aro: string
  color: string; numSerie: string; anio: string; notas: string
}

export type OTForm = {
  tipoId: string
  servicioIds: string[]
  productos: ProductoSeleccionado[]
  prioridad: Prioridad
  fechaPrometida: string
  mecanicoId: string // "" = sin asignar
  diagnosticoInicial: string
  observacionesCliente: string
}

type Errors = Partial<Record<string, boolean>>

const EMPTY_CLIENTE: NuevoClienteForm = {
  nombre: "", apellido: "", rut: "", telefono: "", email: "",
}

const EMPTY_BICI: NuevaBiciForm = {
  marca: "", modelo: "", tipo: "MTB", aro: "",
  color: "", numSerie: "", anio: "", notas: "",
}

const EMPTY_OT: OTForm = {
  tipoId: "", servicioIds: [], productos: [],
  prioridad: "media", fechaPrometida: "", mecanicoId: "",
  diagnosticoInicial: "", observacionesCliente: "",
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

export function useNuevaOT({
  onClose,
  onCreate,
  prefillCliente,
}: {
  onClose: () => void
  onCreate: (result: CreateOTResponse) => void
  prefillCliente?: ClienteResult
}) {
  // Cliente search
  const [clienteQuery, setClienteQuery] = useState(prefillCliente?.nombre ?? "")
  const [allClientes, setAllClientes] = useState<ClienteResult[]>(prefillCliente ? [prefillCliente] : [])
  const [clienteLoading, setClienteLoading] = useState(false)
  const [clienteMode, setClienteMode] = useState<"search" | "new">("search")
  const [selectedCliente, setSelectedCliente] = useState<ClienteResult | null>(prefillCliente ?? null)
  const [newClienteForm, setNewClienteForm] = useState<NuevoClienteForm>(EMPTY_CLIENTE)
  const clientesLoadedRef = useRef(false)

  // Bicicleta
  const [bicicletas, setBicicletas] = useState<BicicletaResult[]>([])
  const [biciLoading, setBiciLoading] = useState(false)
  const [biciMode, setBiciMode] = useState<"select" | "new">("new")
  const [selectedBicicleta, setSelectedBicicleta] = useState<BicicletaResult | null>(null)
  const [newBiciForm, setNewBiciForm] = useState<NuevaBiciForm>(EMPTY_BICI)

  // Catalogs loaded on mount
  const [tipos, setTipos] = useState<TipoTrabajo[]>([])
  const [mecanicos, setMecanicos] = useState<MecanicoApi[]>([])
  const [catalogLoading, setCatalogLoading] = useState(true)

  // Servicios (lazy)
  const [servicios, setServicios] = useState<Servicio[]>([])
  const [serviciosLoading, setServiciosLoading] = useState(false)
  const serviciosLoadedRef = useRef(false)

  // Productos (lazy)
  const [productos, setProductos] = useState<ProductoResult[]>([])
  const [productosLoading, setProductosLoading] = useState(false)
  const productosLoadedRef = useRef(false)

  // OT
  const [otForm, setOTForm] = useState<OTForm>(EMPTY_OT)

  // Submit state
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // ─── Bicicleta loader (per cliente) ──────────────────────────────────────────

  const loadBicicletas = useCallback(async (clienteId: string) => {
    setBiciLoading(true)
    try {
      const  bicicletas  = await nuevaOTService.getBicicletas(clienteId)
      setBicicletas(bicicletas)
      if (bicicletas.length > 0) {
        setBiciMode("select")
        setSelectedBicicleta(bicicletas[0])
      } else {
        setBiciMode("new")
        setSelectedBicicleta(null)
      }
    } catch {
      setBicicletas([])
      setBiciMode("new")
      setSelectedBicicleta(null)
    } finally {
      setBiciLoading(false)
    }
  }, [])

  // ─── Mount: load tipos + mecanicos, and prefilled cliente's bikes ────────────

  useEffect(() => {
    let active = true
    Promise.all([nuevaOTService.getTipos(), nuevaOTService.getMecanicos()])
      .then(([tiposRes, mecRes]) => {
        if (!active) return
        setTipos(tiposRes)
        setMecanicos(mecRes)
        setOTForm(prev => prev.tipoId ? prev : { ...prev, tipoId: tiposRes[0]?.id ?? "" })
      })
      .catch(() => {
        if (!active) return
        setTipos([])
        setMecanicos([])
      })
      .finally(() => { if (active) setCatalogLoading(false) })

    // Defer past the synchronous effect body so the initial bici fetch
    // doesn't set state during render-commit (avoids cascading renders).
    if (prefillCliente) {
      const clienteId = prefillCliente.id
      queueMicrotask(() => { if (active) void loadBicicletas(clienteId) })
    }
    return () => { active = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ─── Filtered clientes (local) ───────────────────────────────────────────────

  const clientes = useMemo(() => {
    if (!clienteQuery.trim()) return allClientes
    const q = clienteQuery.toLowerCase()
    return allClientes.filter(c =>
      c.nombre.toLowerCase().includes(q) || c.rut.toLowerCase().includes(q)
    )
  }, [allClientes, clienteQuery])

  // ─── Lazy loaders ────────────────────────────────────────────────────────────

  const loadClientes = useCallback(async () => {
    if (clientesLoadedRef.current) return
    clientesLoadedRef.current = true
    setClienteLoading(true)
    try {
      const clientes  = await nuevaOTService.getClientes()
      setAllClientes(clientes)
    } catch {
      setAllClientes([])
    } finally {
      setClienteLoading(false)
    }
  }, [])

  const loadServicios = useCallback(async () => {
    if (serviciosLoadedRef.current) return
    serviciosLoadedRef.current = true
    setServiciosLoading(true)
    try {
      const res = await serviciosService.getServicios()
      setServicios(res.servicios.filter(s => s.activo))
    } catch {
      setServicios([])
    } finally {
      setServiciosLoading(false)
    }
  }, [])

  const loadProductos = useCallback(async () => {
    if (productosLoadedRef.current) return
    productosLoadedRef.current = true
    setProductosLoading(true)
    try {
      const { productos: list } = await nuevaOTService.getProductos()
      setProductos(list)
    } catch {
      setProductos([])
    } finally {
      setProductosLoading(false)
    }
  }, [])

  // ─── Cliente handlers ────────────────────────────────────────────────────────

  const selectCliente = useCallback((cliente: ClienteResult) => {
    setSelectedCliente(cliente)
    setClienteQuery(cliente.nombre)
    void loadBicicletas(cliente.id)
  }, [loadBicicletas])

  const switchToNewCliente = useCallback(() => {
    setClienteMode("new")
    setSelectedCliente(null)
    setBicicletas([])
    setSelectedBicicleta(null)
    setBiciMode("new")
  }, [])

  const switchToSearchCliente = useCallback(() => {
    setClienteMode("search")
    setNewClienteForm(EMPTY_CLIENTE)
    setClienteQuery("")
    setBicicletas([])
    setSelectedBicicleta(null)
    setBiciMode("new")
  }, [])

  const setClienteField = useCallback(<K extends keyof NuevoClienteForm>(key: K, val: NuevoClienteForm[K]) => {
    setNewClienteForm(prev => ({ ...prev, [key]: val }))
    setErrors(prev => ({ ...prev, [`cliente_${key}`]: false }))
  }, [])

  // ─── Bicicleta handlers ──────────────────────────────────────────────────────

  const setBiciField = useCallback(<K extends keyof NuevaBiciForm>(key: K, val: NuevaBiciForm[K]) => {
    setNewBiciForm(prev => ({ ...prev, [key]: val }))
    setErrors(prev => ({ ...prev, [`bici_${key}`]: false }))
  }, [])

  // ─── OT handlers ─────────────────────────────────────────────────────────────

  const setOTField = useCallback(<K extends keyof OTForm>(key: K, val: OTForm[K]) => {
    setOTForm(prev => ({ ...prev, [key]: val }))
    setErrors(prev => ({ ...prev, [key]: false }))
  }, [])

  const addServicio = useCallback((id: string) => {
    setOTForm(prev => prev.servicioIds.includes(id)
      ? prev
      : { ...prev, servicioIds: [...prev.servicioIds, id] })
    setErrors(prev => ({ ...prev, servicioIds: false }))
  }, [])

  const removeServicio = useCallback((id: string) => {
    setOTForm(prev => ({ ...prev, servicioIds: prev.servicioIds.filter(s => s !== id) }))
  }, [])

  const addProducto = useCallback((id: string) => {
    setOTForm(prev => {
      if (prev.productos.some(p => p.productoId === id)) return prev
      const prod = productos.find(p => p.id === id)
      if (!prod) return prev
      return {
        ...prev,
        productos: [...prev.productos, {
          productoId: prod.id, nombre: prod.nombre,
          precioVenta: prod.precioVenta, cantidad: 1,
        }],
      }
    })
  }, [productos])

  const removeProducto = useCallback((id: string) => {
    setOTForm(prev => ({ ...prev, productos: prev.productos.filter(p => p.productoId !== id) }))
  }, [])

  const updateProductoCantidad = useCallback((id: string, cantidad: number) => {
    const safe = Number.isFinite(cantidad) ? Math.max(1, Math.floor(cantidad)) : 1
    setOTForm(prev => ({
      ...prev,
      productos: prev.productos.map(p => p.productoId === id ? { ...p, cantidad: safe } : p),
    }))
  }, [])

  // ─── Validation ──────────────────────────────────────────────────────────────

  const validate = useCallback((): boolean => {
    const next: Errors = {}
    let valid = true

    if (clienteMode === "new") {
      const required: (keyof NuevoClienteForm)[] = ["nombre", "apellido", "rut", "telefono", "email"]
      for (const k of required) {
        if (!newClienteForm[k].trim()) { next[`cliente_${k}`] = true; valid = false }
      }
    } else if (!selectedCliente) {
      next["clienteQuery"] = true; valid = false
    }

    if (biciMode === "new") {
      const required: (keyof NuevaBiciForm)[] = ["marca", "modelo", "tipo", "aro", "color"]
      for (const k of required) {
        if (!newBiciForm[k].trim()) { next[`bici_${k}`] = true; valid = false }
      }
    } else if (!selectedBicicleta) {
      next["bicicleta"] = true; valid = false
    }

    if (!otForm.tipoId) { next["tipoId"] = true; valid = false }
    if (otForm.servicioIds.length === 0) { next["servicioIds"] = true; valid = false }
    if (!otForm.fechaPrometida.trim()) { next["fechaPrometida"] = true; valid = false }
    if (!otForm.diagnosticoInicial.trim()) { next["diagnosticoInicial"] = true; valid = false }

    setErrors(next)
    return valid
  }, [biciMode, clienteMode, newBiciForm, newClienteForm, otForm, selectedBicicleta, selectedCliente])

  // ─── Submit ───────────────────────────────────────────────────────────────────

  const submit = useCallback(async () => {
    if (!validate()) return
    setSubmitting(true)
    setSubmitError(null)

    try {
      const user = useAuthStore.getState().user
      const sucursalId = user?.rol === ADMIN_TALLER_ROL
        ? (typeof window !== "undefined" ? localStorage.getItem(SUCURSAL_STORAGE_KEY) : null)
        : null

      const clientePart = clienteMode === "new"
        ? { clienteNuevo: { ...newClienteForm } }
        : { clienteId: selectedCliente!.id }

      const biciPart = biciMode === "new"
        ? {
            bicicletaNueva: {
              marca: newBiciForm.marca,
              modelo: newBiciForm.modelo,
              tipo: newBiciForm.tipo,
              aro: newBiciForm.aro,
              color: newBiciForm.color,
              numeroSerie: newBiciForm.numSerie || undefined,
              anio: newBiciForm.anio ? Number(newBiciForm.anio) : undefined,
              notas: newBiciForm.notas || undefined,
            },
          }
        : { bicicletaId: selectedBicicleta!.id }

      const tipoTrabajo = tipos.find(t => t.id === otForm.tipoId)?.id ?? ""

      const payload: CreateOTPayload = {
        ...(sucursalId ? { sucursalId } : {}),
        ...clientePart,
        ...biciPart,
        tipoTrabajo,
        prioridad: otForm.prioridad,
        ...(otForm.mecanicoId ? { mecanicoId: otForm.mecanicoId } : {}),
        fechaPrometida: otForm.fechaPrometida,
        diagnosticoInicial: otForm.diagnosticoInicial,
        ...(otForm.observacionesCliente.trim() ? { observacionesCliente: otForm.observacionesCliente } : {}),
        servicios: otForm.servicioIds.map(id => ({ servicioId: id })),
        productos: otForm.productos.map(p => ({ productoId: p.productoId, cantidad: p.cantidad })),
      }

      const result = await nuevaOTService.createOrden(payload)
      onCreate(result)
      onClose()
    } catch (err: unknown) {
      setSubmitError(getApiErrorMessage(err) ?? "Error al crear la orden. Intenta nuevamente.")
    } finally {
      setSubmitting(false)
    }
  }, [validate, clienteMode, biciMode, newClienteForm, newBiciForm, otForm, selectedCliente, selectedBicicleta, tipos, onCreate, onClose])

  return {
    // Cliente
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
    // Bicicleta
    bicicletas, biciLoading,
    biciMode, setBiciMode,
    selectedBicicleta, setSelectedBicicleta,
    newBiciForm,
    setBiciField,
    // Catalogs
    tipos, mecanicos, catalogLoading,
    // Servicios
    servicios, serviciosLoading,
    addServicio, removeServicio,
    loadServicios,
    // Productos
    productos, productosLoading,
    addProducto, removeProducto, updateProductoCantidad,
    loadProductos,
    // OT
    otForm, setOTField,
    // Submit
    errors, submitting, submitError,
    submit,
  }
}

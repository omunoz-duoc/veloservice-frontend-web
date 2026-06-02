"use client"

import { useState, useRef, useCallback, useMemo } from "react"
import { getApiErrorMessage } from "@/lib/api/api-error"
import { httpClient } from "@/lib/api/http-client"
import {
  type Prioridad, type OrdenTrabajo,
  type ClienteResult, type BicicletaResult, type NuevaOTApiPayload,
} from "../components/ordenes/ordenes.types"
import { clientesNuevaOTService } from "../services/clientes.nueva-ot.provider"
import { serviciosService } from "../services/servicios.provider"
import type { Servicio } from "../types/servicios.types"

// ─── Sub-form types ────────────────────────────────────────────────────────────

export type NuevoClienteForm = {
  nombre: string; apellido: string; rut: string
  telefono: string; email: string
}

export type NuevaBiciForm = {
  marca: string; modelo: string; tipo: string; color: string
  numSerie: string; anio: string
}

export type OTForm = {
  servicioIds: string[]; prioridad: Prioridad
  fechaEstimada: string; mecanicoId: string
  descripcion: string; notasInternas: string
}

type Errors = Partial<Record<string, boolean>>

const EMPTY_CLIENTE: NuevoClienteForm = {
  nombre: "", apellido: "", rut: "", telefono: "", email: "",
}

const EMPTY_BICI: NuevaBiciForm = {
  marca: "", modelo: "", tipo: "MTB", color: "", numSerie: "", anio: "",
}

const EMPTY_OT: OTForm = {
  servicioIds: [], prioridad: "media",
  fechaEstimada: "", mecanicoId: "--",
  descripcion: "", notasInternas: "",
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

export function useNuevaOT({
  nextId,
  onClose,
  onCreate,
  prefillCliente,
}: {
  nextId: string
  onClose: () => void
  onCreate: (orden: OrdenTrabajo) => void
  prefillCliente?: ClienteResult
}) {
  // Cliente search
  const [clienteQuery, setClienteQuery] = useState(prefillCliente?.nombre ?? "")
  const [allClientes, setAllClientes] = useState<ClienteResult[]>([])
  const [clienteLoading, setClienteLoading] = useState(false)
  const [clienteMode, setClienteMode] = useState<"search" | "new">("search")
  const [selectedCliente, setSelectedCliente] = useState<ClienteResult | null>(prefillCliente ?? null)
  const [newClienteForm, setNewClienteForm] = useState<NuevoClienteForm>(EMPTY_CLIENTE)
  const clientesLoadedRef = useRef(false)

  // Bicicleta
  const [bicicletas, setBicicletas] = useState<BicicletaResult[]>(prefillCliente?.bicicletas ?? [])
  const [biciMode, setBiciMode] = useState<"select" | "new">(prefillCliente?.bicicletas.length ? "select" : "new")
  const [selectedBicicleta, setSelectedBicicleta] = useState<BicicletaResult | null>(prefillCliente?.bicicletas[0] ?? null)
  const [newBiciForm, setNewBiciForm] = useState<NuevaBiciForm>(EMPTY_BICI)

  // Servicios
  const [servicios, setServicios] = useState<Servicio[]>([])
  const [serviciosLoading, setServiciosLoading] = useState(false)
  const serviciosLoadedRef = useRef(false)

  // OT
  const [otForm, setOTForm] = useState<OTForm>(EMPTY_OT)

  // Submit state
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

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
      const res = await clientesNuevaOTService.getClientesConBicicletas()
      setAllClientes(res.clientes)
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

  // ─── Handlers ────────────────────────────────────────────────────────────────

  const selectCliente = useCallback((cliente: ClienteResult) => {
    setSelectedCliente(cliente)
    setClienteQuery(cliente.nombre)
    if (cliente.bicicletas.length > 0) {
      setBicicletas(cliente.bicicletas)
      setBiciMode("select")
      setSelectedBicicleta(cliente.bicicletas[0])
    } else {
      setBicicletas([])
      setBiciMode("new")
      setSelectedBicicleta(null)
    }
  }, [])

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

  const setBiciField = useCallback(<K extends keyof NuevaBiciForm>(key: K, val: NuevaBiciForm[K]) => {
    setNewBiciForm(prev => ({ ...prev, [key]: val }))
    setErrors(prev => ({ ...prev, [`bici_${key}`]: false }))
  }, [])

  const setOTField = useCallback(<K extends keyof OTForm>(key: K, val: OTForm[K]) => {
    setOTForm(prev => ({ ...prev, [key]: val }))
    setErrors(prev => ({ ...prev, [key]: false }))
  }, [])

  const addServicio = useCallback((id: string) => {
    setOTForm(prev => {
      if (prev.servicioIds.includes(id)) return prev
      return { ...prev, servicioIds: [...prev.servicioIds, id] }
    })
    setErrors(prev => ({ ...prev, servicioIds: false }))
  }, [])

  const removeServicio = useCallback((id: string) => {
    setOTForm(prev => ({ ...prev, servicioIds: prev.servicioIds.filter(s => s !== id) }))
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
      const required: (keyof NuevaBiciForm)[] = ["marca", "modelo", "tipo", "color"]
      for (const k of required) {
        if (!newBiciForm[k].trim()) { next[`bici_${k}`] = true; valid = false }
      }
    } else if (!selectedBicicleta) {
      next["bicicleta"] = true; valid = false
    }

    if (otForm.servicioIds.length === 0) { next["servicioIds"] = true; valid = false }
    if (!otForm.fechaEstimada.trim()) { next["fechaEstimada"] = true; valid = false }
    if (!otForm.descripcion.trim()) { next["descripcion"] = true; valid = false }

    setErrors(next)
    return valid
  }, [biciMode, clienteMode, newBiciForm, newClienteForm, otForm, selectedBicicleta, selectedCliente])

  // ─── Submit ───────────────────────────────────────────────────────────────────

  const submit = useCallback(async () => {
    if (!validate()) return
    setSubmitting(true)
    setSubmitError(null)

    try {
      let clienteId: string
      if (clienteMode === "new") {
        const created = await httpClient.post<ClienteResult>("clientes", newClienteForm)
        clienteId = created.id
      } else {
        clienteId = selectedCliente!.id
      }

      let bicicletaId: string
      if (biciMode === "new") {
        const biciPayload = {
          clienteId,
          marca: newBiciForm.marca,
          modelo: newBiciForm.modelo,
          tipo: newBiciForm.tipo,
          color: newBiciForm.color,
          numSerie: newBiciForm.numSerie || undefined,
          anio: newBiciForm.anio ? parseInt(newBiciForm.anio) : undefined,
        }
        const created = await httpClient.post<BicicletaResult>("bicicletas", biciPayload)
        bicicletaId = created.id
      } else {
        bicicletaId = selectedBicicleta!.id
      }

      const payload: NuevaOTApiPayload = {
        clienteId,
        bicicletaId,
        servicioIds: otForm.servicioIds,
        prioridad: otForm.prioridad,
        fechaEstimada: otForm.fechaEstimada,
        mecanicoId: otForm.mecanicoId,
        descripcion: otForm.descripcion,
        notasInternas: otForm.notasInternas || undefined,
      }
      await httpClient.post("ordenes", payload)

      const now = new Date()
      const fechaIngreso =
        now.toLocaleDateString("es-CL", { day: "numeric", month: "short" }) +
        " · " +
        now.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })

      const clienteDisplay = clienteMode === "new"
        ? `${newClienteForm.nombre} ${newClienteForm.apellido}`
        : selectedCliente!.nombre

      const biciDisplay = biciMode === "new" ? newBiciForm : {
        marca: selectedBicicleta!.marca,
        modelo: selectedBicicleta!.modelo,
        tipo: selectedBicicleta!.tipo,
        color: selectedBicicleta!.color,
        numSerie: selectedBicicleta!.numSerie,
      }

      onCreate({
        id: nextId,
        tipo: { id: "", codigo: "mantencion", nombre: "Mantención" },
        servicioIds: otForm.servicioIds,
        estado: "recibido",
        prioridad: otForm.prioridad,
        fechaIngreso,
        fechaEstimada: otForm.fechaEstimada,
        mecanicoId: otForm.mecanicoId,
        clienteNombre: clienteDisplay,
        biciMarca: biciMode === "new"
          ? `${newBiciForm.marca} ${newBiciForm.modelo}`
          : `${selectedBicicleta!.marca} ${selectedBicicleta!.modelo}`,
        biciTipo: biciDisplay.tipo,
        biciTalla: "",
        biciColor: biciDisplay.color,
        biciNumSerie: biciDisplay.numSerie || undefined,
        descripcion: otForm.descripcion,
        notasInternas: otForm.notasInternas || undefined,
      })

      onClose()
    } catch (err: unknown) {
      setSubmitError(getApiErrorMessage(err) ?? "Error al crear la orden. Intenta nuevamente.")
    } finally {
      setSubmitting(false)
    }
  }, [clienteMode, biciMode, newClienteForm, newBiciForm, otForm, selectedCliente, selectedBicicleta, nextId, onClose, onCreate, validate])

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
    bicicletas,
    biciMode, setBiciMode,
    selectedBicicleta, setSelectedBicicleta,
    newBiciForm,
    setBiciField,
    // Servicios
    servicios, serviciosLoading,
    addServicio, removeServicio,
    loadServicios,
    // OT
    otForm, setOTField,
    // Submit
    errors, submitting, submitError,
    submit,
  }
}

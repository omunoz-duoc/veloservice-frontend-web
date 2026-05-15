"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { httpClient } from "@/lib/api/http-client"
import {
  type TipoOT, type Prioridad, type OrdenTrabajo,
  type ClienteResult, type BicicletaResult, type NuevaOTApiPayload,
} from "../components/ordenes/ordenes.mock"

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
  tipo: TipoOT; prioridad: Prioridad
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
  tipo: "mantencion", prioridad: "media",
  fechaEstimada: "", mecanicoId: "--",
  descripcion: "", notasInternas: "",
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

export function useNuevaOT({
  nextId,
  onClose,
  onCreate,
}: {
  nextId: string
  onClose: () => void
  onCreate: (orden: OrdenTrabajo) => void
}) {
  // Cliente search
  const [clienteQuery, setClienteQuery] = useState("")
  const [clientes, setClientes] = useState<ClienteResult[]>([])
  const [clienteLoading, setClienteLoading] = useState(false)
  const [clienteMode, setClienteMode] = useState<"search" | "new">("search")
  const [selectedCliente, setSelectedCliente] = useState<ClienteResult | null>(null)
  const [newClienteForm, setNewClienteForm] = useState<NuevoClienteForm>(EMPTY_CLIENTE)

  // Bicicleta
  const [bicicletas, setBicicletas] = useState<BicicletaResult[]>([])
  const [biciLoading, setBiciLoading] = useState(false)
  const [biciMode, setBiciMode] = useState<"select" | "new">("select")
  const [selectedBicicleta, setSelectedBicicleta] = useState<BicicletaResult | null>(null)
  const [newBiciForm, setNewBiciForm] = useState<NuevaBiciForm>(EMPTY_BICI)

  // OT
  const [otForm, setOTForm] = useState<OTForm>(EMPTY_OT)

  // Submit state
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ─── Client search (debounced) ───────────────────────────────────────────────

  useEffect(() => {
    if (clienteMode !== "search") return
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!clienteQuery.trim()) {
      setClientes([])
      return
    }

    debounceRef.current = setTimeout(async () => {
      setClienteLoading(true)
      try {
        const results = await httpClient.get<ClienteResult[]>(`clientes?search=${encodeURIComponent(clienteQuery)}`)
        setClientes(results.slice(0, 8))
      } catch {
        setClientes([])
      } finally {
        setClienteLoading(false)
      }
    }, 300)
  }, [clienteQuery, clienteMode])

  // ─── Bike fetch ──────────────────────────────────────────────────────────────

  const fetchBicicletas = useCallback(async (clienteId: string) => {
    setBiciLoading(true)
    setBicicletas([])
    setSelectedBicicleta(null)
    try {
      const results = await httpClient.get<BicicletaResult[]>(`bicicletas?clienteId=${clienteId}`)
      setBicicletas(results)
      if (results.length === 0) {
        setBiciMode("new")
      } else {
        setBiciMode("select")
        setSelectedBicicleta(results[0])
      }
    } catch {
      setBiciMode("new")
    } finally {
      setBiciLoading(false)
    }
  }, [])

  // ─── Handlers ────────────────────────────────────────────────────────────────

  const selectCliente = useCallback((cliente: ClienteResult) => {
    setSelectedCliente(cliente)
    setClienteQuery(`${cliente.nombre} ${cliente.apellido}`)
    setClientes([])
    fetchBicicletas(cliente.id)
  }, [fetchBicicletas])

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
    setBiciMode("select")
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

  // ─── Validation ──────────────────────────────────────────────────────────────

  const validate = (): boolean => {
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

    if (!otForm.fechaEstimada.trim()) { next["fechaEstimada"] = true; valid = false }
    if (!otForm.descripcion.trim()) { next["descripcion"] = true; valid = false }

    setErrors(next)
    return valid
  }

  // ─── Submit ───────────────────────────────────────────────────────────────────

  const submit = async () => {
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
        tipo: otForm.tipo,
        prioridad: otForm.prioridad,
        fechaEstimada: otForm.fechaEstimada,
        mecanicoId: otForm.mecanicoId,
        descripcion: otForm.descripcion,
        notasInternas: otForm.notasInternas || undefined,
      }
      await httpClient.post("ordenes", payload)

      // Build local OrdenTrabajo for optimistic display
      const now = new Date()
      const fechaIngreso =
        now.toLocaleDateString("es-CL", { day: "numeric", month: "short" }) +
        " · " +
        now.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })

      const biciDisplay = biciMode === "new" ? newBiciForm : {
        marca: `${selectedBicicleta!.marca} ${selectedBicicleta!.modelo}`,
        modelo: selectedBicicleta!.modelo,
        tipo: selectedBicicleta!.tipo,
        color: selectedBicicleta!.color,
        numSerie: selectedBicicleta!.numSerie,
      }

      const clienteDisplay = clienteMode === "new"
        ? `${newClienteForm.nombre} ${newClienteForm.apellido}`
        : `${selectedCliente!.nombre} ${selectedCliente!.apellido}`

      onCreate({
        id: nextId,
        tipo: otForm.tipo,
        estado: "recibido",
        prioridad: otForm.prioridad,
        fechaIngreso,
        fechaEstimada: otForm.fechaEstimada,
        mecanicoId: otForm.mecanicoId,
        clienteNombre: clienteDisplay,
        biciMarca: biciMode === "new" ? `${newBiciForm.marca} ${newBiciForm.modelo}` : `${selectedBicicleta!.marca} ${selectedBicicleta!.modelo}`,
        biciTipo: biciDisplay.tipo,
        biciTalla: "",
        biciColor: biciDisplay.color,
        biciNumSerie: biciDisplay.numSerie || undefined,
        descripcion: otForm.descripcion,
        notasInternas: otForm.notasInternas || undefined,
      })

      onClose()
    } catch (err: unknown) {
      const body = (err as { body?: { message?: string } })?.body
      setSubmitError(body?.message ?? "Error al crear la orden. Intenta nuevamente.")
    } finally {
      setSubmitting(false)
    }
  }

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
    // Bicicleta
    bicicletas, biciLoading,
    biciMode, setBiciMode,
    selectedBicicleta, setSelectedBicicleta,
    newBiciForm,
    setBiciField,
    // OT
    otForm, setOTField,
    // Submit
    errors, submitting, submitError,
    submit,
  }
}

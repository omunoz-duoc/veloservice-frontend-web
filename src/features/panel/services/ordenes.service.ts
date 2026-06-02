import { httpClient } from "@/lib/api/http-client"
import type {
  BulkUpdateOrdenPayload,
  CreateOrdenPayload,
  IOrdenesService,
  OrdenTrabajoDetalle,
  OrdenesListResponse,
  OrdenesMetricas,
  UpdateOrdenPayload,
} from "../types/ordenes.types"
import type {
  EstadoOT as FrontendEstadoOT,
  OrdenTrabajo,
  Prioridad as FrontendPrioridad,
  TipoOT,
} from "../components/ordenes/ordenes.types"

type CatalogValue = { id: string; codigo: string; nombre: string }

type BackendOrdenTrabajo = {
  id?: string
  numeroOrden: string
  tipo: string | CatalogValue
  fechaIngreso: string
  fechaPrometida?: string | null
  fechaEntrega?: string | null
  mecanico: string | { id: string; nombre: string; apellido: string } | null
  cliente: string | {
    id: string
    nombre: string
    apellido: string
    telefono: string | null
    email: string | null
    rut: string | null
  }
  bicicleta: {
    id?: string
    marca: string
    modelo: string
    tipo: string | null
    aro?: string | null
    color: string | null
    numeroSerie?: string | null
  }
  diagnosticoInicial: string | null
  diagnosticoFinal?: string | null
  observacionesCliente?: string | null
  estado: string | CatalogValue
  prioridad?: string
}

type BackendOrdenesListResponse = {
  total: number
  ordenes: BackendOrdenTrabajo[]
}

const ESTADO_MAP: Record<string, FrontendEstadoOT> = {
  pendiente: "recibido",
  recibido: "recibido",
  en_diagnostico: "proceso",
  en_reparacion: "proceso",
  en_proceso: "proceso",
  proceso: "proceso",
  esperando_repuesto: "espera",
  espera_repuesto: "espera",
  en_espera: "espera",
  espera: "espera",
  listo: "listo",
  entregado: "entregado",
}

const TIPO_MAP: Record<string, TipoOT> = {
  personalizacion: "personalizacion",
  personalizado: "personalizacion",
  mantencion: "mantencion",
  mantenimiento: "mantencion",
  reparacion: "reparacion",
  revision: "revision",
  diagnostico: "revision",
  garantia: "garantia",
  armado: "armado",
}

export const ESTADO_TO_API_MAP: Record<FrontendEstadoOT, string> = {
  recibido: "Recibido",
  proceso: "En Proceso",
  espera: "espera_repuesto",
  listo: "Listo",
  entregado: "Entregado",
}

const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

function normalizeCode(value: string | null | undefined): string {
  return (value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
}

function catalogCode(value: BackendOrdenTrabajo["tipo"] | BackendOrdenTrabajo["estado"]): string {
  return typeof value === "string" ? value : value.codigo || value.nombre
}

function catalogName(value: BackendOrdenTrabajo["tipo"] | BackendOrdenTrabajo["estado"]): string {
  return typeof value === "string" ? value : value.nombre || value.codigo
}

function normalizeTipo(value: BackendOrdenTrabajo["tipo"]): { id: string; codigo: TipoOT | string; nombre: string } {
  const code = normalizeCode(catalogCode(value))
  return {
    id: typeof value === "string" ? "" : value.id,
    codigo: TIPO_MAP[code] ?? code,
    nombre: catalogName(value),
  }
}

function clienteName(cliente: BackendOrdenTrabajo["cliente"]): string {
  if (typeof cliente === "string") return cliente
  return [cliente.nombre, cliente.apellido].filter(Boolean).join(" ").trim()
}

function mecanicoName(mecanico: BackendOrdenTrabajo["mecanico"]): string {
  if (!mecanico) return "--"
  if (typeof mecanico === "string") return mecanico
  return [mecanico.nombre, mecanico.apellido].filter(Boolean).join(" ").trim() || "--"
}

function formatListDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  const day = date.getUTCDate().toString().padStart(2, "0")
  const month = MONTHS[date.getUTCMonth()]
  const hh = date.getUTCHours().toString().padStart(2, "0")
  const mm = date.getUTCMinutes().toString().padStart(2, "0")
  return `${day} ${month} · ${hh}:${mm}`
}

function formatDueDate(value: string | null | undefined): string {
  if (!value) return ""
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  const day = date.getUTCDate().toString().padStart(2, "0")
  const month = MONTHS[date.getUTCMonth()]
  return `${day} ${month}`
}

function normalizeDetalle(orden: OrdenTrabajoDetalle): OrdenTrabajoDetalle {
  const nullableOrden = orden as OrdenTrabajoDetalle & {
    diagnosticoInicial: string | null
    observacionesCliente: string | null
    mecanico: OrdenTrabajoDetalle["mecanico"] | null
    comentarios?: OrdenTrabajoDetalle["comentarios"]
    multimedia?: OrdenTrabajoDetalle["multimedia"]
    productos?: OrdenTrabajoDetalle["productos"]
    servicios?: OrdenTrabajoDetalle["servicios"]
  }

  return {
    ...nullableOrden,
    diagnosticoInicial: nullableOrden.diagnosticoInicial ?? "Sin descripcion",
    observacionesCliente: nullableOrden.observacionesCliente ?? "Sin observaciones",
    mecanico: nullableOrden.mecanico ?? { id: "--", nombre: "Sin", apellido: "asignar" },
    bicicleta: {
      ...nullableOrden.bicicleta,
      tipo: nullableOrden.bicicleta.tipo ?? "Otro",
      color: nullableOrden.bicicleta.color ?? "-",
      numeroSerie: nullableOrden.bicicleta.numeroSerie ?? "",
    },
    cliente: {
      ...nullableOrden.cliente,
      telefono: nullableOrden.cliente.telefono ?? "",
      email: nullableOrden.cliente.email ?? "",
      rut: nullableOrden.cliente.rut ?? "",
    },
    comentarios: nullableOrden.comentarios ?? [],
    multimedia: nullableOrden.multimedia ?? [],
    productos: nullableOrden.productos ?? [],
    servicios: nullableOrden.servicios ?? [],
  }
}

export function mapApiOrden(orden: BackendOrdenTrabajo, idx: number): OrdenTrabajo {
  const tipo = normalizeTipo(orden.tipo)
  const estado = ESTADO_MAP[normalizeCode(catalogCode(orden.estado))] ?? "recibido"
  const bicicletaNombre = `${orden.bicicleta.marca ?? ""} ${orden.bicicleta.modelo ?? ""}`.trim()

  return {
    id: orden.numeroOrden ?? `OT-${String(idx + 1).padStart(4, "0")}`,
    backendId: orden.id,
    tipo,
    estado,
    prioridad: (orden.prioridad?.toLowerCase() as FrontendPrioridad) ?? "media",
    fechaIngreso: formatListDate(orden.fechaIngreso),
    fechaEstimada: formatDueDate(orden.fechaPrometida),
    mecanicoId: mecanicoName(orden.mecanico),
    clienteNombre: clienteName(orden.cliente),
    clienteTelefono: typeof orden.cliente === "string" ? undefined : orden.cliente.telefono ?? undefined,
    clienteEmail: typeof orden.cliente === "string" ? undefined : orden.cliente.email ?? undefined,
    biciMarca: bicicletaNombre || "Bicicleta sin identificar",
    biciTipo: orden.bicicleta.tipo ?? "Otro",
    biciTalla: orden.bicicleta.aro ?? undefined,
    biciColor: orden.bicicleta.color ?? "-",
    biciNumSerie: orden.bicicleta.numeroSerie ?? undefined,
    descripcion: orden.diagnosticoInicial ?? orden.observacionesCliente ?? orden.diagnosticoFinal ?? "Sin descripcion",
  }
}

export const ordenesService: IOrdenesService = {
  async getOrdenes() {
    return httpClient.get<BackendOrdenesListResponse>("ordenes") as Promise<OrdenesListResponse>
  },

  async getOrdenesUrgentes() {
    return httpClient.get<OrdenesListResponse>("ordenes/urgentes")
  },

  async getOrdenesMetricas() {
    return httpClient.get<OrdenesMetricas>("ordenes/metricas")
  },

  async getOrdenById(id: string) {
    const orden = await httpClient.get<OrdenTrabajoDetalle>(`ordenes/${id}`)
    return normalizeDetalle(orden)
  },

  async createOrden(payload: CreateOrdenPayload) {
    return httpClient.post("ordenes", payload)
  },

  async updateOrden(id: string, payload: UpdateOrdenPayload) {
    return httpClient.put<BackendOrdenTrabajo>(`ordenes/${id}`, payload) as Promise<OrdenesListResponse["ordenes"][number]>
  },

  async bulkUpdateOrdenes(payload: BulkUpdateOrdenPayload) {
    return httpClient.patch<void>("ordenes/bulk", payload)
  },

  async deleteOrden(id: string) {
    return httpClient.delete(`ordenes/${id}`)
  },
}

import { httpClient } from "@/lib/api/http-client"
import type {
  EstadoOT,
  OrdenTrabajo,
  Prioridad,
  TipoOT,
} from "@/features/panel/components/ordenes/ordenes.mock"

type CatalogValue = {
  id: string
  codigo: string
  nombre: string
}

export type OrdenReadResponse = {
  id: string
  numeroOrden: string
  tallerId: string
  sucursalId: string
  estado: CatalogValue
  tipo: CatalogValue
  fechaIngreso: string
  fechaPrometida: string | null
  fechaEntrega: string | null
  diagnosticoInicial: string | null
  diagnosticoFinal: string | null
  observacionesCliente: string | null
  bicicleta: {
    id: string
    marca: string
    modelo: string
    tipo: string | null
    aro: string | null
    color: string | null
    numeroSerie: string | null
  }
  cliente: {
    id: string
    nombre: string
    apellido: string
    telefono: string | null
    email: string | null
    rut: string | null
  }
  mecanico: {
    id: string
    nombre: string
    apellido: string
  } | null
}

export type OrdenReadListResponse = {
  total: number
  ordenes: OrdenReadResponse[]
}

const ESTADO_MAP: Record<string, EstadoOT> = {
  recibido: "recibido",
  recepcionada: "recibido",
  ingresada: "recibido",
  proceso: "proceso",
  en_proceso: "proceso",
  enproceso: "proceso",
  espera: "espera",
  espera_repuesto: "espera",
  esperando_repuesto: "espera",
  listo: "listo",
  lista: "listo",
  entregado: "entregado",
  entregada: "entregado",
}

const TIPO_MAP: Record<string, TipoOT> = {
  diagnostico: "diagnostico",
  mantencion: "mantencion",
  mantenimiento: "mantencion",
  reparacion: "reparacion",
  overhaul: "overhaul",
  garantia: "garantia",
  armado: "armado",
}

function normalizeCode(value: string | null | undefined): string {
  return (value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
}

function formatShortDate(value: string | null): string {
  if (!value) return "-"

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  const dayMonth = new Intl.DateTimeFormat("es-CL", {
    day: "numeric",
    month: "short",
  })
    .format(date)
    .replace(".", "")

  const time = new Intl.DateTimeFormat("es-CL", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)

  return `${dayMonth} · ${time}`
}

function formatDueDate(value: string | null): string {
  if (!value) return "-"

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat("es-CL", {
    day: "numeric",
    month: "short",
  })
    .format(date)
    .replace(".", "")
}

function fullName(nombre: string, apellido: string): string {
  return [nombre, apellido].filter(Boolean).join(" ").trim()
}

function mapEstado(codigo: string): EstadoOT {
  return ESTADO_MAP[normalizeCode(codigo)] ?? "recibido"
}

function mapTipo(codigo: string): TipoOT {
  return TIPO_MAP[normalizeCode(codigo)] ?? "diagnostico"
}

export function mapOrdenReadToOrdenTrabajo(orden: OrdenReadResponse): OrdenTrabajo {
  const bicicletaNombre = [orden.bicicleta.marca, orden.bicicleta.modelo]
    .filter(Boolean)
    .join(" ")
    .trim()

  return {
    id: orden.numeroOrden || orden.id,
    backendId: orden.id,
    tipo: mapTipo(orden.tipo.codigo || orden.tipo.nombre),
    estado: mapEstado(orden.estado.codigo || orden.estado.nombre),
    prioridad: "media" satisfies Prioridad,
    fechaIngreso: formatShortDate(orden.fechaIngreso),
    fechaEstimada: formatDueDate(orden.fechaPrometida),
    mecanicoId: orden.mecanico?.id ?? "--",
    clienteNombre: fullName(orden.cliente.nombre, orden.cliente.apellido),
    clienteTelefono: orden.cliente.telefono ?? undefined,
    clienteEmail: orden.cliente.email ?? undefined,
    biciMarca: bicicletaNombre || orden.bicicleta.marca || "Bicicleta sin identificar",
    biciTipo: orden.bicicleta.tipo ?? "Otro",
    biciTalla: orden.bicicleta.aro ?? "-",
    biciColor: orden.bicicleta.color ?? "-",
    biciNumSerie: orden.bicicleta.numeroSerie ?? undefined,
    descripcion:
      orden.diagnosticoInicial ??
      orden.observacionesCliente ??
      orden.diagnosticoFinal ??
      "Sin descripcion",
    notasInternas: orden.diagnosticoFinal ?? undefined,
  }
}

export const ordenesService = {
  async list(): Promise<OrdenTrabajo[]> {
    const response = await httpClient.get<OrdenReadListResponse>("ordenes")
    return response.ordenes.map(mapOrdenReadToOrdenTrabajo)
  },
}

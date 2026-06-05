import { httpClient } from "@/lib/api/http-client"
import type { IMecanicosService, MecanicosListResponse, CambiarEstadoPayload, CambiarRolPayload, Mecanico } from "../types/mecanicos.types"

type BackendMecanico = {
  id: string
  nombre: string
  apellido: string
  email?: string
  rol?: string
}

type BackendMecanicosResponse = BackendMecanico[] | MecanicosListResponse

function initials(nombre: string, apellido: string) {
  return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase() || "?"
}

function normalizeMecanico(mecanico: BackendMecanico | Mecanico): Mecanico {
  const existing = mecanico as Partial<Mecanico>
  return {
    id: mecanico.id,
    nombre: mecanico.nombre,
    apellido: mecanico.apellido,
    iniciales: existing.iniciales ?? initials(mecanico.nombre, mecanico.apellido),
    color: existing.color ?? "#6b5bd1",
    especialidad: existing.especialidad ?? "Mecanico",
    bahia: existing.bahia ?? "",
    horas: existing.horas ?? "",
    estado: existing.estado ?? "activo",
    ordenesCursando: existing.ordenesCursando ?? [],
    capacidad: existing.capacidad ?? 1,
  }
}

function normalizeResponse(response: BackendMecanicosResponse): MecanicosListResponse {
  const mecanicos = Array.isArray(response) ? response : response.mecanicos
  const normalized = mecanicos.map(normalizeMecanico)
  return {
    total: Array.isArray(response) ? normalized.length : response.total ?? normalized.length,
    mecanicos: normalized,
  }
}

export const mecanicosService: IMecanicosService = {
  async getMecanicosActivos() {
    const response = await httpClient.get<BackendMecanicosResponse>("mecanicos/activos")
    return normalizeResponse(response)
  },
  async cambiarEstado(id: string, payload: CambiarEstadoPayload) {
    return httpClient.put(`mecanicos/${id}`, payload)
  },
  async cambiarRol(id: string, payload: CambiarRolPayload) {
    return httpClient.put(`mecanicos/${id}`, payload)
  },
}

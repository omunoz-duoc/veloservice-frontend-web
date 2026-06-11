import { httpClient } from "@/lib/api/http-client"
import type { IServiciosService, ServiciosListResponse, CreateServicioPayload } from "../types/servicios.types"

type ServicioApiPayload = {
  nombre: string
  descripcion: string
  precioBase: number
  activo: boolean
}

function toApiPayload(payload: CreateServicioPayload): ServicioApiPayload {
  return {
    nombre: payload.nombre,
    descripcion: payload.descripcion ?? payload.desc ?? "",
    precioBase: payload.precioBase ?? payload.precio ?? 0,
    activo: payload.activo ?? true,
  }
}

export const serviciosService: IServiciosService = {
  async getServicios() {
    return httpClient.get<ServiciosListResponse>("servicios")
  },
  async createServicio(payload: CreateServicioPayload) {
    return httpClient.post("servicios", toApiPayload(payload))
  },
  async updateServicio(id: string, payload: CreateServicioPayload) {
    return httpClient.put(`servicios/${encodeURIComponent(id)}`, toApiPayload(payload))
  },
}

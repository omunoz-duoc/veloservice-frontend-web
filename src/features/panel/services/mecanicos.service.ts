import { httpClient } from "@/lib/api/http-client"
import type { IMecanicosService, MecanicosListResponse, CambiarEstadoPayload, CambiarRolPayload } from "../types/mecanicos.types"

export const mecanicosService: IMecanicosService = {
  async getMecanicosActivos() {
    return httpClient.get<MecanicosListResponse>("mecanicos/activos")
  },
  async cambiarEstado(id: string, payload: CambiarEstadoPayload) {
    return httpClient.put(`mecanicos/${id}`, payload)
  },
  async cambiarRol(id: string, payload: CambiarRolPayload) {
    return httpClient.put(`mecanicos/${id}`, payload)
  },
}

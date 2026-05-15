import { httpClient } from "@/lib/api/http-client"
import type { IServiciosService, ServiciosListResponse, CreateServicioPayload } from "../types/servicios.types"

export const serviciosService: IServiciosService = {
  async getServicios() {
    return httpClient.get<ServiciosListResponse>("servicios")
  },
  async createServicio(payload: CreateServicioPayload) {
    return httpClient.post("servicios", payload)
  },
}

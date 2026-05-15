import type { IServiciosService, ServiciosListResponse, CreateServicioPayload } from "../types/servicios.types"
import serviciosData from "./servicios.mock.data.json"

async function mockFetch<T>(data: T, delayMs = 250): Promise<T> {
  await new Promise(r => setTimeout(r, delayMs))
  return data
}

export const serviciosMock: IServiciosService = {
  async getServicios() {
    return mockFetch(serviciosData as ServiciosListResponse)
  },
  async createServicio(_payload: CreateServicioPayload) {
    return mockFetch(undefined as void)
  },
}

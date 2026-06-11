import type { IServiciosService, ServiciosListResponse, CreateServicioPayload } from "../types/servicios.types"
import serviciosData from "./servicios.mock.data.json"

let servicios = [...(serviciosData.servicios as ServiciosListResponse["servicios"])]

async function mockFetch<T>(data: T, delayMs = 250): Promise<T> {
  await new Promise(r => setTimeout(r, delayMs))
  return data
}

export const serviciosMock: IServiciosService = {
  async getServicios() {
    return mockFetch({ total: servicios.length, servicios } as ServiciosListResponse)
  },
  async createServicio(payload: CreateServicioPayload) {
    const id = (payload as CreateServicioPayload & { id?: string }).id
    servicios = [
      ...servicios,
      {
        id: id ?? `SV-${String(servicios.length + 101).padStart(3, "0")}`,
        ots30: 0,
        ...payload,
      },
    ]
    return mockFetch(undefined as void)
  },
  async updateServicio(id: string, payload: CreateServicioPayload) {
    servicios = servicios.map(servicio => servicio.id === id
      ? { ...servicio, ...payload }
      : servicio)
    return mockFetch(undefined as void)
  },
}

import type { IMecanicosService, MecanicosListResponse, CambiarEstadoPayload, CambiarRolPayload } from "../types/mecanicos.types"
import mecanicosData from "./mecanicos.mock.data.json"

async function mockFetch<T>(data: T, delayMs = 250): Promise<T> {
  await new Promise(r => setTimeout(r, delayMs))
  return data
}

export const mecanicosMock: IMecanicosService = {
  async getMecanicosActivos() {
    return mockFetch(mecanicosData as MecanicosListResponse)
  },
  async cambiarEstado(_id: string, _payload: CambiarEstadoPayload) {
    return mockFetch(undefined as void)
  },
  async cambiarRol(_id: string, _payload: CambiarRolPayload) {
    return mockFetch(undefined as void)
  },
}

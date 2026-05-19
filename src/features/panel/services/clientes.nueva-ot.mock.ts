import type { ClienteNuevaOTResponse } from "../components/ordenes/ordenes.mock"
import data from "./clientes.nueva-ot.mock.data.json"

export interface IClientesNuevaOTService {
  getClientesConBicicletas(): Promise<ClienteNuevaOTResponse>
}

async function mockFetch<T>(d: T, ms = 350): Promise<T> {
  await new Promise(r => setTimeout(r, ms))
  return d
}

export const clientesNuevaOTMock: IClientesNuevaOTService = {
  async getClientesConBicicletas() {
    return mockFetch(data as ClienteNuevaOTResponse)
  },
}

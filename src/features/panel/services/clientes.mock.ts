import type {
  IClientesService,
  ClientesListResponse,
  CreateClientePayload,
} from "../types/clientes.types"
import clientesData from "./clientes.mock.data.json"

async function mockFetch<T>(data: T, delayMs = 250): Promise<T> {
  await new Promise((r) => setTimeout(r, delayMs))
  return data
}

export const clientesMock: IClientesService = {
  async getClientes() {
    return mockFetch(clientesData as ClientesListResponse)
  },
  async createCliente(_payload: CreateClientePayload) {
    return mockFetch(undefined as void)
  },
}

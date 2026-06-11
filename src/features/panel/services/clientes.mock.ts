import type {
  IClientesService,
  ClientesListResponse,
  CreateClientePayload,
} from "../types/clientes.types"
import clientesData from "./clientes.mock.data.json"

let clientes = [...(clientesData.clientes as ClientesListResponse["clientes"])]

async function mockFetch<T>(data: T, delayMs = 250): Promise<T> {
  await new Promise((r) => setTimeout(r, delayMs))
  return data
}

export const clientesMock: IClientesService = {
  async getClientes() {
    return mockFetch({ total: clientes.length, clientes } as ClientesListResponse)
  },
  async createCliente(payload: CreateClientePayload) {
    clientes = [
      {
        id: `CL-${String(clientes.length + 1).padStart(4, "0")}`,
        tipo: "nuevo",
        bicicletasCount: 0,
        ordenesCount: 0,
        totalGastado: 0,
        ciudad: "",
        fechaReg: "",
        ultimaVisita: "",
        canal: "Email",
        notas: "",
        consentEmail: false,
        consentWhatsApp: false,
        consentMarketing: false,
        ...payload,
      },
      ...clientes,
    ]
    return mockFetch(undefined as void)
  },
  async updateCliente(id: string, payload: CreateClientePayload) {
    clientes = clientes.map(cliente => cliente.id === id || cliente.backendId === id
      ? { ...cliente, ...payload }
      : cliente)
    return mockFetch(undefined as void)
  },
}

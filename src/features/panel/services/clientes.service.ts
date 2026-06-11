import { httpClient } from "@/lib/api/http-client"
import type {
  IClientesService,
  ClientesListResponse,
  CreateClientePayload,
} from "../types/clientes.types"

type ClienteListItem = {
  id: string
  nombre: string
  rut: string
}

function normalizeRut(rut: string | undefined) {
  return (rut ?? "").replace(/[.\-\s]/g, "").toLowerCase()
}

export const clientesService: IClientesService = {
  async getClientes() {
    const [clientesRes, listaClientes] = await Promise.all([
      httpClient.get<ClientesListResponse>("clientes"),
      httpClient.get<ClienteListItem[]>("clientes/lista-clientes").catch(() => []),
    ])

    const backendIdByRut = new Map(
      listaClientes.map(cliente => [normalizeRut(cliente.rut), cliente.id])
    )

    return {
      ...clientesRes,
      clientes: clientesRes.clientes.map(cliente => ({
        ...cliente,
        backendId: cliente.backendId ?? backendIdByRut.get(normalizeRut(cliente.rut)),
      })),
    }
  },
  async createCliente(payload: CreateClientePayload) {
    return httpClient.post("clientes", payload)
  },
  async updateCliente(id: string, payload: CreateClientePayload) {
    return httpClient.patch(`clientes/${encodeURIComponent(id)}`, payload)
  },
}

import { httpClient } from "@/lib/api/http-client"
import type {
  IClientesService,
  ClientesListResponse,
  CreateClientePayload,
} from "../types/clientes.types"

export const clientesService: IClientesService = {
  async getClientes() {
    return httpClient.get<ClientesListResponse>("clientes")
  },
  async createCliente(payload: CreateClientePayload) {
    return httpClient.post("clientes", payload)
  },
}

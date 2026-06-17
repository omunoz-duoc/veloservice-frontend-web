import { useMockServices } from "@/lib/api/service-mode"
import type { IClientesService } from "../types/clientes.types"

async function loadClientesService(): Promise<IClientesService> {
  if (useMockServices) {
    const { clientesMock } = await import("./clientes.mock")
    return clientesMock
  }

  const { clientesService } = await import("./clientes.service")
  return clientesService
}

export const clientesService: IClientesService = {
  async getClientes() {
    return (await loadClientesService()).getClientes()
  },
  async getClienteDetalle(id) {
    return (await loadClientesService()).getClienteDetalle(id)
  },
  async createCliente(payload) {
    return (await loadClientesService()).createCliente(payload)
  },
  async updateCliente(id, payload) {
    return (await loadClientesService()).updateCliente(id, payload)
  },
}

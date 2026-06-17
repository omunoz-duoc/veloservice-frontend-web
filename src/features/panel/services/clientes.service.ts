import { httpClient } from "@/lib/api/http-client"
import { toBicicleta, type ApiBicicleta } from "./bicicletas.service"
import type {
  IClientesService,
  ClientesListResponse,
  ClienteDetalle,
  CreateClientePayload,
} from "../types/clientes.types"

type ClienteListItem = {
  id: string
  nombre: string
  rut: string
}

type ApiClienteDetalle = {
  nombre?: string
  email?: string
  telefono?: string
  direccion?: string
  ["dirección"]?: string
  rut?: string
  clienteDesde?: string
  bicicletasCount?: number
  bicicletas?: ApiBicicleta[]
  otsCount?: number
  lastOts?: {
    numeroOrden?: string
    tipoOrden?: string
    estadoOrden?: string
    fechaIngreso?: string
  }[]
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
  async getClienteDetalle(id: string): Promise<ClienteDetalle> {
    const data = await httpClient.get<ApiClienteDetalle>(`clientes/${encodeURIComponent(id)}`)
    const bicicletas = (data.bicicletas ?? []).map(toBicicleta)

    return {
      nombre: data.nombre ?? "",
      email: data.email ?? "",
      telefono: data.telefono ?? "",
      direccion: data.direccion ?? data["dirección"] ?? "",
      rut: data.rut ?? "",
      clienteDesde: data.clienteDesde ?? "",
      bicicletasCount: data.bicicletasCount ?? bicicletas.length,
      bicicletas,
      otsCount: data.otsCount ?? 0,
      lastOts: (data.lastOts ?? []).map(o => ({
        numeroOrden: o.numeroOrden ?? "",
        tipoOrden: o.tipoOrden ?? "",
        estadoOrden: o.estadoOrden ?? "",
        fechaIngreso: o.fechaIngreso ?? "",
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

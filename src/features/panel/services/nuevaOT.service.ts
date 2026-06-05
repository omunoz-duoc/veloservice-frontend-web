import { httpClient } from "@/lib/api/http-client"
import type {
  ClientesListResponse,
  BicicletasListResponse,
  TiposTrabajoResponse,
  MecanicosListResponse,
  ProductosListResponse,
  CreateOTPayload,
  CreateOTResponse,
} from "../components/ordenes/ordenes.types"
import type { INuevaOTService } from "./nuevaOT.types"

export const nuevaOTService: INuevaOTService = {
  async getClientes() {
    return httpClient.get<ClientesListResponse>("clientes/lista-clientes")
  },
  async getBicicletas(clienteId: string) {
    return httpClient.get<BicicletasListResponse>(`bicicletas?clienteId=${encodeURIComponent(clienteId)}`)
  },
  async getTipos() {
    return httpClient.get<TiposTrabajoResponse>("ordenes/tipos")
  },
  async getMecanicos() {
    return httpClient.get<MecanicosListResponse>("administracion/lista-mecanicos")
  },
  async getProductos() {
    return httpClient.get<ProductosListResponse>("productos/lista-productos")
  },
  async createOrden(payload: CreateOTPayload) {
    return httpClient.post<CreateOTResponse>("ordenes", payload)
  },
}

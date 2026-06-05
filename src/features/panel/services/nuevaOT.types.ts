import type {
  ClientesListResponse,
  BicicletasListResponse,
  TiposTrabajoResponse,
  MecanicosListResponse,
  ProductosListResponse,
  CreateOTPayload,
  CreateOTResponse,
} from "../components/ordenes/ordenes.types"

// Data layer for the Nueva OT modal: client/bici lookups, catalogs, and creation.
export interface INuevaOTService {
  getClientes(): Promise<ClientesListResponse>
  getBicicletas(clienteId: string): Promise<BicicletasListResponse>
  getTipos(): Promise<TiposTrabajoResponse>
  getMecanicos(): Promise<MecanicosListResponse>
  getProductos(): Promise<ProductosListResponse>
  createOrden(payload: CreateOTPayload): Promise<CreateOTResponse>
}

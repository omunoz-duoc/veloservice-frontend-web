import type {
  ClienteResult,
  BicicletaResult,
  TipoTrabajo,
  MecanicoApi,
  ProductoResult,
  CreateOTPayload,
  CreateOTResponse,
} from "../components/ordenes/ordenes.types"
import type { INuevaOTService } from "./nuevaOT.types"
import data from "./nuevaOT.mock.data.json"

type MockData = {
  clientes: ClienteResult[]
  bicicletasByCliente: Record<string, BicicletaResult[]>
  tipos: TipoTrabajo[]
  mecanicos: MecanicoApi[]
  productos: ProductoResult[]
}

const mock = data as MockData

async function mockFetch<T>(d: T, ms = 350): Promise<T> {
  await new Promise(r => setTimeout(r, ms))
  return d
}

let createdCounter = 10

export const nuevaOTMock: INuevaOTService = {
  async getClientes() {
    return mockFetch({ clientes: mock.clientes })
  },
  async getBicicletas(clienteId: string) {
    return mockFetch({ bicicletas: mock.bicicletasByCliente[clienteId] ?? [] })
  },
  async getTipos() {
    return mockFetch({ tipos: mock.tipos }, 150)
  },
  async getMecanicos() {
    return mockFetch({ mecanicos: mock.mecanicos }, 150)
  },
  async getProductos() {
    return mockFetch({ productos: mock.productos })
  },
  async createOrden(_payload: CreateOTPayload): Promise<CreateOTResponse> {
    createdCounter += 1
    return mockFetch({
      id: `mock-${createdCounter}`,
      numeroOrden: `OT-${createdCounter.toString().padStart(5, "0")}`,
    }, 400)
  },
}

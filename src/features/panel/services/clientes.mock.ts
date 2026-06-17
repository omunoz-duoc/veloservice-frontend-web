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
  async getClienteDetalle(id: string) {
    const cliente = clientes.find(c => c.id === id || c.backendId === id)
    const { BICIS_MOCK } = await import("../components/clientes/clientes.mock")
    const bicicletas = BICIS_MOCK[id] ?? BICIS_MOCK[cliente?.id ?? ""] ?? []

    return mockFetch({
      nombre: cliente ? `${cliente.nombre} ${cliente.apellido}` : "",
      email: cliente?.email ?? "",
      telefono: cliente?.telefono ?? "",
      direccion: cliente?.direccion ?? cliente?.ciudad ?? "",
      rut: cliente?.rut ?? "",
      clienteDesde: cliente?.fechaReg ?? "",
      bicicletasCount: bicicletas.length,
      bicicletas,
      otsCount: cliente?.ordenesCount ?? cliente?.ordenes_count ?? 0,
      lastOts: [
        { numeroOrden: "OT-0343", tipoOrden: "Diagnóstico", estadoOrden: "recibido", fechaIngreso: "2026-04-23" },
        { numeroOrden: "OT-0338", tipoOrden: "Mantención", estadoOrden: "entregado", fechaIngreso: "2026-04-12" },
        { numeroOrden: "OT-0319", tipoOrden: "Reparación", estadoOrden: "entregado", fechaIngreso: "2026-03-28" },
      ],
    })
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

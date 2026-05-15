export interface IClientesService {
  getClientes(): Promise<ClientesListResponse>
  createCliente(payload: CreateClientePayload): Promise<void>
}

export type TipoCliente = "nuevo" | "regular" | "frecuente" | "VIP"

export type Cliente = {
  id: string
  nombre: string
  apellido: string
  tipo: TipoCliente
  rut: string
  email: string
  telefono: string
  bicicletasCount: number
  ordenesCount: number
  totalGastado: number
}

export type ClientesListResponse = { total: number; clientes: Cliente[] }

export type CreateClientePayload = {
  nombre: string
  apellido: string
  rut: string
  email: string
  telefono: string
}

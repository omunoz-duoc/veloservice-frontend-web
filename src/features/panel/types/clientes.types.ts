export type TipoCliente = "nuevo" | "regular" | "frecuente" | "VIP"
export type CanalKey = "WhatsApp" | "Email" | "Llamada" | "SMS"
export type IdType = "RUT" | "Pasaporte" | "DNI"

export interface IClientesService {
  getClientes(): Promise<ClientesListResponse>
  createCliente(payload: CreateClientePayload): Promise<void>
}

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
  // Extended UI fields — present in mock, optional for real API
  ciudad?: string
  fechaReg?: string
  ultimaVisita?: string
  canal?: CanalKey
  notas?: string
  consentEmail?: boolean
  consentWhatsApp?: boolean
  consentMarketing?: boolean
}

export type ClientesListResponse = { total: number; clientes: Cliente[] }

export type CreateClientePayload = {
  nombre: string
  apellido: string
  rut: string
  email: string
  telefono: string
}

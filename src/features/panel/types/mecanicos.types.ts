export interface IMecanicosService {
  getMecanicosActivos(): Promise<MecanicosListResponse>
  cambiarEstado(id: string, payload: CambiarEstadoPayload): Promise<void>
  cambiarRol(id: string, payload: CambiarRolPayload): Promise<void>
}

export type Mecanico = {
  id: string
  nombre: string
  apellido: string
  iniciales: string
  color: string
  especialidad: string
  bahia: string
  horas: string
  estado: "activo" | "saturado" | "pausa"
  ordenesCursando: { id: string }[]
  capacidad: number
}

export type MecanicosListResponse = { total: number; mecanicos: Mecanico[] }

export type CambiarEstadoPayload = { estado: string }
export type CambiarRolPayload = { rol: string }

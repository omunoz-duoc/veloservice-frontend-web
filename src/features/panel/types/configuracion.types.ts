export type RolUsuario = "admin" | "mecanico" | "recepcionista"

export interface PerfilNegocio {
  nombre: string
  rut: string
  direccion: string
  telefono: string
  email: string
}

export interface MiPerfil {
  nombre: string
  email: string
}

export interface UsuarioPanel {
  id: string
  nombre: string
  email: string
  rol: RolUsuario
  estado: "activo"
}

export interface NotifConfig {
  otCreada: boolean
  otCompletada: boolean
  otVencida: boolean
  stockBajo: boolean
  nuevoCliente: boolean
}

export interface PlanInfo {
  nombre: string
  precio: number
  renovacion: string
  features: string[]
}

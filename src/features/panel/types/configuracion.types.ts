export type RolUsuario = "admin_taller" | "mecanico" | "recepcionista" | "operador"

export interface PerfilNegocio {
  nombre: string
  rut: string
  direccion: string
  telefono: string
  email: string
  logoUrl?: string | null
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

export interface PlanInfo {
  nombre: string
  precio: number
  renovacion: string
  features: string[]
}

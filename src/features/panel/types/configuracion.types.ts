export type RolUsuario = "admin_taller" | "jefe_taller" | "mecanico" | "recepcionista"

export interface PerfilNegocio {
  nombre: string
  rut: string
  telefono: string
  email: string
  logoUrl: string | null
}

export interface SucursalConfiguracion {
  id: string
  nombre: string
  direccion: string
  telefono: string
  email: string
}

export interface SucursalUsuario {
  id: string
  nombre: string
  esPrincipal: boolean
}

export interface MiPerfil {
  nombre: string
  email: string
}

export interface UsuarioPanel {
  id: string
  nombre: string
  apellido: string
  email: string
  rol: RolUsuario
  activo: boolean
  sucursales: SucursalUsuario[]
}

export interface PlanInfo {
  nombre: string
  precio: number
  renovacion: string
  features: string[]
}

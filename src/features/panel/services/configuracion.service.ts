import type { PerfilNegocio, MiPerfil, UsuarioPanel } from "../types/configuracion.types"

export interface ConfiguracionService {
  getPerfilNegocio(): Promise<PerfilNegocio>
  guardarPerfilNegocio(data: PerfilNegocio): Promise<void>
  getMiPerfil(): Promise<MiPerfil>
  guardarMiPerfil(data: Partial<MiPerfil>): Promise<void>
  cambiarPassword(actual: string, nueva: string): Promise<void>
  getUsuarios(): Promise<UsuarioPanel[]>
}

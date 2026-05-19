import type { PerfilNegocio, MiPerfil, UsuarioPanel, NotifConfig } from "../types/configuracion.types"

export interface ConfiguracionService {
  getPerfilNegocio(): Promise<PerfilNegocio>
  guardarPerfilNegocio(data: PerfilNegocio): Promise<void>
  getMiPerfil(): Promise<MiPerfil>
  guardarMiPerfil(data: Partial<MiPerfil>): Promise<void>
  cambiarPassword(actual: string, nueva: string): Promise<void>
  getUsuarios(): Promise<UsuarioPanel[]>
  getNotifConfig(): Promise<NotifConfig>
  guardarNotifConfig(data: NotifConfig): Promise<void>
}

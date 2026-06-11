import type { PerfilNegocio, MiPerfil, UsuarioPanel } from "../types/configuracion.types"
import { httpClient } from "@/lib/api/http-client"

export interface ConfiguracionService {
  getPerfilNegocio(): Promise<PerfilNegocio>
  guardarPerfilNegocio(data: PerfilNegocio): Promise<void>
  getMiPerfil(): Promise<MiPerfil>
  guardarMiPerfil(data: Partial<MiPerfil>): Promise<void>
  cambiarPassword(actual: string, nueva: string): Promise<void>
  getUsuarios(): Promise<UsuarioPanel[]>
}

type ConfiguracionTallerResponse = {
  nombre: string
  rut: string
  telefono: string | null
  email: string | null
  logoUrl: string | null
}

function mapTallerToPerfil(taller: ConfiguracionTallerResponse): PerfilNegocio {
  return {
    nombre: taller.nombre,
    rut: taller.rut,
    direccion: "",
    telefono: taller.telefono ?? "",
    email: taller.email ?? "",
    logoUrl: taller.logoUrl,
  }
}

function mapPerfilToTaller(data: PerfilNegocio) {
  return {
    nombre: data.nombre,
    rut: data.rut,
    telefono: data.telefono,
    email: data.email,
    logoUrl: data.logoUrl ?? null,
  }
}

export const configuracionRealService: Pick<ConfiguracionService, "getPerfilNegocio" | "guardarPerfilNegocio"> = {
  async getPerfilNegocio() {
    const taller = await httpClient.get<ConfiguracionTallerResponse>("configuracion/taller")
    return mapTallerToPerfil(taller)
  },

  async guardarPerfilNegocio(data) {
    await httpClient.patch<ConfiguracionTallerResponse>("configuracion/taller", mapPerfilToTaller(data))
  },
}

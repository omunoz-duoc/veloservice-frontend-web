import type {
  MiPerfil,
  PerfilNegocio,
  SucursalConfiguracion,
  UsuarioPanel,
} from "../types/configuracion.types"
import { httpClient } from "@/lib/api/http-client"
import { ApiError } from "@/lib/api/api-error"

export interface ConfiguracionService {
  getPerfilNegocio(): Promise<PerfilNegocio>
  guardarPerfilNegocio(data: Omit<PerfilNegocio, "logoUrl">): Promise<PerfilNegocio>
  subirLogo(file: File): Promise<PerfilNegocio>
  getSucursales(): Promise<SucursalConfiguracion[]>
  guardarSucursal(id: string, data: Omit<SucursalConfiguracion, "id">): Promise<SucursalConfiguracion>
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

type ConfiguracionSucursalResponse = {
  id: string
  nombre: string
  direccion: string | null
  telefono: string | null
  email: string | null
}

type PresignResponse = {
  presignedUrl: string
  objectKey: string
  publicUrl: string
}

const TALLER_SCOPE = { attachSucursal: false } as const

function mapTallerToPerfil(taller: ConfiguracionTallerResponse): PerfilNegocio {
  return {
    nombre: taller.nombre,
    rut: taller.rut,
    telefono: taller.telefono ?? "",
    email: taller.email ?? "",
    logoUrl: taller.logoUrl,
  }
}

function mapPerfilToTaller(data: Omit<PerfilNegocio, "logoUrl">) {
  return {
    nombre: data.nombre,
    rut: data.rut,
    telefono: data.telefono || null,
    email: data.email || null,
  }
}

function mapSucursal(sucursal: ConfiguracionSucursalResponse): SucursalConfiguracion {
  return {
    id: sucursal.id,
    nombre: sucursal.nombre,
    direccion: sucursal.direccion ?? "",
    telefono: sucursal.telefono ?? "",
    email: sucursal.email ?? "",
  }
}

export const configuracionRealService = {
  async getPerfilNegocio() {
    const taller = await httpClient.get<ConfiguracionTallerResponse>("configuracion/taller", TALLER_SCOPE)
    return mapTallerToPerfil(taller)
  },

  async guardarPerfilNegocio(data) {
    const taller = await httpClient.patch<ConfiguracionTallerResponse>(
      "configuracion/taller",
      mapPerfilToTaller(data),
      TALLER_SCOPE,
    )
    return mapTallerToPerfil(taller)
  },

  async subirLogo(file) {
    const presign = await httpClient.post<PresignResponse>(
      "configuracion/taller/logo/presign",
      { tipoArchivo: file.type, nombre: file.name },
      TALLER_SCOPE,
    )

    const put = await fetch(presign.presignedUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    })
    if (!put.ok) {
      throw new ApiError("R2 logo upload failed", put.status, await put.text().catch(() => null))
    }

    const taller = await httpClient.post<ConfiguracionTallerResponse>(
      "configuracion/taller/logo/confirm",
      {
        objectKey: presign.objectKey,
        publicUrl: presign.publicUrl,
        tipoArchivo: file.type,
      },
      TALLER_SCOPE,
    )
    return mapTallerToPerfil(taller)
  },

  async getSucursales() {
    const sucursales = await httpClient.get<ConfiguracionSucursalResponse[]>(
      "configuracion/sucursales",
      TALLER_SCOPE,
    )
    return sucursales.map(mapSucursal)
  },

  async guardarSucursal(id, data) {
    const sucursal = await httpClient.patch<ConfiguracionSucursalResponse>(
      `configuracion/sucursales/${id}`,
      {
        nombre: data.nombre,
        direccion: data.direccion || null,
        telefono: data.telefono || null,
        email: data.email || null,
      },
      TALLER_SCOPE,
    )
    return mapSucursal(sucursal)
  },

  async cambiarPassword(actual, nueva) {
    await httpClient.post<void>("auth/me/change-password", { actual, nueva })
  },

  async getUsuarios() {
    return httpClient.get<UsuarioPanel[]>("configuracion/usuarios", TALLER_SCOPE)
  },
} satisfies Pick<
  ConfiguracionService,
  | "getPerfilNegocio"
  | "guardarPerfilNegocio"
  | "subirLogo"
  | "getSucursales"
  | "guardarSucursal"
  | "cambiarPassword"
  | "getUsuarios"
>

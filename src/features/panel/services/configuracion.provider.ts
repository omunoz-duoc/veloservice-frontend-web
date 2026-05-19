import type { ConfiguracionService } from "./configuracion.service"
import {
  mockGetPerfilNegocio,
  mockGuardarPerfilNegocio,
  mockGetMiPerfil,
  mockGuardarMiPerfil,
  mockCambiarPassword,
  mockGetUsuarios,
  mockGetNotifConfig,
  mockGuardarNotifConfig,
} from "./configuracion.mock"

export const configuracionService: ConfiguracionService = {
  getPerfilNegocio: mockGetPerfilNegocio,
  guardarPerfilNegocio: mockGuardarPerfilNegocio,
  getMiPerfil: mockGetMiPerfil,
  guardarMiPerfil: mockGuardarMiPerfil,
  cambiarPassword: mockCambiarPassword,
  getUsuarios: mockGetUsuarios,
  getNotifConfig: mockGetNotifConfig,
  guardarNotifConfig: mockGuardarNotifConfig,
}

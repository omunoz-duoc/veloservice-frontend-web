import type { ConfiguracionService } from "./configuracion.service"
import { configuracionRealService } from "./configuracion.service"
import {
  mockGetMiPerfil,
  mockGuardarMiPerfil,
  mockGetUsuarios,
} from "./configuracion.mock"

export const configuracionService: ConfiguracionService = {
  getPerfilNegocio: configuracionRealService.getPerfilNegocio,
  guardarPerfilNegocio: configuracionRealService.guardarPerfilNegocio,
  getMiPerfil: mockGetMiPerfil,
  guardarMiPerfil: mockGuardarMiPerfil,
  cambiarPassword: configuracionRealService.cambiarPassword,
  getUsuarios: mockGetUsuarios,
}

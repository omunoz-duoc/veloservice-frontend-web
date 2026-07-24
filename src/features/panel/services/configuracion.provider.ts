import type { ConfiguracionService } from "./configuracion.service"
import { configuracionRealService } from "./configuracion.service"
import { useMockServices } from "@/lib/api/service-mode"
import {
  mockCambiarPassword,
  mockGetPerfilNegocio,
  mockGetSucursales,
  mockGetMiPerfil,
  mockGuardarPerfilNegocio,
  mockGuardarMiPerfil,
  mockGuardarSucursal,
  mockGetUsuarios,
  mockSubirLogo,
} from "./configuracion.mock"

export const configuracionService: ConfiguracionService = {
  getPerfilNegocio: useMockServices ? mockGetPerfilNegocio : configuracionRealService.getPerfilNegocio,
  guardarPerfilNegocio: useMockServices ? mockGuardarPerfilNegocio : configuracionRealService.guardarPerfilNegocio,
  subirLogo: useMockServices ? mockSubirLogo : configuracionRealService.subirLogo,
  getSucursales: useMockServices ? mockGetSucursales : configuracionRealService.getSucursales,
  guardarSucursal: useMockServices ? mockGuardarSucursal : configuracionRealService.guardarSucursal,
  getMiPerfil: mockGetMiPerfil,
  guardarMiPerfil: mockGuardarMiPerfil,
  cambiarPassword: useMockServices ? mockCambiarPassword : configuracionRealService.cambiarPassword,
  getUsuarios: useMockServices ? mockGetUsuarios : configuracionRealService.getUsuarios,
}

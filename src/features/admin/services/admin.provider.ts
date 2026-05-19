import type { IAdminService } from "./admin.service"
import {
  mockGetTalleres,
  mockGetTallerById,
  mockUpdateTallerEstado,
  mockUpdateTallerModulos,
  mockGetModulos,
  mockGetSuscripciones,
  mockUpdateSuscripcion,
  mockGetSaasKpis,
  mockGetMetricasDetalle,
} from "./admin.mock"

export const adminService: IAdminService = {
  getTalleres: mockGetTalleres,
  getTallerById: mockGetTallerById,
  updateTallerEstado: mockUpdateTallerEstado,
  updateTallerModulos: mockUpdateTallerModulos,
  getModulos: mockGetModulos,
  getSuscripciones: mockGetSuscripciones,
  updateSuscripcion: mockUpdateSuscripcion,
  getSaasKpis: mockGetSaasKpis,
  getMetricasDetalle: mockGetMetricasDetalle,
}

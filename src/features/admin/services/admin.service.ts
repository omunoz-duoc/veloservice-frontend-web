import type {
  TallerAdmin,
  ModuloSaaS,
  SuscripcionTaller,
  SaasKpis,
  MetricasSaaSDetalle,
  EstadoTaller,
  PlanSaaS,
  EstadoSuscripcion,
} from "./admin.types"

export interface IAdminService {
  getTalleres(): Promise<TallerAdmin[]>
  getTallerById(id: string): Promise<TallerAdmin | null>
  updateTallerEstado(id: string, estado: EstadoTaller): Promise<void>
  updateTallerModulos(id: string, moduloIds: string[]): Promise<void>
  getModulos(): Promise<ModuloSaaS[]>
  getSuscripciones(): Promise<SuscripcionTaller[]>
  updateSuscripcion(
    tallerId: string,
    data: {
      plan?: PlanSaaS
      precioMensual?: number
      fechaRenovacion?: string
      estado?: EstadoSuscripcion
    }
  ): Promise<void>
  getSaasKpis(): Promise<SaasKpis>
  getMetricasDetalle(): Promise<MetricasSaaSDetalle>
}

// Stubs para endpoints reales del backend (futuro)
// GET   /admin/talleres
// GET   /admin/talleres/:id
// PUT   /admin/talleres/:id/estado
// GET   /admin/modulos
// GET   /admin/talleres/:id/modulos
// PUT   /admin/talleres/:id/modulos
// GET   /admin/suscripciones
// PUT   /admin/suscripciones/:tallerId
// GET   /admin/metrics/saas-kpis
// GET   /admin/metrics/historical

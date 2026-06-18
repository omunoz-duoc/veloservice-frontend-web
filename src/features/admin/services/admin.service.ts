import { httpClient } from "@/lib/api/http-client"
import type {
  TallerAdmin,
  CrearTallerInput,
  ModuloSaaS,
  PlanSaasAdmin,
  SuscripcionTaller,
  SaasKpis,
  MetricasSaaSDetalle,
} from "./admin.types"

export interface IAdminService {
  getTalleres(): Promise<TallerAdmin[]>
  getTallerById(id: string): Promise<TallerAdmin | null>
  createTaller(data: CrearTallerInput): Promise<TallerAdmin>
  updateTallerEstado(id: string, activo: boolean): Promise<TallerAdmin>
  updateTallerModulos(): Promise<void>
  getPlanes(): Promise<PlanSaasAdmin[]>
  getModulos(): Promise<ModuloSaaS[]>
  getSuscripciones(): Promise<SuscripcionTaller[]>
  updateSuscripcion(): Promise<void>
  getSaasKpis(): Promise<SaasKpis>
  getMetricasDetalle(): Promise<MetricasSaaSDetalle>
}

export const realAdminService: IAdminService = {
  getTalleres: () => httpClient.get<TallerAdmin[]>("admin/talleres"),
  getTallerById: id => httpClient.get<TallerAdmin | null>(`admin/talleres/${id}`),
  createTaller: data => httpClient.post<TallerAdmin>("admin/talleres", data),
  updateTallerEstado: (id, activo) =>
    httpClient.patch<TallerAdmin>(`admin/talleres/${id}/estado`, { activo }),
  getPlanes: () => httpClient.get<PlanSaasAdmin[]>("admin/planes"),
  getModulos: () => httpClient.get<ModuloSaaS[]>("admin/modulos"),
  getSaasKpis: () => httpClient.get<SaasKpis>("admin/metrics/saas-kpis"),

  getSuscripciones: () => httpClient.get<SuscripcionTaller[]>("admin/suscripciones"),
  getMetricasDetalle: () => httpClient.get<MetricasSaaSDetalle>("admin/metrics/historical"),

  updateTallerModulos: async () => {
    throw new Error("No implementado todavia")
  },
  updateSuscripcion: async () => {
    throw new Error("No implementado todavia")
  },
}

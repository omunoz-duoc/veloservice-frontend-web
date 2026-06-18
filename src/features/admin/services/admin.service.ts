import { httpClient } from "@/lib/api/http-client"
import type {
  TallerAdmin,
  ModuloSaaS,
  SuscripcionTaller,
  SaasKpis,
  MetricasSaaSDetalle,
} from "./admin.types"

export interface IAdminService {
  getTalleres(): Promise<TallerAdmin[]>
  getTallerById(id: string): Promise<TallerAdmin | null>
  updateTallerEstado(): Promise<void>
  updateTallerModulos(): Promise<void>
  getModulos(): Promise<ModuloSaaS[]>
  getSuscripciones(): Promise<SuscripcionTaller[]>
  updateSuscripcion(): Promise<void>
  getSaasKpis(): Promise<SaasKpis>
  getMetricasDetalle(): Promise<MetricasSaaSDetalle>
}

export const realAdminService: IAdminService = {
  getTalleres: () => httpClient.get<TallerAdmin[]>("admin/talleres"),
  getTallerById: id => httpClient.get<TallerAdmin | null>(`admin/talleres/${id}`),
  getModulos: () => httpClient.get<ModuloSaaS[]>("admin/modulos"),
  getSaasKpis: () => httpClient.get<SaasKpis>("admin/metrics/saas-kpis"),

  getSuscripciones: () => httpClient.get<SuscripcionTaller[]>("admin/suscripciones"),
  getMetricasDetalle: () => httpClient.get<MetricasSaaSDetalle>("admin/metrics/historical"),

  updateTallerEstado: async () => {
    throw new Error("No implementado todavía")
  },
  updateTallerModulos: async () => {
    throw new Error("No implementado todavía")
  },
  updateSuscripcion: async () => {
    throw new Error("No implementado todavía")
  },
}

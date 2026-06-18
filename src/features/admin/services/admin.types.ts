export type EstadoTaller = "activo" | "inactivo" | "pendiente" | "suspendido" | "trial"
export type PlanSaaS = "starter" | "pro" | "enterprise"
export type EstadoSuscripcion = "activa" | "vencida" | "cancelada" | "trial"

export interface TallerAdmin {
  id: string
  nombre: string
  rut: string
  direccion: string
  telefono: string
  email: string
  estado: EstadoTaller
  plan: PlanSaaS
  fechaRegistro: string
  fechaRenovacion: string | null
  cantidadUsuarios: number
  cantidadOTsMes: number
  moduloIds: string[]
}

export interface ModuloSaaS {
  id: string
  nombre: string
  descripcion: string
  categoria: "core" | "add-on"
  iconKey: string
}

export interface SuscripcionTaller {
  tallerId: string
  tallerNombre: string
  plan: PlanSaaS
  precioMensual: number
  estado: EstadoSuscripcion
  fechaInicio: string
  fechaRenovacion: string | null
  diasRestantes: number
  mrr: number
}

export interface SaasKpis {
  totalTalleres: number
  talleresActivos: number
  talleresNuevosMes: number
  mrrTotal: number
  mrrDelta: string
  churnRate: string
  trialToPaidRate: string
}

export interface MetricasSaaSDetalle {
  mrrHistorico: { mes: string; mrr: number }[]
  nuevosTalleresHistorico: { mes: string; count: number }[]
  churnHistorico: { mes: string; rate: number }[]
  distribucionPlanes: { plan: PlanSaaS; count: number }[]
  usuariosPorTaller: { tallerNombre: string; count: number }[]
  clientesPorTaller: { tallerNombre: string; count: number }[]
  sucursalesPorTaller: { tallerNombre: string; count: number }[]
  ordenesPorTaller: { tallerNombre: string; count: number }[]
}

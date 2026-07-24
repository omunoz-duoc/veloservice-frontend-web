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

// ─── Helper delay ─────────────────────────────────────────────────────────────
const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

// ─── Módulos disponibles en la plataforma ────────────────────────────────────
const MODULOS_DISPONIBLES: ModuloSaaS[] = [
  { id: "mod-ordenes", nombre: "Órdenes de trabajo", descripcion: "Creación y seguimiento de OTs", categoria: "core", iconKey: "ClipboardList" },
  { id: "mod-clientes", nombre: "Clientes", descripcion: "Base de clientes y historial", categoria: "core", iconKey: "Users" },
  { id: "mod-servicios", nombre: "Servicios", descripcion: "Catálogo de servicios y precios", categoria: "core", iconKey: "Wrench" },
  { id: "mod-inventario", nombre: "Inventario", descripcion: "Stock de repuestos y alertas", categoria: "core", iconKey: "Package" },
  { id: "mod-finanzas", nombre: "Finanzas", descripcion: "Ingresos, egresos y reportes", categoria: "add-on", iconKey: "Landmark" },
  { id: "mod-mecanicos", nombre: "Mecánicos", descripcion: "Asignación y rendimiento", categoria: "add-on", iconKey: "UserCog" },
  { id: "mod-multi-sucursal", nombre: "Multi-sucursal", descripcion: "Gestión de varias ubicaciones", categoria: "add-on", iconKey: "Building2" },
  { id: "mod-reportes", nombre: "Reportes avanzados", descripcion: "Dashboards y exportación", categoria: "add-on", iconKey: "BarChart3" },
]

// ─── Mock data de talleres ────────────────────────────────────────────────────
const _talleresRaw: Omit<TallerAdmin, "activo">[] = [
  {
    id: "t1",
    nombre: "Taller AutoVelo",
    rut: "76.123.456-7",
    direccion: "Av. Providencia 1234, Santiago",
    telefono: "+56 9 1234 5678",
    email: "contacto@autovelo.cl",
    estado: "activo",
    plan: "pro",
    fechaRegistro: "2024-03-15",
    fechaRenovacion: "2026-06-15",
    cantidadUsuarios: 4,
    cantidadOTsMes: 142,
    moduloIds: ["mod-ordenes", "mod-clientes", "mod-servicios", "mod-inventario", "mod-finanzas", "mod-mecanicos"],
  },
  {
    id: "t2",
    nombre: "BikeLab Providencia",
    rut: "77.987.654-3",
    direccion: "Huerfanos 890, Santiago",
    telefono: "+56 9 8765 4321",
    email: "hola@bikelab.cl",
    estado: "activo",
    plan: "starter",
    fechaRegistro: "2025-01-10",
    fechaRenovacion: "2026-01-10",
    cantidadUsuarios: 2,
    cantidadOTsMes: 58,
    moduloIds: ["mod-ordenes", "mod-clientes", "mod-servicios"],
  },
  {
    id: "t3",
    nombre: "CicloFix Las Condes",
    rut: "78.456.123-9",
    direccion: "Apoquindo 4500, Las Condes",
    telefono: "+56 9 4567 8912",
    email: "info@ciclofix.cl",
    estado: "trial",
    plan: "pro",
    fechaRegistro: "2025-04-20",
    fechaRenovacion: "2025-07-20",
    cantidadUsuarios: 3,
    cantidadOTsMes: 34,
    moduloIds: ["mod-ordenes", "mod-clientes", "mod-servicios", "mod-inventario", "mod-finanzas"],
  },
  {
    id: "t4",
    nombre: "VeloMecánica Ñuñoa",
    rut: "79.111.222-3",
    direccion: "Irarrázaval 2345, Ñuñoa",
    telefono: "+56 9 2222 3333",
    email: "admin@velomecanica.cl",
    estado: "activo",
    plan: "enterprise",
    fechaRegistro: "2023-11-05",
    fechaRenovacion: "2026-11-05",
    cantidadUsuarios: 8,
    cantidadOTsMes: 310,
    moduloIds: ["mod-ordenes", "mod-clientes", "mod-servicios", "mod-inventario", "mod-finanzas", "mod-mecanicos", "mod-multi-sucursal", "mod-reportes"],
  },
  {
    id: "t5",
    nombre: "Pedal Pro Maipú",
    rut: "80.333.444-5",
    direccion: "Av. Pajaritos 5678, Maipú",
    telefono: "+56 9 4444 5555",
    email: "pedalpro@email.cl",
    estado: "suspendido",
    plan: "starter",
    fechaRegistro: "2024-08-12",
    fechaRenovacion: "2025-02-12",
    cantidadUsuarios: 2,
    cantidadOTsMes: 0,
    moduloIds: ["mod-ordenes", "mod-clientes"],
  },
  {
    id: "t6",
    nombre: "Ruta Ciclismo Estación Central",
    rut: "81.555.666-7",
    direccion: "Alameda 3210, Estación Central",
    telefono: "+56 9 6666 7777",
    email: "ruta@central.cl",
    estado: "activo",
    plan: "pro",
    fechaRegistro: "2024-12-01",
    fechaRenovacion: "2025-12-01",
    cantidadUsuarios: 5,
    cantidadOTsMes: 198,
    moduloIds: ["mod-ordenes", "mod-clientes", "mod-servicios", "mod-inventario", "mod-finanzas", "mod-reportes"],
  },
  {
    id: "t7",
    nombre: "Cadena Limpia Vitacura",
    rut: "82.777.888-9",
    direccion: "Vitacura 1200, Vitacura",
    telefono: "+56 9 8888 9999",
    email: "cadena@vitacura.cl",
    estado: "trial",
    plan: "enterprise",
    fechaRegistro: "2025-05-10",
    fechaRenovacion: "2025-08-10",
    cantidadUsuarios: 6,
    cantidadOTsMes: 45,
    moduloIds: ["mod-ordenes", "mod-clientes", "mod-servicios", "mod-inventario", "mod-finanzas", "mod-mecanicos", "mod-multi-sucursal"],
  },
  {
    id: "t8",
    nombre: "Taller BiciSur Puente Alto",
    rut: "83.999.000-1",
    direccion: "Av. Concha y Toro 8900, Puente Alto",
    telefono: "+56 9 0000 1111",
    email: "bicisur@pta.cl",
    estado: "inactivo",
    plan: "starter",
    fechaRegistro: "2024-06-20",
    fechaRenovacion: "2024-12-20",
    cantidadUsuarios: 1,
    cantidadOTsMes: 0,
    moduloIds: ["mod-ordenes"],
  },
  {
    id: "t9",
    nombre: "Mountain Service La Reina",
    rut: "84.222.333-4",
    direccion: "Av. Larraín 5600, La Reina",
    telefono: "+56 9 3333 4444",
    email: "mountain@lareina.cl",
    estado: "activo",
    plan: "pro",
    fechaRegistro: "2025-02-15",
    fechaRenovacion: "2026-02-15",
    cantidadUsuarios: 3,
    cantidadOTsMes: 87,
    moduloIds: ["mod-ordenes", "mod-clientes", "mod-servicios", "mod-inventario"],
  },
  {
    id: "t10",
    nombre: "E-Bike Center Santiago",
    rut: "85.444.555-6",
    direccion: "Bandera 400, Santiago Centro",
    telefono: "+56 9 5555 6666",
    email: "ebike@santiago.cl",
    estado: "activo",
    plan: "enterprise",
    fechaRegistro: "2023-09-01",
    fechaRenovacion: "2026-09-01",
    cantidadUsuarios: 10,
    cantidadOTsMes: 420,
    moduloIds: ["mod-ordenes", "mod-clientes", "mod-servicios", "mod-inventario", "mod-finanzas", "mod-mecanicos", "mod-multi-sucursal", "mod-reportes"],
  },
]

const _talleres: TallerAdmin[] = _talleresRaw.map((t) => ({
  ...t,
  activo: t.estado === "activo" || t.estado === "trial",
}))

// ─── Suscripciones derivadas ──────────────────────────────────────────────────
function buildSuscripciones(): SuscripcionTaller[] {
  const planPrices: Record<PlanSaaS, number> = {
    starter: 14990,
    pro: 29990,
    enterprise: 59990,
  }
  return _talleres.map((t) => {
    const hoy = new Date()
    const renovacion = t.fechaRenovacion ? new Date(t.fechaRenovacion) : null
    const diasRestantes = renovacion
      ? Math.ceil((renovacion.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))
      : 0
    return {
      tallerId: t.id,
      tallerNombre: t.nombre,
      plan: t.plan,
      precioMensual: planPrices[t.plan],
      estado: t.estado === "trial" ? "trial" : t.estado === "suspendido" || t.estado === "inactivo" ? "vencida" : "activa",
      fechaInicio: t.fechaRegistro,
      fechaRenovacion: t.fechaRenovacion,
      diasRestantes,
      mrr: planPrices[t.plan],
    }
  })
}

let _suscripciones = buildSuscripciones()

// ─── KPIs SaaS derivados ──────────────────────────────────────────────────────
function computeKpis(): SaasKpis {
  const activos = _talleres.filter((t) => t.estado === "activo").length
  const nuevos = _talleres.filter((t) => {
    const d = new Date(t.fechaRegistro)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length
  const mrr = _suscripciones
    .filter((s) => s.estado === "activa" || s.estado === "trial")
    .reduce((sum, s) => sum + s.mrr, 0)
  return {
    totalTalleres: _talleres.length,
    talleresActivos: activos,
    talleresNuevosMes: nuevos,
    mrrTotal: mrr,
    mrrDelta: "+12% vs mes anterior",
    churnRate: "2.3%",
    trialToPaidRate: "68%",
  }
}

// ─── Métricas históricas mock ────────────────────────────────────────────────
const MRR_HISTORICO: { mes: string; mrr: number }[] = [
  { mes: "Jun 24", mrr: 180_000 },
  { mes: "Jul 24", mrr: 195_000 },
  { mes: "Ago 24", mrr: 210_000 },
  { mes: "Sep 24", mrr: 225_000 },
  { mes: "Oct 24", mrr: 240_000 },
  { mes: "Nov 24", mrr: 255_000 },
  { mes: "Dic 24", mrr: 270_000 },
  { mes: "Ene 25", mrr: 290_000 },
  { mes: "Feb 25", mrr: 310_000 },
  { mes: "Mar 25", mrr: 335_000 },
  { mes: "Abr 25", mrr: 360_000 },
  { mes: "May 25", mrr: 389_910 },
]

const NUEVOS_HISTORICO: { mes: string; count: number }[] = [
  { mes: "Jun 24", count: 1 },
  { mes: "Jul 24", count: 0 },
  { mes: "Ago 24", count: 1 },
  { mes: "Sep 24", count: 2 },
  { mes: "Oct 24", count: 1 },
  { mes: "Nov 24", count: 1 },
  { mes: "Dic 24", count: 2 },
  { mes: "Ene 25", count: 1 },
  { mes: "Feb 25", count: 2 },
  { mes: "Mar 25", count: 1 },
  { mes: "Abr 25", count: 2 },
  { mes: "May 25", count: 0 },
]

const CHURN_HISTORICO: { mes: string; rate: number }[] = [
  { mes: "Jun 24", rate: 0 },
  { mes: "Jul 24", rate: 0 },
  { mes: "Ago 24", rate: 0 },
  { mes: "Sep 24", rate: 4.5 },
  { mes: "Oct 24", rate: 0 },
  { mes: "Nov 24", rate: 2.1 },
  { mes: "Dic 24", rate: 0 },
  { mes: "Ene 25", rate: 3.0 },
  { mes: "Feb 25", rate: 0 },
  { mes: "Mar 25", rate: 1.5 },
  { mes: "Abr 25", rate: 0 },
  { mes: "May 25", rate: 2.3 },
]

function computeDistribucionPlanes(): { plan: PlanSaaS; count: number }[] {
  const counts: Record<PlanSaaS, number> = { starter: 0, pro: 0, enterprise: 0 }
  for (const t of _talleres) counts[t.plan]++
  return [
    { plan: "starter", count: counts.starter },
    { plan: "pro", count: counts.pro },
    { plan: "enterprise", count: counts.enterprise },
  ]
}

// ─── Mock functions ───────────────────────────────────────────────────────────

export async function mockGetTalleres(): Promise<TallerAdmin[]> {
  await delay(300)
  return [..._talleres]
}

export async function mockGetTallerById(id: string): Promise<TallerAdmin | null> {
  await delay(200)
  const t = _talleres.find((x) => x.id === id)
  return t ? { ...t } : null
}

export async function mockUpdateTallerEstado(id: string, estado: EstadoTaller): Promise<void> {
  await delay(400)
  const idx = _talleres.findIndex((x) => x.id === id)
  if (idx >= 0) {
    _talleres[idx] = { ..._talleres[idx], estado }
    _suscripciones = buildSuscripciones()
  }
}

export async function mockUpdateTallerModulos(id: string, moduloIds: string[]): Promise<void> {
  await delay(400)
  const idx = _talleres.findIndex((x) => x.id === id)
  if (idx >= 0) {
    _talleres[idx] = { ..._talleres[idx], moduloIds: [...moduloIds] }
  }
}

export async function mockGetModulos(): Promise<ModuloSaaS[]> {
  await delay(200)
  return [...MODULOS_DISPONIBLES]
}

export async function mockGetSuscripciones(): Promise<SuscripcionTaller[]> {
  await delay(300)
  return [..._suscripciones]
}

export async function mockUpdateSuscripcion(
  tallerId: string,
  data: { plan?: PlanSaaS; precioMensual?: number; fechaRenovacion?: string; estado?: EstadoSuscripcion }
): Promise<void> {
  await delay(400)
  const idx = _suscripciones.findIndex((s) => s.tallerId === tallerId)
  if (idx >= 0) {
    _suscripciones[idx] = { ..._suscripciones[idx], ...data }
  }
  const tIdx = _talleres.findIndex((t) => t.id === tallerId)
  if (tIdx >= 0 && data.plan) {
    _talleres[tIdx] = { ..._talleres[tIdx], plan: data.plan }
  }
}

export async function mockGetSaasKpis(): Promise<SaasKpis> {
  await delay(250)
  return computeKpis()
}

function sucursalesPorPlan(plan: PlanSaaS): number {
  return plan === "enterprise" ? 3 : plan === "pro" ? 2 : 1
}

export async function mockGetMetricasDetalle(): Promise<MetricasSaaSDetalle> {
  await delay(300)
  return {
    mrrHistorico: [...MRR_HISTORICO],
    nuevosTalleresHistorico: [...NUEVOS_HISTORICO],
    churnHistorico: [...CHURN_HISTORICO],
    distribucionPlanes: computeDistribucionPlanes(),
    usuariosPorTaller: _talleres.map((t) => ({ tallerNombre: t.nombre, count: t.cantidadUsuarios })),
    clientesPorTaller: _talleres.map((t) => ({ tallerNombre: t.nombre, count: t.cantidadUsuarios * 40 })),
    sucursalesPorTaller: _talleres.map((t) => ({ tallerNombre: t.nombre, count: sucursalesPorPlan(t.plan) })),
    ordenesPorTaller: _talleres.map((t) => ({ tallerNombre: t.nombre, count: t.cantidadOTsMes })),
  }
}

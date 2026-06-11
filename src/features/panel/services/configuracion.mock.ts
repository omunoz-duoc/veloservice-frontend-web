import type {
  PerfilNegocio,
  MiPerfil,
  UsuarioPanel,
  PlanInfo,
} from "../types/configuracion.types"

// ── Mock data ────────────────────────────────────────────────────────────────

let _perfilNegocio: PerfilNegocio = {
  nombre: "Taller AutoVelo",
  rut: "76.123.456-7",
  direccion: "Av. Providencia 1234, Santiago",
  telefono: "+56 9 1234 5678",
  email: "contacto@autovelo.cl",
}

let _miPerfil: MiPerfil = {
  nombre: "Carlos López",
  email: "carlos@autovelo.cl",
}

const _usuarios: UsuarioPanel[] = [
  { id: "1", nombre: "Carlos López", email: "carlos@autovelo.cl", rol: "admin", estado: "activo" },
  { id: "2", nombre: "María Soto", email: "maria@autovelo.cl", rol: "mecanico", estado: "activo" },
  { id: "3", nombre: "Pedro Ruiz", email: "pedro@autovelo.cl", rol: "mecanico", estado: "activo" },
]

export const PLAN_INFO: PlanInfo = {
  nombre: "Pro",
  precio: 29990,
  renovacion: "2026-06-15",
  features: [
    "Órdenes de trabajo ilimitadas",
    "Hasta 10 usuarios",
    "Gestión de inventario",
    "Reportes financieros",
    "Soporte prioritario",
  ],
}

// ── Mock functions ───────────────────────────────────────────────────────────

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

export async function mockGetPerfilNegocio(): Promise<PerfilNegocio> {
  await delay(300)
  return { ..._perfilNegocio }
}

export async function mockGuardarPerfilNegocio(data: PerfilNegocio): Promise<void> {
  await delay(400)
  _perfilNegocio = { ...data }
}

export async function mockGetMiPerfil(): Promise<MiPerfil> {
  await delay(300)
  return { ..._miPerfil }
}

export async function mockGuardarMiPerfil(data: Partial<MiPerfil>): Promise<void> {
  await delay(400)
  _miPerfil = { ..._miPerfil, ...data }
}

export async function mockCambiarPassword(actual: string, _nueva: string): Promise<void> {
  await delay(400)
  if (actual !== "mock-password") {
    throw new Error("Contraseña actual incorrecta")
  }
}

export async function mockGetUsuarios(): Promise<UsuarioPanel[]> {
  await delay(300)
  return [..._usuarios]
}

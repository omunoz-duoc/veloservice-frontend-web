import type {
  PerfilNegocio,
  MiPerfil,
  SucursalConfiguracion,
  UsuarioPanel,
  PlanInfo,
} from "../types/configuracion.types"

// ── Mock data ────────────────────────────────────────────────────────────────

let _perfilNegocio: PerfilNegocio = {
  nombre: "Taller AutoVelo",
  rut: "76.123.456-7",
  telefono: "+56 9 1234 5678",
  email: "contacto@autovelo.cl",
  logoUrl: null,
}

const _sucursales: SucursalConfiguracion[] = [
  {
    id: "s-001",
    nombre: "Providencia",
    direccion: "Av. Providencia 1234, Santiago",
    telefono: "+56 2 2345 6789",
    email: "providencia@autovelo.cl",
  },
  {
    id: "s-002",
    nombre: "La Florida",
    direccion: "Av. Vicuña Mackenna 7350, Santiago",
    telefono: "+56 2 2876 4321",
    email: "laflorida@autovelo.cl",
  },
]

let _miPerfil: MiPerfil = {
  nombre: "Edwin Gutiérrez",
  email: "edwin@veloservice.cl",
}

const _usuarios: UsuarioPanel[] = [
  {
    id: "1",
    nombre: "Edwin",
    apellido: "Gutiérrez",
    email: "edwin@veloservice.cl",
    rol: "admin_taller",
    activo: true,
    sucursales: [],
  },
  {
    id: "2",
    nombre: "María",
    apellido: "Soto",
    email: "maria@autovelo.cl",
    rol: "mecanico",
    activo: true,
    sucursales: [{ id: "s-001", nombre: "Providencia", esPrincipal: true }],
  },
  {
    id: "3",
    nombre: "Pedro",
    apellido: "Ruiz",
    email: "pedro@autovelo.cl",
    rol: "jefe_taller",
    activo: true,
    sucursales: [
      { id: "s-001", nombre: "Providencia", esPrincipal: true },
      { id: "s-002", nombre: "La Florida", esPrincipal: false },
    ],
  },
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

export async function mockGuardarPerfilNegocio(
  data: Omit<PerfilNegocio, "logoUrl">
): Promise<PerfilNegocio> {
  await delay(400)
  _perfilNegocio = { ..._perfilNegocio, ...data }
  return { ..._perfilNegocio }
}

export async function mockSubirLogo(file: File): Promise<PerfilNegocio> {
  await delay(400)
  _perfilNegocio = {
    ..._perfilNegocio,
    logoUrl: `https://mock.veloservice.cl/logos/${encodeURIComponent(file.name)}`,
  }
  return { ..._perfilNegocio }
}

export async function mockGetSucursales(): Promise<SucursalConfiguracion[]> {
  await delay(300)
  return _sucursales.map((sucursal) => ({ ...sucursal }))
}

export async function mockGuardarSucursal(
  id: string,
  data: Omit<SucursalConfiguracion, "id">
): Promise<SucursalConfiguracion> {
  await delay(400)
  const index = _sucursales.findIndex((sucursal) => sucursal.id === id)
  if (index < 0) throw new Error("Sucursal no encontrada")
  _sucursales[index] = { id, ...data }
  return { ..._sucursales[index] }
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
  return _usuarios.map((usuario) => ({
    ...usuario,
    sucursales: usuario.sucursales.map((sucursal) => ({ ...sucursal })),
  }))
}

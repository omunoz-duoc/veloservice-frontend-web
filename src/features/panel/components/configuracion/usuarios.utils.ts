import type { SucursalUsuario, UsuarioPanel } from "../../types/configuracion.types"

export type UsuarioAgrupado = UsuarioPanel & {
  asignacion: SucursalUsuario | null
}

export interface GrupoUsuarios {
  id: string
  nombre: string
  tipo: "administracion" | "sucursal" | "sin_sucursal"
  usuarios: UsuarioAgrupado[]
}

const ADMIN_GROUP: Omit<GrupoUsuarios, "usuarios"> = {
  id: "administracion-general",
  nombre: "Administración general",
  tipo: "administracion",
}

const UNASSIGNED_GROUP: Omit<GrupoUsuarios, "usuarios"> = {
  id: "sin-sucursal",
  nombre: "Sin sucursal",
  tipo: "sin_sucursal",
}

function compareUsers(a: UsuarioAgrupado, b: UsuarioAgrupado) {
  return `${a.apellido} ${a.nombre}`.localeCompare(`${b.apellido} ${b.nombre}`, "es")
}

export function agruparUsuariosPorSucursal(usuarios: UsuarioPanel[]): GrupoUsuarios[] {
  const administracion: UsuarioAgrupado[] = []
  const sinSucursal: UsuarioAgrupado[] = []
  const sucursales = new Map<string, GrupoUsuarios>()

  for (const usuario of usuarios) {
    if (usuario.sucursales.length === 0) {
      const agrupado = { ...usuario, asignacion: null }
      if (usuario.rol === "admin_taller") {
        administracion.push(agrupado)
      } else {
        sinSucursal.push(agrupado)
      }
      continue
    }

    for (const asignacion of usuario.sucursales) {
      const group = sucursales.get(asignacion.id) ?? {
        id: asignacion.id,
        nombre: asignacion.nombre,
        tipo: "sucursal" as const,
        usuarios: [],
      }
      group.usuarios.push({ ...usuario, asignacion })
      sucursales.set(asignacion.id, group)
    }
  }

  const branchGroups = [...sucursales.values()]
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"))
    .map((group) => ({ ...group, usuarios: group.usuarios.toSorted(compareUsers) }))

  return [
    ...(administracion.length
      ? [{ ...ADMIN_GROUP, usuarios: administracion.toSorted(compareUsers) }]
      : []),
    ...branchGroups,
    ...(sinSucursal.length
      ? [{ ...UNASSIGNED_GROUP, usuarios: sinSucursal.toSorted(compareUsers) }]
      : []),
  ]
}

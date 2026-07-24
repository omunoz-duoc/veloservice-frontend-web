import { describe, expect, it } from "vitest"
import type { UsuarioPanel } from "../../types/configuracion.types"
import { agruparUsuariosPorSucursal } from "./usuarios.utils"

const usuarios: UsuarioPanel[] = [
  {
    id: "admin",
    nombre: "Valentina",
    apellido: "Rojas",
    email: "admin@taller.cl",
    rol: "admin_taller",
    activo: true,
    sucursales: [],
  },
  {
    id: "multi",
    nombre: "Matias",
    apellido: "Fuentes",
    email: "matias@taller.cl",
    rol: "jefe_taller",
    activo: true,
    sucursales: [
      { id: "s-2", nombre: "Providencia", esPrincipal: true },
      { id: "s-1", nombre: "La Florida", esPrincipal: false },
    ],
  },
  {
    id: "unassigned",
    nombre: "Ana",
    apellido: "Zúñiga",
    email: "ana@taller.cl",
    rol: "mecanico",
    activo: false,
    sucursales: [],
  },
]

describe("agruparUsuariosPorSucursal", () => {
  it("groups global admins, repeats multi-branch users, and keeps unassigned users", () => {
    const groups = agruparUsuariosPorSucursal(usuarios)

    expect(groups.map((group) => group.nombre)).toEqual([
      "Administración general",
      "La Florida",
      "Providencia",
      "Sin sucursal",
    ])
    expect(groups[0].usuarios.map((user) => user.id)).toEqual(["admin"])
    expect(groups[1].usuarios.map((user) => user.id)).toEqual(["multi"])
    expect(groups[2].usuarios.map((user) => user.id)).toEqual(["multi"])
    expect(groups[1].usuarios[0].asignacion?.esPrincipal).toBe(false)
    expect(groups[2].usuarios[0].asignacion?.esPrincipal).toBe(true)
    expect(groups[3].usuarios[0]).toMatchObject({ id: "unassigned", activo: false })
  })

  it("sorts users by surname and name inside each branch", () => {
    const sameBranch: UsuarioPanel[] = [
      {
        ...usuarios[1],
        id: "z",
        nombre: "Zoé",
        apellido: "Álvarez",
        sucursales: [{ id: "s-1", nombre: "Centro", esPrincipal: true }],
      },
      {
        ...usuarios[1],
        id: "a",
        nombre: "Ana",
        apellido: "Bravo",
        sucursales: [{ id: "s-1", nombre: "Centro", esPrincipal: true }],
      },
    ]

    expect(
      agruparUsuariosPorSucursal(sameBranch)[0].usuarios.map((user) => user.id)
    ).toEqual(["z", "a"])
  })
})

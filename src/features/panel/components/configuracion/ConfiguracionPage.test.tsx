import { fireEvent, render, screen } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { useAuthStore } from "@/features/auth/store/auth.store"
import type { User } from "@/features/auth/types/auth.types"
import { ConfiguracionPage } from "./ConfiguracionPage"

vi.mock("./PerfilNegocioSection", () => ({
  PerfilNegocioSection: () => <div>Contenido negocio</div>,
}))
vi.mock("./MiPerfilSection", () => ({
  MiPerfilSection: () => <div>Contenido perfil</div>,
}))
vi.mock("./UsuariosSection", () => ({
  UsuariosSection: () => <div>Contenido usuarios</div>,
}))
vi.mock("./PlanSection", () => ({
  PlanSection: () => <div>Contenido plan</div>,
}))

function userWithRole(rol: string): User {
  return {
    id: "user-1",
    nombre: "Usuario",
    apellido: "Prueba",
    token: "token",
    rol,
    ambito: rol === "admin_taller" ? "taller" : "sucursal",
    tallerId: "taller-1",
    sucursalId: rol === "admin_taller" ? null : "sucursal-1",
  }
}

describe("ConfiguracionPage access", () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, isLoading: false, error: null })
  })

  it("shows every section to admin_taller and starts in Negocio", () => {
    useAuthStore.setState({ user: userWithRole("admin_taller") })
    render(<ConfiguracionPage />)

    expect(screen.getByRole("tab", { name: "Negocio" })).toBeInTheDocument()
    expect(screen.getByRole("tab", { name: "Mi perfil" })).toBeInTheDocument()
    expect(screen.getByRole("tab", { name: "Usuarios" })).toBeInTheDocument()
    expect(screen.getByRole("tab", { name: "Plan" })).toBeInTheDocument()
    expect(screen.getByText("Contenido negocio")).toBeInTheDocument()

    fireEvent.click(screen.getByRole("tab", { name: "Usuarios" }))
    expect(screen.getByText("Contenido usuarios")).toBeInTheDocument()
  })

  it.each(["jefe_taller", "mecanico", "recepcionista"])(
    "shows only Mi perfil to %s",
    (rol) => {
      useAuthStore.setState({ user: userWithRole(rol) })
      render(<ConfiguracionPage />)

      expect(screen.getByRole("tab", { name: "Mi perfil" })).toBeInTheDocument()
      expect(screen.queryByRole("tab", { name: "Negocio" })).not.toBeInTheDocument()
      expect(screen.queryByRole("tab", { name: "Usuarios" })).not.toBeInTheDocument()
      expect(screen.queryByRole("tab", { name: "Plan" })).not.toBeInTheDocument()
      expect(screen.getByText("Contenido perfil")).toBeInTheDocument()
    }
  )
})

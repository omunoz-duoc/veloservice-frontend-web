import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { useAuthStore } from "@/features/auth/store/auth.store"
import { httpClient } from "./http-client"

describe("httpClient branch scoping", () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: {
        id: "admin-1",
        nombre: "Admin",
        apellido: "Taller",
        token: "token",
        rol: "admin_taller",
        ambito: "taller",
        tallerId: "taller-1",
        sucursalId: null,
      },
      isLoading: false,
      error: null,
    })
    localStorage.setItem(
      "vs-sucursales",
      JSON.stringify({
        sucursales: [{ id: "sucursal-1", nombre: "Centro" }],
        activa: "sucursal-1",
      })
    )
  })

  afterEach(() => {
    localStorage.clear()
    vi.unstubAllGlobals()
  })

  it("omits the active sucursal from workshop-wide GET requests", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([]),
      })
    )

    await httpClient.get("configuracion/usuarios", { attachSucursal: false })

    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/configuracion\/usuarios$/),
      expect.objectContaining({
        headers: { Authorization: "Bearer token" },
      })
    )
  })

  it("does not inject sucursalId into workshop-wide mutation bodies", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve("{}"),
      })
    )

    await httpClient.patch(
      "configuracion/taller",
      { nombre: "VeloService" },
      { attachSucursal: false }
    )

    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/configuracion\/taller$/),
      expect.objectContaining({
        body: JSON.stringify({ nombre: "VeloService" }),
      })
    )
  })
})

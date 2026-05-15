import { describe, it, expect } from "vitest"
import { serviciosMock } from "./servicios.mock"
import { serviciosService } from "./servicios.provider"

describe("serviciosMock", () => {
  it("getServicios resolves with ServiciosListResponse shape", async () => {
    const result = await serviciosMock.getServicios()
    expect(result).toHaveProperty("total")
    expect(Array.isArray(result.servicios)).toBe(true)
  })

  it("createServicio resolves without error", async () => {
    await expect(
      serviciosMock.createServicio({
        cat: "rapidos", nombre: "Ajuste suspensión", desc: "Revisión de horquilla",
        precio: 10000, dur: 20, incluye: [], skills: [], activo: true,
      })
    ).resolves.toBeUndefined()
  })
})

describe("serviciosService provider", () => {
  it("exports serviciosService with getServicios", () => {
    expect(typeof serviciosService.getServicios).toBe("function")
  })
})

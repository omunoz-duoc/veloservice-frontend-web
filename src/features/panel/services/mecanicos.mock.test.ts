import { describe, it, expect } from "vitest"
import { mecanicosMock } from "./mecanicos.mock"
import { mecanicosService } from "./mecanicos.provider"

describe("mecanicosMock", () => {
  it("getMecanicosActivos resolves with MecanicosListResponse shape", async () => {
    const result = await mecanicosMock.getMecanicosActivos()
    expect(result).toHaveProperty("total")
    expect(Array.isArray(result.mecanicos)).toBe(true)
  })

  it("cambiarEstado resolves without error", async () => {
    await expect(
      mecanicosMock.cambiarEstado("m-001", { estado: "activo" })
    ).resolves.toBeUndefined()
  })

  it("cambiarRol resolves without error", async () => {
    await expect(
      mecanicosMock.cambiarRol("m-001", { rol: "Mecánico" })
    ).resolves.toBeUndefined()
  })
})

describe("mecanicosService provider", () => {
  it("exports mecanicosService with getMecanicosActivos", () => {
    expect(typeof mecanicosService.getMecanicosActivos).toBe("function")
  })
})

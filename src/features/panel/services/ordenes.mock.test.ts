import { describe, it, expect } from "vitest"
import { ordenesMock } from "./ordenes.mock"
import { ordenesService } from "./ordenes.provider"

describe("ordenesMock", () => {
  it("getOrdenes resolves with OrdenesListResponse shape", async () => {
    const result = await ordenesMock.getOrdenes()
    expect(result).toHaveProperty("total")
    expect(Array.isArray(result.ordenes)).toBe(true)
  })

  it("getOrdenesMetricas resolves with OrdenesMetricas shape", async () => {
    const result = await ordenesMock.getOrdenesMetricas()
    expect(result).toHaveProperty("recibidas")
    expect(result).toHaveProperty("enProceso")
    expect(result).toHaveProperty("listas")
    expect(result).toHaveProperty("entregadas")
  })

  it("createOrden resolves without error", async () => {
    await expect(
      ordenesMock.createOrden({
        servicioIds: ["s-001"], prioridad: "media",
        fechaEstimada: "2026-05-20", mecanicoId: "m-001",
        bicicletaId: "b-001", descripcion: "Test", estado: "recibida"
      })
    ).resolves.toBeUndefined()
  })

  it("bulkUpdateOrdenes resolves without error", async () => {
    await expect(
      ordenesMock.bulkUpdateOrdenes({ ids: ["OT-0001"], estado: "recibida" })
    ).resolves.toBeUndefined()
  })

  it("bulkUpdateOrdenes with mecanicoId resolves without error", async () => {
    await expect(
      ordenesMock.bulkUpdateOrdenes({ ids: ["OT-0001", "OT-0002"], mecanicoId: "m-001" })
    ).resolves.toBeUndefined()
  })
})

describe("ordenesService provider", () => {
  it("exports ordenesService with getOrdenes", () => {
    expect(typeof ordenesService.getOrdenes).toBe("function")
  })
})

import { describe, it, expect } from "vitest"
import { clientesNuevaOTMock } from "./clientes.nueva-ot.mock"

describe("clientesNuevaOTMock.getClientesConBicicletas", () => {
  it("returns total and clientes array", async () => {
    const res = await clientesNuevaOTMock.getClientesConBicicletas()
    expect(res.clientes.length).toBeGreaterThan(0)
    expect(res.total).toBe(res.clientes.length)
  })

  it("each cliente has required fields", async () => {
    const res = await clientesNuevaOTMock.getClientesConBicicletas()
    for (const c of res.clientes) {
      expect(c.id).toBeTruthy()
      expect(c.nombre).toBeTruthy()
      expect(c.rut).toBeTruthy()
      expect(Array.isArray(c.bicicletas)).toBe(true)
    }
  })

  it("each bicicleta has required fields", async () => {
    const res = await clientesNuevaOTMock.getClientesConBicicletas()
    for (const c of res.clientes) {
      for (const b of c.bicicletas) {
        expect(b.id).toBeTruthy()
        expect(b.marca).toBeTruthy()
        expect(b.modelo).toBeTruthy()
        expect(b.tipo).toBeTruthy()
        expect(b.color).toBeTruthy()
      }
    }
  })

  it("total clientes with bicicletas is consistent", async () => {
    const res = await clientesNuevaOTMock.getClientesConBicicletas()
    const withBikes = res.clientes.filter(c => c.bicicletas.length > 0)
    expect(withBikes.length).toBeGreaterThan(0)
  })
})

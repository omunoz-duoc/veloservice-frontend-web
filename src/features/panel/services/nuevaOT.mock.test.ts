import { describe, it, expect } from "vitest"
import { nuevaOTMock } from "./nuevaOT.mock"

describe("nuevaOTMock.getClientes", () => {
  it("returns a non-empty clientes array with lean fields", async () => {
    const { clientes } = await nuevaOTMock.getClientes()
    expect(clientes.length).toBeGreaterThan(0)
    for (const c of clientes) {
      expect(c.id).toBeTruthy()
      expect(c.nombre).toBeTruthy()
      expect(c.rut).toBeTruthy()
    }
  })
})

describe("nuevaOTMock.getBicicletas", () => {
  it("returns bicicletas for a known cliente", async () => {
    const { clientes } = await nuevaOTMock.getClientes()
    const { bicicletas } = await nuevaOTMock.getBicicletas(clientes[0].id)
    expect(Array.isArray(bicicletas)).toBe(true)
    for (const b of bicicletas) {
      expect(b.id).toBeTruthy()
      expect(b.marca).toBeTruthy()
      expect(b.modelo).toBeTruthy()
      expect(b.tipo).toBeTruthy()
      expect(b.color).toBeTruthy()
    }
  })

  it("returns empty array for an unknown cliente", async () => {
    const { bicicletas } = await nuevaOTMock.getBicicletas("does-not-exist")
    expect(bicicletas).toEqual([])
  })
})

describe("nuevaOTMock catalogs", () => {
  it("getTipos returns tipos with codigo + nombre", async () => {
    const { tipos } = await nuevaOTMock.getTipos()
    expect(tipos.length).toBeGreaterThan(0)
    for (const t of tipos) {
      expect(t.id).toBeTruthy()
      expect(t.codigo).toBeTruthy()
      expect(t.nombre).toBeTruthy()
    }
  })

  it("getMecanicos returns mecanicos with id + nombre", async () => {
    const { mecanicos } = await nuevaOTMock.getMecanicos()
    expect(mecanicos.length).toBeGreaterThan(0)
    for (const m of mecanicos) {
      expect(m.id).toBeTruthy()
      expect(m.nombre).toBeTruthy()
    }
  })

  it("getProductos returns productos with precioVenta + stock", async () => {
    const { productos } = await nuevaOTMock.getProductos()
    expect(productos.length).toBeGreaterThan(0)
    for (const p of productos) {
      expect(p.id).toBeTruthy()
      expect(p.nombre).toBeTruthy()
      expect(typeof p.precioVenta).toBe("number")
      expect(typeof p.stock).toBe("number")
    }
  })
})

describe("nuevaOTMock.createOrden", () => {
  it("returns id and numeroOrden", async () => {
    const res = await nuevaOTMock.createOrden({
      clienteId: "CL-00121",
      bicicletaId: "BC-101",
      tipoTrabajo: "mantencion",
      prioridad: "media",
      fechaPrometida: "2026-06-10",
      diagnosticoInicial: "Test",
      servicios: [{ servicioId: "S1" }],
      productos: [],
    })
    expect(res.id).toBeTruthy()
    expect(res.numeroOrden).toMatch(/^OT-/)
  })
})

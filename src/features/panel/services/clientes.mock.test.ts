import { describe, it, expect } from "vitest"
import { clientesMock } from "./clientes.mock"
import { clientesService } from "./clientes.provider"

describe("clientesMock", () => {
  it("getClientes resolves with ClientesListResponse shape", async () => {
    const result = await clientesMock.getClientes()
    expect(result).toHaveProperty("total")
    expect(Array.isArray(result.clientes)).toBe(true)
  })

  it("returns 12 clientes matching the mock data", async () => {
    const result = await clientesMock.getClientes()
    expect(result.total).toBe(12)
    expect(result.clientes).toHaveLength(12)
  })

  it("each cliente has required service fields", async () => {
    const { clientes } = await clientesMock.getClientes()
    for (const c of clientes) {
      expect(c).toHaveProperty("id")
      expect(c).toHaveProperty("nombre")
      expect(c).toHaveProperty("apellido")
      expect(c).toHaveProperty("tipo")
      expect(c).toHaveProperty("rut")
      expect(c).toHaveProperty("email")
      expect(c).toHaveProperty("telefono")
      expect(c).toHaveProperty("bicicletasCount")
      expect(c).toHaveProperty("ordenesCount")
      expect(c).toHaveProperty("totalGastado")
    }
  })

  it("each cliente has extended UI fields", async () => {
    const { clientes } = await clientesMock.getClientes()
    for (const c of clientes) {
      expect(c).toHaveProperty("ciudad")
      expect(c).toHaveProperty("canal")
      expect(c).toHaveProperty("consentEmail")
    }
  })

  it("createCliente resolves without error", async () => {
    await expect(
      clientesMock.createCliente({
        nombre: "Andrés",
        apellido: "Muñoz",
        rut: "11.111.111-1",
        email: "andres@test.cl",
        telefono: "+56912345678",
      })
    ).resolves.toBeUndefined()
  })
})

describe("clientesService provider", () => {
  it("exports clientesService with getClientes", () => {
    expect(typeof clientesService.getClientes).toBe("function")
  })
})

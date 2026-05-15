import { describe, it, expect } from "vitest"
import { clientesMock } from "./clientes.mock"
import { clientesService } from "./clientes.provider"

describe("clientesMock", () => {
  it("getClientes resolves with ClientesListResponse shape", async () => {
    const result = await clientesMock.getClientes()
    expect(result).toHaveProperty("total")
    expect(Array.isArray(result.clientes)).toBe(true)
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

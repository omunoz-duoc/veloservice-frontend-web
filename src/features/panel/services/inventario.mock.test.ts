import { describe, it, expect } from "vitest"
import { inventarioMock } from "./inventario.mock"
import { inventarioService } from "./inventario.provider"

describe("inventarioMock", () => {
  it("getProductos resolves with ProductosListResponse shape", async () => {
    const result = await inventarioMock.getProductos()
    expect(result).toHaveProperty("total")
    expect(Array.isArray(result.productos)).toBe(true)
  })

  it("getMetricas resolves with InventarioMetricas shape", async () => {
    const result = await inventarioMock.getMetricas()
    expect(result).toHaveProperty("valorInventario")
    expect(result).toHaveProperty("enStock")
    expect(result).toHaveProperty("stockBajo")
    expect(result).toHaveProperty("agotados")
  })

  it("createProducto resolves without error", async () => {
    await expect(
      inventarioMock.createProducto({
        nombre: "Cadena Shimano", sku: "SH-CN-HG701", categoria: "transmision",
        costoUnitario: 10000, precioAsignado: 15000, stock: 10
      })
    ).resolves.toBeUndefined()
  })
})

describe("inventarioService provider", () => {
  it("exports inventarioService with getProductos", () => {
    expect(typeof inventarioService.getProductos).toBe("function")
  })
})

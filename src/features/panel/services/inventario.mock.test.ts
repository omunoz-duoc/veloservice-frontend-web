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
        nombre: "Cadena Shimano",
        sku: "SH-CN-HG701",
        marca: "Shimano",
        unidadMedida: "unidad",
        precioCosto: 10000,
        precioVenta: 15000,
        stock: 10,
        stockMinimo: 2,
      })
    ).resolves.toHaveProperty("id")
  })

  it("updateProducto resolves with updated product", async () => {
    await expect(
      inventarioMock.updateProducto("producto-1", {
        nombre: "Cadena Shimano",
        sku: "SH-CN-HG701",
        marca: "Shimano",
        unidadMedida: "unidad",
        precioCosto: 10000,
        precioVenta: 15000,
        stock: 10,
        stockMinimo: 2,
      })
    ).resolves.toHaveProperty("id", "producto-1")
  })
})

describe("inventarioService provider", () => {
  it("exports inventarioService with getProductos", () => {
    expect(typeof inventarioService.getProductos).toBe("function")
  })
})

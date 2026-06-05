import { describe, it, expect } from "vitest"
import { inventarioMock } from "./inventario.mock"
import { inventarioService } from "./inventario.provider"
import { mapProductosResponse } from "./inventario.service"

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

describe("mapProductosResponse", () => {
  it("maps legacy backend price fields", () => {
    const result = mapProductosResponse({
      total: 1,
      productos: [{
        id: "producto-legacy",
        nombre: "Pastillas de freno",
        sku: "SKU-001",
        categoria: "Frenos",
        costo_unitario: 7000,
        precio_asignado: 12500,
        stock: 10,
      }],
    })

    expect(result.productos[0].costoUnitario).toBe(7000)
    expect(result.productos[0].precioAsignado).toBe(12500)
  })

  it("maps schema_v3 price fields", () => {
    const result = mapProductosResponse({
      total: 1,
      productos: [{
        id: "producto-schema-v3",
        nombre: "Cadena",
        sku: "SKU-002",
        categoria: "Transmision",
        precio_costo: 9000,
        precio_venta: 16000,
        stock: 4,
      }],
    })

    expect(result.productos[0].costoUnitario).toBe(9000)
    expect(result.productos[0].precioAsignado).toBe(16000)
  })

  it("maps data-wrapped product responses", () => {
    const result = mapProductosResponse({
      data: {
        total: 1,
        productos: [{
          id: "producto-data",
          nombre: "Cadena Shimano HG601 11v",
          sku: "SKU-003",
          categoria: "Transmision",
          precio_costo: 8000,
          precio_venta: 14000,
          stock: 6,
        }],
      },
    })

    expect(result.total).toBe(1)
    expect(result.productos[0].nombre).toBe("Cadena Shimano HG601 11v")
    expect(result.productos[0].precioAsignado).toBe(14000)
  })

  it("maps content product responses", () => {
    const result = mapProductosResponse({
      total: 1,
      content: [{
        id: "producto-content",
        nombre: "Cable de cambios",
        sku: "SKU-004",
        categoria: "Transmision",
        precioCosto: 3000,
        precioVenta: 6500,
        stock: 3,
      }],
    })

    expect(result.total).toBe(1)
    expect(result.productos[0].costoUnitario).toBe(3000)
    expect(result.productos[0].precioAsignado).toBe(6500)
  })

  it("maps direct product arrays", () => {
    const result = mapProductosResponse([{
      id: "producto-array",
      nombre: "Pastillas",
      sku: "SKU-005",
      categoria: "Frenos",
      precio_costo: 4000,
      precio_venta: 9000,
      stock: 2,
    }])

    expect(result.total).toBe(1)
    expect(result.productos).toHaveLength(1)
  })
})

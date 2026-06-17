import { describe, expect, it } from "vitest"
import { buildUpdateOrdenPayload, hasUpdateOrdenPayloadChanges } from "./useOrdenes"
import type { OrdenTrabajo } from "@/features/panel/components/ordenes/ordenes.types"
import type { OrdenProductoCambioPayload, OrdenServicioCambioPayload } from "@/features/panel/types/ordenes.types"

const baseOrden: OrdenTrabajo = {
  id: "OT-0001",
  backendId: "11111111-1111-1111-8111-111111111111",
  tipo: {
    id: "tipo-mantencion",
    codigo: "mantencion",
    nombre: "Mantencion",
  },
  estado: "recibido",
  prioridad: "media",
  fechaIngreso: "17 Jun 2026",
  fechaEstimada: "2026-06-20",
  mecanicoId: "22222222-2222-1222-8222-222222222222",
  clienteNombre: "Ana Lopez",
  biciMarca: "Trek Marlin",
  biciTipo: "MTB",
  biciColor: "Rojo",
  descripcion: "Ajuste general",
}

describe("buildUpdateOrdenPayload", () => {
  it("returns an empty payload for unchanged scalar fields and line items", () => {
    const payload = buildUpdateOrdenPayload(baseOrden, baseOrden)

    expect(payload).toEqual({})
    expect(hasUpdateOrdenPayloadChanges(payload)).toBe(false)
  })

  it("sends estadoCodigo and observation when only estado changes", () => {
    const payload = buildUpdateOrdenPayload({ ...baseOrden, estado: "proceso" }, baseOrden)

    expect(payload).toEqual({
      estadoCodigo: "en_reparacion",
      estadoObservacion: "Cambio de estado desde panel web",
    })
    expect(hasUpdateOrdenPayloadChanges(payload)).toBe(true)
  })

  it("does not send untouched tipoCodigo or prioridad with an estado-only change", () => {
    const payload = buildUpdateOrdenPayload({ ...baseOrden, estado: "listo" }, baseOrden)

    expect(payload).not.toHaveProperty("tipoCodigo")
    expect(payload).not.toHaveProperty("prioridad")
  })

  it("sends tipoCodigo only when tipo changes", () => {
    const payload = buildUpdateOrdenPayload(
      {
        ...baseOrden,
        tipo: {
          ...baseOrden.tipo,
          codigo: "reparacion",
          nombre: "Reparacion",
        },
      },
      baseOrden
    )

    expect(payload).toEqual({ tipoCodigo: "reparacion" })
  })

  it("sends prioridad only when prioridad changes", () => {
    const payload = buildUpdateOrdenPayload({ ...baseOrden, prioridad: "alta" }, baseOrden)

    expect(payload).toEqual({ prioridad: "alta" })
  })

  it("sends mecanicoId only when changed to a valid UUID", () => {
    const validMecanicoId = "33333333-3333-1333-8333-333333333333"
    const validPayload = buildUpdateOrdenPayload({ ...baseOrden, mecanicoId: validMecanicoId }, baseOrden)
    const invalidPayload = buildUpdateOrdenPayload({ ...baseOrden, mecanicoId: "Sin asignar" }, baseOrden)

    expect(validPayload).toEqual({ mecanicoId: validMecanicoId })
    expect(invalidPayload).toEqual({})
    expect(hasUpdateOrdenPayloadChanges(invalidPayload)).toBe(false)
  })

  it("keeps service and product line changes in the same update payload", () => {
    const serviciosCambios: OrdenServicioCambioPayload[] = [
      { accion: "ELIMINAR", lineaId: "linea-servicio-1" },
    ]
    const productosCambios: OrdenProductoCambioPayload[] = [
      {
        accion: "ACTUALIZAR",
        lineaId: "linea-producto-1",
        cantidad: 2,
        proporcionadoPorCliente: false,
      },
    ]
    const payload = buildUpdateOrdenPayload(
      {
        ...baseOrden,
        serviciosCambios,
        productosCambios,
      },
      baseOrden
    )

    expect(payload).toEqual({ serviciosCambios, productosCambios })
    expect(hasUpdateOrdenPayloadChanges(payload)).toBe(true)
  })
})

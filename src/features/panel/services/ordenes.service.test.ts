import { describe, expect, it } from "vitest"
import { mapApiOrden } from "./ordenes.service"
import type { OrdenTrabajo } from "../types/ordenes.types"

const baseOrden: OrdenTrabajo = {
  numeroOrden: "OT-0001",
  tipo: "Mantencion",
  fechaIngreso: "2026-06-02T14:30:00.000Z",
  mecanico: "Javier Bravo",
  cliente: "Ana Lopez",
  bicicleta: {
    marca: "Trek",
    modelo: "Marlin 7",
    tipo: "MTB",
    color: "Rojo",
  },
  diagnosticoInicial: "Ajuste general",
  estado: "En Proceso",
  prioridad: "Media",
}

describe("mapApiOrden", () => {
  it("maps nested backend orders and preserves backendId for detail requests", () => {
    const orden = mapApiOrden(
      {
        id: "uuid-orden-1",
        numeroOrden: "OT-0099",
        tipo: { id: "tipo-1", codigo: "MANTENCION", nombre: "Mantencion" },
        estado: { id: "estado-1", codigo: "EN_PROCESO", nombre: "En proceso" },
        fechaIngreso: "2026-06-02T14:30:00.000Z",
        fechaPrometida: "2026-06-05T00:00:00.000Z",
        fechaEntrega: null,
        mecanico: { id: "mec-1", nombre: "Javier", apellido: "Bravo" },
        cliente: {
          id: "cliente-1",
          nombre: "Ana",
          apellido: "Lopez",
          telefono: "+56912345678",
          email: "ana@example.com",
          rut: "11111111-1",
        },
        bicicleta: {
          id: "bici-1",
          marca: "Trek",
          modelo: "Marlin 7",
          tipo: "MTB",
          aro: "29",
          color: "Rojo",
          numeroSerie: "SER-1",
        },
        diagnosticoInicial: null,
        diagnosticoFinal: null,
        observacionesCliente: "Ruido al pedalear",
        prioridad: undefined,
      },
      0
    )

    expect(orden.id).toBe("OT-0099")
    expect(orden.backendId).toBe("uuid-orden-1")
    expect(orden.tipo.codigo).toBe("mantencion")
    expect(orden.estado).toBe("proceso")
    expect(orden.mecanicoId).toBe("Javier Bravo")
    expect(orden.clienteNombre).toBe("Ana Lopez")
    expect(orden.biciMarca).toBe("Trek Marlin 7")
    expect(orden.biciTalla).toBe("29")
    expect(orden.descripcion).toBe("Ruido al pedalear")
  })

  it("normalizes known backend tipo and estado values", () => {
    const orden = mapApiOrden(
      {
        ...baseOrden,
        tipo: "Mantención",
        estado: "En Proceso",
      },
      0
    )

    expect(orden.tipo.codigo).toBe("mantencion")
    expect(orden.tipo.nombre).toBe("Mantención")
    expect(orden.estado).toBe("proceso")
  })

  it("keeps unknown tipo values without crashing chip config lookups", () => {
    const orden = mapApiOrden(
      {
        ...baseOrden,
        tipo: "Ajuste Premium",
      },
      0
    )

    expect(orden.tipo.codigo).toBe("ajuste_premium")
    expect(orden.tipo.nombre).toBe("Ajuste Premium")
  })
})

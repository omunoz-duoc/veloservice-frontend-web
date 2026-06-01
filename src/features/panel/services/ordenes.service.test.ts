import { describe, expect, it } from "vitest"
import {
  mapOrdenReadToOrdenTrabajo,
  type OrdenReadResponse,
} from "./ordenes.service"

const baseOrden: OrdenReadResponse = {
  id: "uuid-1",
  numeroOrden: "OT-0001",
  tallerId: "taller-1",
  sucursalId: "sucursal-1",
  estado: { id: "estado-1", codigo: "EN_PROCESO", nombre: "En proceso" },
  tipo: { id: "tipo-1", codigo: "MANTENCION", nombre: "Mantencion" },
  fechaIngreso: "2026-05-31T14:30:00.000Z",
  fechaPrometida: "2026-06-02T00:00:00.000Z",
  fechaEntrega: null,
  diagnosticoInicial: "Ajuste general",
  diagnosticoFinal: null,
  observacionesCliente: "Ruido al frenar",
  bicicleta: {
    id: "bici-1",
    marca: "Trek",
    modelo: "Marlin 7",
    tipo: "MTB",
    aro: "29",
    color: "Rojo",
    numeroSerie: "SER-1",
  },
  cliente: {
    id: "cliente-1",
    nombre: "Ana",
    apellido: "Lopez",
    telefono: "+56912345678",
    email: "ana@example.com",
    rut: "11111111-1",
  },
  mecanico: {
    id: "mec-1",
    nombre: "Pedro",
    apellido: "Soto",
  },
}

describe("mapOrdenReadToOrdenTrabajo", () => {
  it("maps backend list item to the UI order shape", () => {
    const orden = mapOrdenReadToOrdenTrabajo(baseOrden)

    expect(orden.id).toBe("OT-0001")
    expect(orden.backendId).toBe("uuid-1")
    expect(orden.tipo).toBe("mantencion")
    expect(orden.estado).toBe("proceso")
    expect(orden.prioridad).toBe("media")
    expect(orden.clienteNombre).toBe("Ana Lopez")
    expect(orden.biciMarca).toBe("Trek Marlin 7")
    expect(orden.biciTipo).toBe("MTB")
    expect(orden.biciTalla).toBe("29")
    expect(orden.biciColor).toBe("Rojo")
    expect(orden.biciNumSerie).toBe("SER-1")
    expect(orden.descripcion).toBe("Ajuste general")
    expect(orden.mecanicoId).toBe("mec-1")
  })

  it("uses fallbacks for optional fields", () => {
    const orden = mapOrdenReadToOrdenTrabajo({
      ...baseOrden,
      numeroOrden: "",
      estado: { id: "estado-2", codigo: "DESCONOCIDO", nombre: "Desconocido" },
      tipo: { id: "tipo-2", codigo: "OTRO", nombre: "Otro" },
      fechaPrometida: null,
      diagnosticoInicial: null,
      observacionesCliente: null,
      bicicleta: {
        ...baseOrden.bicicleta,
        modelo: "",
        tipo: null,
        aro: null,
        color: null,
        numeroSerie: null,
      },
      cliente: {
        ...baseOrden.cliente,
        telefono: null,
        email: null,
      },
      mecanico: null,
    })

    expect(orden.id).toBe("uuid-1")
    expect(orden.estado).toBe("recibido")
    expect(orden.tipo).toBe("diagnostico")
    expect(orden.fechaEstimada).toBe("-")
    expect(orden.descripcion).toBe("Sin descripcion")
    expect(orden.mecanicoId).toBe("--")
    expect(orden.biciTipo).toBe("Otro")
    expect(orden.biciTalla).toBe("-")
    expect(orden.biciColor).toBe("-")
  })
})

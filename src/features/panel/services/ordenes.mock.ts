import type { IOrdenesService, OrdenTrabajo, OrdenTrabajoDetalle, OrdenesListResponse, OrdenesMetricas } from "../types/ordenes.types"
import ordenesData from "./ordenes.mock.data.json"
import metricasData from "./ordenes.metricas.mock.data.json"

let ordenes = [...(ordenesData.ordenes as OrdenTrabajo[])]

async function mockFetch<T>(data: T, delayMs = 250): Promise<T> {
  await new Promise(r => setTimeout(r, delayMs))
  return data
}

const ESTADO_DETALLE: Record<string, OrdenTrabajoDetalle["estado"]> = {
  recibido: { id: "estado-recibido", codigo: "recibido", nombre: "Recibido" },
  proceso: { id: "estado-reparacion", codigo: "en_reparacion", nombre: "En reparacion" },
  "en proceso": { id: "estado-reparacion", codigo: "en_reparacion", nombre: "En reparacion" },
  "en_proceso": { id: "estado-reparacion", codigo: "en_reparacion", nombre: "En reparacion" },
  "en_reparacion": { id: "estado-reparacion", codigo: "en_reparacion", nombre: "En reparacion" },
  espera: { id: "estado-espera", codigo: "en_espera", nombre: "En espera" },
  "en_espera": { id: "estado-espera", codigo: "en_espera", nombre: "En espera" },
  "espera_repuesto": { id: "estado-espera", codigo: "en_espera", nombre: "En espera" },
  listo: { id: "estado-listo", codigo: "listo", nombre: "Listo" },
  entregado: { id: "estado-entregado", codigo: "entregado", nombre: "Entregado" },
}

const TIPO_LABELS: Record<string, string> = {
  diagnostico: "Diagnostico",
  mantencion: "Mantencion",
  reparacion: "Reparacion",
  overhaul: "Overhaul",
  garantia: "Garantia",
  armado: "Armado",
}

function splitName(nombreCompleto: string) {
  const parts = nombreCompleto.trim().split(/\s+/)
  return {
    nombre: parts[0] ?? "",
    apellido: parts.slice(1).join(" "),
  }
}

function toDetalle(orden: OrdenTrabajo): OrdenTrabajoDetalle {
  const cliente = splitName(orden.cliente)
  const mecanico = splitName(orden.mecanico)
  const numeroOrden = orden.numeroOrden ?? "OT-0000"
  const tipoCodigo = orden.tipo.toLowerCase()

  return {
    id: numeroOrden,
    numeroOrden,
    tallerId: "mock-taller",
    sucursalId: "mock-sucursal",
    estado: ESTADO_DETALLE[orden.estado.toLowerCase()] ?? ESTADO_DETALLE.recibido,
    tipo: {
      id: `tipo-${tipoCodigo}`,
      codigo: tipoCodigo,
      nombre: TIPO_LABELS[tipoCodigo] ?? orden.tipo,
    },
    fechaIngreso: orden.fechaIngreso,
    fechaPrometida: orden.fechaIngreso,
    fechaEntrega: orden.estado === "entregado" ? orden.fechaIngreso : null,
    diagnosticoInicial: orden.diagnosticoInicial,
    diagnosticoFinal: orden.estado === "listo" || orden.estado === "entregado" ? "Trabajo completado y validado en banco." : null,
    observacionesCliente: "Sin observaciones del cliente.",
    bicicleta: {
      id: `bici-${numeroOrden}`,
      marca: orden.bicicleta.marca,
      modelo: orden.bicicleta.modelo,
      tipo: orden.bicicleta.tipo,
      color: orden.bicicleta.color,
      numeroSerie: "",
    },
    cliente: {
      id: `cliente-${numeroOrden}`,
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      telefono: "",
      email: "",
      rut: "",
    },
    mecanico: {
      id: `mecanico-${numeroOrden}`,
      nombre: mecanico.nombre,
      apellido: mecanico.apellido,
    },
    prioridad: orden.prioridad?.toLowerCase() ?? "media",
    comentarios: [],
    multimedia: [],
    productos: [],
    servicios: [
      {
        id: `servicio-${numeroOrden}`,
        servicioId: "servicio-mock",
        nombre: orden.tipo,
        precioBase: 25900,
      },
    ],
  }
}

export const ordenesMock: IOrdenesService = {
  async getOrdenes() {
    return mockFetch({ total: ordenes.length, ordenes } as OrdenesListResponse)
  },
  async getOrdenesUrgentes() {
    const urgentes = ordenes.filter(o => o.prioridad === "alta")
    return mockFetch({ total: urgentes.length, ordenes: urgentes } as OrdenesListResponse)
  },
  async getOrdenesMetricas() {
    return mockFetch(metricasData as OrdenesMetricas)
  },
  async createOrden(_payload) {
    return mockFetch(undefined as void)
  },
  async getOrdenById(id) {
    return mockFetch(toDetalle(ordenes.find(o => o.numeroOrden === id) ?? ordenes[0]))
  },
  async updateOrden(id, payload) {
    const idx = ordenes.findIndex(o => o.numeroOrden === id)
    const current = idx >= 0 ? ordenes[idx] : ordenes[0]
    const updated: OrdenTrabajo = {
      ...current,
      tipo: payload.tipo ?? current.tipo,
      prioridad: payload.prioridad ?? current.prioridad,
      mecanico: payload.mecanicoId ?? current.mecanico,
      diagnosticoInicial: payload.descripcion ?? current.diagnosticoInicial,
      estado: payload.estado ?? current.estado,
    }
    if (idx >= 0) ordenes = ordenes.map(o => o.numeroOrden === id ? updated : o)
    return mockFetch(updated)
  },
  async cambiarEstado(id, payload) {
    const idx = ordenes.findIndex(o => o.numeroOrden === id)
    const current = idx >= 0 ? ordenes[idx] : ordenes[0]
    const updated: OrdenTrabajo = {
      ...current,
      estado: payload.codigo,
    }
    if (idx >= 0) ordenes = ordenes.map(o => o.numeroOrden === id ? updated : o)
    return mockFetch(toDetalle(updated))
  },
  async deleteOrden(_id) {
    return mockFetch(undefined as void)
  },
  async bulkUpdateOrdenes(payload) {
    ordenes = ordenes.map(o => {
      if (!o.numeroOrden || !payload.ids.includes(o.numeroOrden)) return o
      return {
        ...o,
        estado: payload.estado ?? o.estado,
        mecanico: payload.mecanicoId ?? o.mecanico,
      }
    })
    return mockFetch(undefined as void)
  },
}

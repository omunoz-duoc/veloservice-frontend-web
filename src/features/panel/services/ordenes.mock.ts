import type { IOrdenesService, OrdenTrabajo, OrdenTrabajoDetalle, OrdenesListResponse, OrdenesMetricas } from "../types/ordenes.types"
import ordenesData from "./ordenes.mock.data.json"
import metricasData from "./ordenes.metricas.mock.data.json"
import { ESTADOS_ORDEN_FALLBACK, PRIORIDADES_ORDEN_FALLBACK, TIPOS_ORDEN_FALLBACK } from "./ordenes.catalogos"

let ordenes = [...(ordenesData.ordenes as OrdenTrabajo[])]

async function mockFetch<T>(data: T, delayMs = 250): Promise<T> {
  await new Promise(r => setTimeout(r, delayMs))
  return data
}

const ESTADO_DETALLE: Record<string, OrdenTrabajoDetalle["estado"]> = {
  recibida: { id: "estado-recibida", codigo: "recibida", nombre: "Recibida" },
  en_diagnostico: { id: "estado-diagnostico", codigo: "en_diagnostico", nombre: "En diagnostico" },
  esperando_repuestos: { id: "estado-repuestos", codigo: "esperando_repuestos", nombre: "Esperando repuestos" },
  en_reparacion: { id: "estado-reparacion", codigo: "en_reparacion", nombre: "En reparacion" },
  control_calidad: { id: "estado-calidad", codigo: "control_calidad", nombre: "Control calidad" },
  lista_para_entrega: { id: "estado-lista", codigo: "lista_para_entrega", nombre: "Lista para entrega" },
  entregada: { id: "estado-entregada", codigo: "entregada", nombre: "Entregada" },
  cancelada: { id: "estado-cancelada", codigo: "cancelada", nombre: "Cancelada" },
}

const TIPO_LABELS: Record<string, string> = {
  mantencion: "Mantencion",
  reparacion: "Reparacion",
  revision: "Revision",
  garantia: "Garantia",
  armado: "Armado",
  personalizacion: "Personalizacion",
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
    estado: ESTADO_DETALLE[orden.estado.toLowerCase()] ?? ESTADO_DETALLE.recibida,
    tipo: {
      id: `tipo-${tipoCodigo}`,
      codigo: tipoCodigo,
      nombre: TIPO_LABELS[tipoCodigo] ?? orden.tipo,
    },
    fechaIngreso: orden.fechaIngreso,
    fechaPrometida: orden.fechaIngreso,
    fechaEntrega: orden.estado === "entregada" ? orden.fechaIngreso : null,
    diagnosticoInicial: orden.diagnosticoInicial,
    diagnosticoFinal: orden.estado === "lista_para_entrega" || orden.estado === "entregada" ? "Trabajo completado y validado en banco." : null,
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
  async getOrdenesMetricas() {
    return mockFetch(metricasData as OrdenesMetricas)
  },
  async getEstadosOrden() {
    return mockFetch(ESTADOS_ORDEN_FALLBACK)
  },
  async getTiposOrden() {
    return mockFetch(TIPOS_ORDEN_FALLBACK)
  },
  async getPrioridadesOrden() {
    return mockFetch(PRIORIDADES_ORDEN_FALLBACK)
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
      tipo: payload.tipoCodigo ?? current.tipo,
      prioridad: payload.prioridad ?? current.prioridad,
      mecanico: payload.mecanicoId ?? current.mecanico,
      diagnosticoInicial: payload.descripcion ?? current.diagnosticoInicial,
      estado: payload.estadoCodigo ?? payload.estado ?? current.estado,
    }
    if (idx >= 0) ordenes = ordenes.map(o => o.numeroOrden === id ? updated : o)
    return mockFetch(updated)
  },
  async addProductos(id, payload) {
    const detalle = toDetalle(ordenes.find(o => o.numeroOrden === id) ?? ordenes[0])
    const nuevos = payload.map((item, index) => ({
      id: `linea-producto-${id}-${index}`,
      productoId: item.productoId,
      nombre: `Producto ${item.productoId}`,
      sku: "SKU-MOCK",
      cantidad: item.cantidad,
      precioVenta: 10000,
    }))
    return mockFetch([...detalle.productos, ...nuevos])
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

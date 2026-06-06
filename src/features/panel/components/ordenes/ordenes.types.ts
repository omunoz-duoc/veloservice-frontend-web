export type TipoOT = "personalizacion" | "mantencion" | "reparacion" | "revision" | "garantia" | "armado"
export type EstadoOT = "recibido" | "diagnostico" | "espera" | "proceso" | "calidad" | "listo" | "entregado" | "cancelado"
export type Prioridad = "baja" | "media" | "alta" | "urgente"
export type TipoBici = "MTB" | "MTB Full" | "Ruta" | "Gravel" | "Urbana" | "BMX" | "eBike MTB" | "eBike Urbana" | "Otro"

export type Mecanico = {
  id: string
  nombre: string
  iniciales: string
  color: string
}

export type OrdenTrabajo = {
  id: string
  backendId?: string
  tipo: {
    id: string;
    codigo: string;
    nombre: string;
  }
  servicioIds?: string[]
  estado: EstadoOT
  prioridad: Prioridad
  fechaIngreso: string
  fechaEstimada: string
  mecanicoId: string
  // Cliente
  clienteNombre: string
  clienteTelefono?: string
  clienteEmail?: string
  // Bicicleta
  biciMarca: string
  biciTipo: TipoBici | string
  biciTalla?: string
  biciColor: string
  biciNumSerie?: string
  // Trabajo
  descripcion: string
  notasInternas?: string
}

// Lean cliente shape returned by /lista-clientes
export type ClienteResult = {
  id: string
  nombre: string
  rut: string
}

export type ClientesListResponse = ClienteResult[]

// Bicicleta returned by /bicicletas?clienteId=
export type BicicletaResult = {
  id: string
  marca: string
  modelo: string
  tipo: string
  color: string
  numSerie?: string
  anio?: number
}

export type BicicletasListResponse = BicicletaResult[]

// Tipo de trabajo from /ordenes/tipos
export type TipoTrabajo = {
  id: string
  codigo: string
  nombre: string
}

export type TiposTrabajoResponse = TipoTrabajo[]


// Mecánico from /lista-mecanicos
export type MecanicoApi = {
  id: string
  nombre: string
}

export type MecanicosListResponse = MecanicoApi[]


// Producto from /lista-productos
export type ProductoResult = {
  id: string
  nombre: string
  precioVenta: number
  stock: number
}

export type ProductosListResponse = {
  productos: ProductoResult[]
}

// A product added to the order, with chosen quantity
export type ProductoSeleccionado = {
  productoId: string
  nombre: string
  precioVenta: number
  cantidad: number
}

// ─── Create OT payload (single nested POST to /ordenes) ─────────────────────────

export type ClienteNuevoPayload = {
  nombre: string
  apellido: string
  rut: string
  telefono: string
  email: string
}

export type BicicletaNuevaPayload = {
  marca: string
  modelo: string
  tipo: string
  aro: string
  color: string
  numeroSerie?: string
  anio?: number
  notas?: string
}

export type CreateOTPayload = {
  sucursalId?: string // only sent when user.rol === "admin_taller"
  // exactly one of these:
  clienteId?: string
  clienteNuevo?: ClienteNuevoPayload
  // exactly one of these:
  bicicletaId?: string
  bicicletaNueva?: BicicletaNuevaPayload
  tipoTrabajo: string // codigo from TipoTrabajo
  prioridad: Prioridad
  mecanicoId?: string // omitted when "sin asignar"
  fechaPrometida: string
  diagnosticoInicial: string
  observacionesCliente?: string
  servicios: { servicioId: string }[]
  productos: { productoId: string; cantidad: number }[]
}

export type CreateOTResponse = {
  id: string
  numeroOrden: string
}

export type TipoOT = "personalizacion" | "mantencion" | "reparacion" | "revision" | "garantia" | "armado"
export type EstadoOT = "recibido" | "proceso" | "espera" | "listo" | "entregado"
export type Prioridad = "baja" | "media" | "alta"
export type TipoBici = "MTB" | "MTB Full" | "Ruta" | "Gravel" | "Urbana" | "BMX" | "eBike MTB" | "eBike Urbana" | "Otro"

export type Mecanico = {
  id: string
  nombre: string
  iniciales: string
  color: string
}

export type OrdenTrabajo = {
  id: string
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

export type ClienteResult = {
  id: string
  nombre: string
  rut: string
  bicicletas: BicicletaResult[]
}

export type ClienteNuevaOTResponse = {
  total: number
  clientes: ClienteResult[]
}

export type BicicletaResult = {
  id: string
  marca: string
  modelo: string
  tipo: string
  color: string
  clienteId?: string
  numSerie?: string
  anio?: number
}

export type NuevaOTApiPayload = {
  clienteId: string
  bicicletaId: string
  servicioIds: string[]
  prioridad: Prioridad
  fechaEstimada: string
  mecanicoId: string
  descripcion: string
  notasInternas?: string
}

// ─── Types ─────────────────────────────────────────────────────────────────────

export type TipoOT = "diagnostico" | "mantencion" | "reparacion" | "overhaul" | "garantia" | "armado"
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
  tipo: TipoOT
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
  biciTalla: string
  biciColor: string
  biciNumSerie?: string
  // Trabajo
  descripcion: string
  notasInternas?: string
}

export type NuevaOTPayload = {
  tipo: TipoOT
  prioridad: Prioridad
  fechaEstimada: string
  mecanicoId: string
  clienteNombre: string
  clienteTelefono: string
  clienteEmail: string
  biciMarca: string
  biciTipo: TipoBici | string
  biciTalla: string
  biciColor: string
  biciNumSerie: string
  descripcion: string
  notasInternas: string
}

// ─── Config maps ───────────────────────────────────────────────────────────────

export const TIPO_CONFIG: Record<TipoOT, { label: string; fg: string; bg: string }> = {
  diagnostico: { label: "Diagnóstico", fg: "#3a6ea5", bg: "#e4eaf2" },
  mantencion:  { label: "Mantención",  fg: "#6b5bd1", bg: "#ebe7fa" },
  reparacion:  { label: "Reparación",  fg: "#c85a2a", bg: "#fbeadd" },
  overhaul:    { label: "Overhaul",    fg: "#111418", bg: "#ece7de" },
  garantia:    { label: "Garantía",    fg: "#2f7d4f", bg: "#e4f1e8" },
  armado:      { label: "Armado",      fg: "#8c6a1e", bg: "#faecd6" },
}

export const ESTADO_CONFIG: Record<EstadoOT, { label: string; fg: string; bg: string; dot: string }> = {
  recibido:  { label: "Recibido",      fg: "#6b5d46", bg: "#efe9df", dot: "#a59682" },
  proceso:   { label: "En proceso",    fg: "#6b5bd1", bg: "#ebe7fa", dot: "#6b5bd1" },
  espera:    { label: "Esp. repuesto", fg: "#c85a2a", bg: "#fbeadd", dot: "#c85a2a" },
  listo:     { label: "Listo",         fg: "#2f7d4f", bg: "#e4f1e8", dot: "#2f7d4f" },
  entregado: { label: "Entregado",     fg: "#3a6ea5", bg: "#e4eaf2", dot: "#3a6ea5" },
}

export const PRIORIDAD_CONFIG: Record<Prioridad, { label: string; fg: string; bg: string }> = {
  baja:  { label: "Baja",  fg: "#6b5d46", bg: "#efe9df" },
  media: { label: "Media", fg: "#3a6ea5", bg: "#e4eaf2" },
  alta:  { label: "Alta",  fg: "#c85a2a", bg: "#fbeadd" },
}

export const TIPOS_BICI: TipoBici[] = [
  "MTB", "MTB Full", "Ruta", "Gravel", "Urbana", "BMX", "eBike MTB", "eBike Urbana", "Otro",
]

// ─── Mock data ─────────────────────────────────────────────────────────────────

export const MECANICOS_MOCK: Mecanico[] = [
  { id: "RS", nombre: "Rodrigo Soto",  iniciales: "RS", color: "#6b5bd1" },
  { id: "JB", nombre: "Javier Bravo",  iniciales: "JB", color: "#2f7d4f" },
  { id: "PH", nombre: "Pablo Herrera", iniciales: "PH", color: "#c85a2a" },
  { id: "--", nombre: "Sin asignar",   iniciales: "?",  color: "#a59682" },
]

export const ORDENES_MOCK: OrdenTrabajo[] = [
  {
    id: "OT-0343", tipo: "diagnostico", estado: "recibido", prioridad: "media",
    fechaIngreso: "23 Abr · 09:30", fechaEstimada: "25 Abr",
    mecanicoId: "JB",
    clienteNombre: "Matías Díaz", clienteTelefono: "+56 9 8234 5678",
    biciMarca: "Scott Sub Cross 40", biciTipo: "Urbana", biciTalla: "M", biciColor: "Gris/Negro",
    descripcion: "Ruido en transmisión al pedalear en 3ra marcha. Cambio brusco de piñón.",
  },
  {
    id: "OT-0342", tipo: "mantencion", estado: "proceso", prioridad: "media",
    fechaIngreso: "23 Abr · 11:00", fechaEstimada: "24 Abr",
    mecanicoId: "RS",
    clienteNombre: "Camila Reyes", clienteEmail: "c.reyes@email.com",
    biciMarca: "Giant Contend AR 3", biciTipo: "Ruta", biciTalla: "S", biciColor: "Azul Mate",
    descripcion: "Mantención completa: limpieza drivetrain, ajuste de cambios, revisión frenos hidráulicos.",
  },
  {
    id: "OT-0341", tipo: "armado", estado: "recibido", prioridad: "baja",
    fechaIngreso: "23 Abr · 12:00", fechaEstimada: "24 Abr",
    mecanicoId: "--",
    clienteNombre: "Paulina Mora", clienteTelefono: "+56 9 1234 5678",
    biciMarca: "Trek Marlin 7 2024", biciTipo: "MTB", biciTalla: "M", biciColor: "Rojo Volcán",
    descripcion: "Bicicleta nueva en caja. Armado completo + tuning inicial y pre-ride check.",
  },
  {
    id: "OT-0340", tipo: "reparacion", estado: "espera", prioridad: "alta",
    fechaIngreso: "22 Abr · 18:45", fechaEstimada: "25 Abr",
    mecanicoId: "PH",
    clienteNombre: "Andrés Vera",
    biciMarca: "Orbea Rise H30", biciTipo: "eBike MTB", biciTalla: "L", biciColor: "Verde Lima",
    biciNumSerie: "ORB-2024-87234",
    descripcion: "Código de error E012 en motor Bosch CX. Requiere diagnóstico eléctrico + actualización firmware.",
    notasInternas: "Esperando respuesta del distribuidor Orbea Chile.",
  },
  {
    id: "OT-0339", tipo: "overhaul", estado: "proceso", prioridad: "alta",
    fechaIngreso: "22 Abr · 15:20", fechaEstimada: "26 Abr",
    mecanicoId: "RS",
    clienteNombre: "Felipe Tapia", clienteTelefono: "+56 9 9871 2345",
    biciMarca: "Specialized Rockhopper Comp", biciTipo: "MTB", biciTalla: "L", biciColor: "Negro",
    descripcion: "Overhaul completo: cajeras BB, dirección, desarme/engrase de bujes, sangrado frenos Shimano MT501.",
  },
  {
    id: "OT-0338", tipo: "mantencion", estado: "proceso", prioridad: "media",
    fechaIngreso: "22 Abr · 10:10", fechaEstimada: "23 Abr",
    mecanicoId: "JB",
    clienteNombre: "Lucía Pinto", clienteEmail: "l.pinto@email.com",
    biciMarca: "Canyon Grail CF SL 7", biciTipo: "Gravel", biciTalla: "S", biciColor: "Arena",
    descripcion: "Mantención 500km: ajuste cambios SRAM Rival AXS, torque bielas, rotación neumáticos tubeless.",
  },
  {
    id: "OT-0337", tipo: "garantia", estado: "espera", prioridad: "alta",
    fechaIngreso: "21 Abr · 17:30", fechaEstimada: "30 Abr",
    mecanicoId: "PH",
    clienteNombre: "Sofía Núñez", clienteTelefono: "+56 9 7654 3210",
    biciMarca: "Haro Downtown DLX", biciTipo: "BMX", biciTalla: "Estándar", biciColor: "Cromado",
    descripcion: "Garantía de cuadro — fisura en tubo superior. Coordinación con distribuidor para reemplazo.",
  },
  {
    id: "OT-0336", tipo: "reparacion", estado: "listo", prioridad: "media",
    fechaIngreso: "21 Abr · 14:00", fechaEstimada: "22 Abr",
    mecanicoId: "RS",
    clienteNombre: "Rodrigo Lagos",
    biciMarca: "Cannondale CAAD13 Disc 105", biciTipo: "Ruta", biciTalla: "56", biciColor: "Negro Mate",
    descripcion: "Cambio de pastillas Shimano J03A + centrado de rotores. Revisión de olguras en dirección integrada.",
  },
  {
    id: "OT-0335", tipo: "mantencion", estado: "entregado", prioridad: "baja",
    fechaIngreso: "21 Abr · 11:45", fechaEstimada: "22 Abr",
    mecanicoId: "JB",
    clienteNombre: "Tomás Álvarez",
    biciMarca: "Kona Dew Plus", biciTipo: "Urbana", biciTalla: "L", biciColor: "Verde Oliva",
    descripcion: "Mantención básica: ajuste cambios trasero, tensión cadena, chequeo presión neumáticos.",
  },
  {
    id: "OT-0334", tipo: "diagnostico", estado: "proceso", prioridad: "media",
    fechaIngreso: "21 Abr · 10:00", fechaEstimada: "23 Abr",
    mecanicoId: "PH",
    clienteNombre: "Ignacio Soto", clienteEmail: "i.soto@email.com",
    biciMarca: "Trek Fuel EX 7", biciTipo: "MTB Full", biciTalla: "M", biciColor: "Azul Cobalto",
    descripcion: "Suspensión RockShox Deluxe Select+ pierde aceite. Diagnóstico y presupuesto de servicio técnico.",
  },
  {
    id: "OT-0333", tipo: "reparacion", estado: "listo", prioridad: "alta",
    fechaIngreso: "20 Abr · 16:20", fechaEstimada: "21 Abr",
    mecanicoId: "PH",
    clienteNombre: "Ana Vera",
    biciMarca: "Orbea Rise H30", biciTipo: "eBike MTB", biciTalla: "L", biciColor: "Verde Lima",
    descripcion: "Sangrado de frenos Shimano BR-MT520 delantero y trasero. Reemplazo de pastillas metálicas.",
  },
  {
    id: "OT-0332", tipo: "overhaul", estado: "entregado", prioridad: "alta",
    fechaIngreso: "20 Abr · 09:00", fechaEstimada: "22 Abr",
    mecanicoId: "RS",
    clienteNombre: "Bernardo Silva", clienteTelefono: "+56 9 3456 7890",
    biciMarca: "Santa Cruz Hightower", biciTipo: "MTB Full", biciTalla: "L", biciColor: "Azul Ártico",
    biciNumSerie: "STC-2023-45612",
    descripcion: "Overhaul Fox 36 Performance Elite + shock Float X. Servicio lowers a 125h.",
  },
]

// ─── Service functions ─────────────────────────────────────────────────────────

async function mockFetch<T>(data: T, ms = 250): Promise<T> {
  await new Promise(r => setTimeout(r, ms))
  return data
}

export async function getOrdenes(): Promise<OrdenTrabajo[]> {
  return mockFetch(ORDENES_MOCK)
}

export async function getMecanicos(): Promise<Mecanico[]> {
  return mockFetch(MECANICOS_MOCK, 100)
}

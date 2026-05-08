// ─── Types ─────────────────────────────────────────────────────────────────────

export type EstadoOC =
  | "borrador"
  | "enviada"
  | "confirmada"
  | "transito"
  | "recibida"
  | "cancelada"

export type EstadoConfig = {
  label: string
  bg: string
  fg: string
}

export type Proveedor = {
  id: string
  nombre: string
  rut: string
  contacto: string
  tel: string
  mail: string
  ciudad: string
  rubro: string
  plazo: number
  rating: number
  ots90: number
  total90: number
  activo: boolean
  marcas: string[]
}

export type OrdenCompra = {
  id: string
  prov: string
  fecha: string
  entrega: string
  estado: EstadoOC
  items: number
  total: number
  doc: string
  creado: string
  tracking?: string
  recibida?: string
}

export type ItemOC = {
  sku: string
  nombre: string
  solicitado: number
  costo: number
}

// ─── Config ────────────────────────────────────────────────────────────────────

export const ESTADOS: Record<EstadoOC, EstadoConfig> = {
  borrador:   { label: "Borrador",    bg: "#f4efe7", fg: "#6b5d46" },
  enviada:    { label: "Enviada",     bg: "#e4eaf2", fg: "#3a6ea5" },
  confirmada: { label: "Confirmada",  bg: "#ebe7fa", fg: "#6b5bd1" },
  transito:   { label: "En tránsito", bg: "#faecd6", fg: "#a07910" },
  recibida:   { label: "Recibida",    bg: "#e4f1e8", fg: "#2f7d4f" },
  cancelada:  { label: "Cancelada",   bg: "#fbeadd", fg: "#c85a2a" },
}

export const TIMELINE_STEPS: { k: EstadoOC; l: string }[] = [
  { k: "borrador",   l: "Borrador" },
  { k: "enviada",    l: "Enviada" },
  { k: "confirmada", l: "Confirmada" },
  { k: "transito",   l: "En tránsito" },
  { k: "recibida",   l: "Recibida" },
]

// ─── Mock data ─────────────────────────────────────────────────────────────────

export const PROVEEDORES_MOCK: Proveedor[] = [
  { id: "PV-01", nombre: "Bicisport SpA",       rut: "76.214.530-1", contacto: "Rodrigo Soto",    tel: "+56 2 2885 1240", mail: "ventas@bicisport.cl",       ciudad: "Santiago",   rubro: "Componentes & transmisión",  plazo: 5,  rating: 4.7, ots90: 14, total90: 3240000, activo: true,  marcas: ["Shimano", "KMC", "Sram"] },
  { id: "PV-02", nombre: "Maxxis Andina",       rut: "77.890.110-K", contacto: "Verónica Pinto",  tel: "+56 9 4421 8836", mail: "comercial@maxxis-andina.cl", ciudad: "Santiago",   rubro: "Neumáticos & cámaras",       plazo: 7,  rating: 4.5, ots90: 8,  total90: 1980000, activo: true,  marcas: ["Maxxis", "CST"] },
  { id: "PV-03", nombre: "Drimer Bike",         rut: "78.330.220-4", contacto: "Andrés Lagos",    tel: "+56 2 2944 5510", mail: "andres@drimer.cl",           ciudad: "Santiago",   rubro: "Frenos & hidráulicos",       plazo: 6,  rating: 4.2, ots90: 6,  total90: 1240000, activo: true,  marcas: ["Sram", "Magura"] },
  { id: "PV-04", nombre: "E-Power Importadora", rut: "79.110.450-2", contacto: "Mauricio Ríos",   tel: "+56 2 2480 7720", mail: "mauricio@epower.cl",         ciudad: "Valparaíso", rubro: "E-bike, baterías, motores",  plazo: 14, rating: 4.8, ots90: 5,  total90: 2810000, activo: true,  marcas: ["Bosch", "Shimano Steps"] },
  { id: "PV-05", nombre: "Lubrik Express",      rut: "77.210.890-7", contacto: "Carla Soto",      tel: "+56 9 7754 1100", mail: "carla@lubrik.cl",            ciudad: "Santiago",   rubro: "Lubricantes & limpiadores",  plazo: 3,  rating: 4.4, ots90: 11, total90: 580000,  activo: true,  marcas: ["Muc-Off", "Finish Line"] },
  { id: "PV-06", nombre: "Andes Wheels Co.",    rut: "76.998.220-K", contacto: "Felipe Cárcamo",  tel: "+56 9 9120 4422", mail: "contacto@andeswheels.cl",    ciudad: "Concepción", rubro: "Ruedas, llantas, rayos",     plazo: 10, rating: 4.0, ots90: 3,  total90: 920000,  activo: false, marcas: ["DT Swiss", "Stan's"] },
]

export const OCS_MOCK: OrdenCompra[] = [
  { id: "OC-0044", prov: "PV-01", fecha: "24 Abr", entrega: "29 Abr", estado: "borrador",   items: 3,  total: 184200,  doc: "—",        creado: "M. Álvarez" },
  { id: "OC-0043", prov: "PV-04", fecha: "23 Abr", entrega: "07 May", estado: "enviada",    items: 1,  total: 680000,  doc: "GD-44102", creado: "M. Álvarez" },
  { id: "OC-0042", prov: "PV-01", fecha: "22 Abr", entrega: "27 Abr", estado: "confirmada", items: 5,  total: 312800,  doc: "GD-22091", creado: "M. Álvarez" },
  { id: "OC-0041", prov: "PV-02", fecha: "20 Abr", entrega: "27 Abr", estado: "transito",   items: 8,  total: 326400,  doc: "GD-44089", creado: "P. Mora",    tracking: "BlueExpress · 99812455" },
  { id: "OC-0040", prov: "PV-05", fecha: "19 Abr", entrega: "22 Abr", estado: "transito",   items: 24, total: 148800,  doc: "GD-22084", creado: "P. Mora",    tracking: "Starken · 88241007" },
  { id: "OC-0039", prov: "PV-03", fecha: "18 Abr", entrega: "24 Abr", estado: "recibida",   items: 2,  total: 296000,  doc: "GD-89322", creado: "M. Álvarez", recibida: "24 Abr" },
  { id: "OC-0038", prov: "PV-02", fecha: "15 Abr", entrega: "22 Abr", estado: "recibida",   items: 6,  total: 113400,  doc: "GD-44071", creado: "P. Mora",    recibida: "22 Abr" },
  { id: "OC-0037", prov: "PV-06", fecha: "12 Abr", entrega: "22 Abr", estado: "cancelada",  items: 4,  total: 184000,  doc: "—",        creado: "M. Álvarez" },
]

export const DETALLE_OC: Record<string, ItemOC[]> = {
  "OC-0041": [
    { sku: "MX-RC-29-22", nombre: "Neumático Maxxis Rekon Race 29x2.25", solicitado: 5, costo: 18900 },
    { sku: "MX-AS-29-23", nombre: "Neumático Maxxis Ardent 29x2.40",     solicitado: 3, costo: 22600 },
  ],
  "OC-0040": [
    { sku: "MUC-DRY", nombre: "Lubricante Muc-Off Dry 50ml", solicitado: 24, costo: 6200 },
  ],
  "OC-0044": [
    { sku: "SH-CN-001",   nombre: "Cadena Shimano CN-HG601 11v",  solicitado: 6, costo: 14500 },
    { sku: "SH-PD-J03A",  nombre: "Pastillas Shimano J03A (par)", solicitado: 8, costo: 7800 },
    { sku: "KMC-X11",     nombre: "Cadena KMC X11 11v",            solicitado: 4, costo: 12200 },
  ],
}

// ─── Utils ─────────────────────────────────────────────────────────────────────

export function fmt(n: number): string {
  return "$ " + n.toLocaleString("es-CL")
}

export function nextOCId(ocs: OrdenCompra[]): string {
  const nums = ocs.map(o => parseInt(o.id.split("-")[1] ?? "0"))
  return `OC-${(Math.max(...nums, 44) + 1).toString().padStart(4, "0")}`
}

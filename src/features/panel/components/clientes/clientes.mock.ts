// ─── Types ─────────────────────────────────────────────────────────────────────

export type TierKey = "nuevo" | "regular" | "frecuente" | "vip"
export type CanalKey = "WhatsApp" | "Email" | "Llamada" | "SMS"
export type IdType = "RUT" | "Pasaporte" | "DNI"

export type Tier = {
  key: TierKey
  label: string
  fg: string
  bg: string
}

export type Cliente = {
  id: string
  backendId?: string
  codigoCliente?: string | null
  nombre: string
  idType: IdType
  idNum: string
  email: string
  tel: string
  ciudad: string
  fechaReg: string
  tier: TierKey
  bicis: number
  ots: number
  gasto: number
  ultima: string
  canal: CanalKey
  notas: string
  consentEmail?: boolean
  consentWhatsApp?: boolean
  consentMarketing?: boolean
}

export type Bicicleta = {
  id: string
  marca: string
  tipo: string
  talla: string
  color: string
  serial: string
  añoCompra: number
  notas: string
}

export type NuevoClientePayload = {
  nombre: string
  idType: IdType
  idNum: string
  email: string
  tel: string
  ciudad: string
  canal: CanalKey
  tier: TierKey
  notas: string
  consentEmail: boolean
  consentWhatsApp: boolean
  consentMarketing: boolean
}

// ─── Config ────────────────────────────────────────────────────────────────────

export const TIERS: Tier[] = [
  { key: "nuevo",     label: "Nuevo",     fg: "#6b5d46", bg: "#efe9df" },
  { key: "regular",   label: "Regular",   fg: "#3a6ea5", bg: "#e4eaf2" },
  { key: "frecuente", label: "Frecuente", fg: "#6b5bd1", bg: "#ebe7fa" },
  { key: "vip",       label: "VIP",       fg: "#8c6a1e", bg: "#faecd6" },
]

export const CANALES: CanalKey[] = ["WhatsApp", "Email", "Llamada", "SMS"]
export const ID_TYPES: IdType[] = ["RUT", "Pasaporte", "DNI"]

// ─── Mock data ─────────────────────────────────────────────────────────────────

export const BICIS_MOCK: Record<string, Bicicleta[]> = {
  "CL-00121": [
    { id: "BC-0331", marca: "Trek Marlin 7 2024",          tipo: "MTB Hardtail",     talla: "M",  color: "Rojo Volcán",   serial: "WTU2040G0321",    añoCompra: 2024, notas: "Frenos Shimano MT200, horquilla SR Suntour XCT 30" },
    { id: "BC-0332", marca: "Specialized Sirrus X 3.0",    tipo: "Urbana / Fitness", talla: "S",  color: "Negro Mate",    serial: "WSBC602938K",     añoCompra: 2022, notas: "Rack Topeak instalado" },
    { id: "BC-0333", marca: "Canyon Lux Trail CF 7",       tipo: "MTB Full",         talla: "M",  color: "Azul Ártico",   serial: "CNYLT220034",     añoCompra: 2025, notas: "Suspensión Fox 34 + Float DPS" },
  ],
  "CL-00123": [
    { id: "BC-0401", marca: "Pinarello Dogma F Disc",      tipo: "Ruta",             talla: "54", color: "Nero",          serial: "PNF-DS-77120",    añoCompra: 2023, notas: "Grupo SRAM Red eTap AXS" },
    { id: "BC-0402", marca: "Specialized Enduro Expert",   tipo: "MTB Full Enduro",  talla: "L",  color: "Verde Gunmetal", serial: "SPE-ENE-884501", añoCompra: 2024, notas: "Fox 38 Grip2" },
    { id: "BC-0403", marca: "Trek Domane SLR 7",           tipo: "Ruta Endurance",   talla: "56", color: "Champagne",     serial: "WTU-DMN-SLR772",  añoCompra: 2022, notas: "" },
    { id: "BC-0404", marca: "Orbea Rise M-LTD",            tipo: "eBike MTB",        talla: "L",  color: "Verde Moss",    serial: "ORB-RIS-MLTD-004", añoCompra: 2025, notas: "Motor Shimano EP801 RS" },
  ],
  "CL-00125": [
    { id: "BC-0501", marca: "Santa Cruz Hightower 3",      tipo: "MTB Full Trail",   talla: "L",  color: "Azul Ártico",   serial: "SCB-HT3-221188",  añoCompra: 2024, notas: "Servicio Fox 36 cada 125h" },
    { id: "BC-0502", marca: "Cannondale Topstone Carbon 2", tipo: "Gravel",           talla: "M",  color: "Arena",         serial: "CND-TS-0091",     añoCompra: 2023, notas: "Tubeless WTB" },
  ],
}

// ─── Utils ─────────────────────────────────────────────────────────────────────

export function fmtGasto(n: number): string {
  return "$ " + n.toLocaleString("es-CL")
}

export function fmtGastoK(n: number): string {
  return "$" + (n / 1000).toFixed(0) + "K"
}

export function avatarInitials(nombre: string): string {
  return nombre.split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase()
}

export function avatarColor(initials: string): string {
  const colors = ["#6b5bd1", "#2f7d4f", "#c85a2a", "#3a6ea5", "#8c6a1e", "#b39573"]
  return colors[initials.charCodeAt(0) % colors.length]
}


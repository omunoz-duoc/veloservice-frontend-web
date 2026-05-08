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

export const CLIENTES_MOCK: Cliente[] = [
  { id: "CL-00121", nombre: "Paulina Mora Sánchez",   idType: "RUT",       idNum: "15.824.391-5",  email: "paulina.mora@gmail.com",       tel: "+56 9 6732 1451", ciudad: "Providencia, Santiago",    fechaReg: "12 Mar 2023", tier: "frecuente", bicis: 3,  ots: 14, gasto: 842300,   ultima: "18 Abr 2026", canal: "WhatsApp", notas: "Prefiere atención en tarde. Ciclista de trail en Farellones.", consentEmail: true,  consentWhatsApp: true,  consentMarketing: false },
  { id: "CL-00122", nombre: "Camila Reyes Duarte",    idType: "RUT",       idNum: "18.204.553-K",  email: "camila.reyes@outlook.com",     tel: "+56 9 8812 4409", ciudad: "Ñuñoa, Santiago",          fechaReg: "05 Ago 2023", tier: "regular",   bicis: 1,  ots: 6,  gasto: 215600,   ultima: "10 Abr 2026", canal: "Email",    notas: "Grupo de ruta los domingos 7am.",                             consentEmail: true,  consentWhatsApp: false, consentMarketing: false },
  { id: "CL-00123", nombre: "Matías Díaz Rojas",      idType: "RUT",       idNum: "14.501.210-3",  email: "matias.diaz@empresa.cl",       tel: "+56 2 2748 9012", ciudad: "Las Condes, Santiago",     fechaReg: "21 Ene 2022", tier: "vip",       bicis: 4,  ots: 27, gasto: 2145800,  ultima: "22 Abr 2026", canal: "Llamada",  notas: "Cliente VIP. Bicis de alta gama, consulta antes de cualquier cobro extra.", consentEmail: true, consentWhatsApp: true, consentMarketing: false },
  { id: "CL-00124", nombre: "Andrés Vera Contreras",  idType: "RUT",       idNum: "16.987.432-1",  email: "andres.vera@gmail.com",        tel: "+56 9 9012 3344", ciudad: "La Reina, Santiago",       fechaReg: "03 Feb 2024", tier: "regular",   bicis: 2,  ots: 8,  gasto: 489200,   ultima: "20 Abr 2026", canal: "WhatsApp", notas: "eBike Orbea, seguro activo.",                                  consentEmail: true,  consentWhatsApp: true,  consentMarketing: false },
  { id: "CL-00125", nombre: "Felipe Tapia Muñoz",     idType: "RUT",       idNum: "13.772.019-8",  email: "ftapia@veloclub.cl",           tel: "+56 9 7723 8811", ciudad: "Lo Barnechea, Santiago",   fechaReg: "19 Jun 2021", tier: "vip",       bicis: 5,  ots: 34, gasto: 3210400,  ultima: "21 Abr 2026", canal: "WhatsApp", notas: "Club Velo Andino. Flota de MTB Full para familia.",            consentEmail: true,  consentWhatsApp: true,  consentMarketing: true  },
  { id: "CL-00126", nombre: "Lucía Pinto Herrera",    idType: "RUT",       idNum: "19.445.821-2",  email: "lucia.pinto@uc.cl",            tel: "+56 9 5501 7712", ciudad: "Santiago Centro",          fechaReg: "11 Nov 2024", tier: "nuevo",     bicis: 1,  ots: 2,  gasto: 78400,    ultima: "22 Abr 2026", canal: "Email",    notas: "Estudiante, usa bici urbana diaria al trabajo.",               consentEmail: true,  consentWhatsApp: false, consentMarketing: false },
  { id: "CL-00127", nombre: "Sofía Núñez Bravo",      idType: "RUT",       idNum: "17.223.004-7",  email: "sofia.n.bravo@icloud.com",     tel: "+56 9 4417 2098", ciudad: "Peñalolén, Santiago",      fechaReg: "28 Sep 2022", tier: "frecuente", bicis: 2,  ots: 11, gasto: 634900,   ultima: "19 Abr 2026", canal: "WhatsApp", notas: "Hace competencia BMX — ajustes agresivos preferidos.",          consentEmail: true,  consentWhatsApp: true,  consentMarketing: false },
  { id: "CL-00128", nombre: "Rodrigo Lagos Silva",    idType: "RUT",       idNum: "12.008.311-4",  email: "rlagos@gmail.com",             tel: "+56 9 9876 1123", ciudad: "Vitacura, Santiago",       fechaReg: "07 Mar 2020", tier: "vip",       bicis: 3,  ots: 41, gasto: 4012700,  ultima: "21 Abr 2026", canal: "Llamada",  notas: "Cliente desde 2020. Paga con transferencia, requiere factura electrónica.", consentEmail: true, consentWhatsApp: false, consentMarketing: false },
  { id: "CL-00129", nombre: "Tomás Álvarez Ríos",     idType: "RUT",       idNum: "20.112.844-0",  email: "tomas.alvarez@gmail.com",      tel: "+56 9 6655 4321", ciudad: "Maipú, Santiago",          fechaReg: "14 Ene 2025", tier: "nuevo",     bicis: 1,  ots: 1,  gasto: 42800,    ultima: "21 Abr 2026", canal: "WhatsApp", notas: "",                                                             consentEmail: false, consentWhatsApp: true,  consentMarketing: false },
  { id: "CL-00130", nombre: "Ignacio Soto Méndez",    idType: "RUT",       idNum: "15.309.771-8",  email: "nachosoto@hotmail.com",        tel: "+56 9 8800 6611", ciudad: "Huechuraba, Santiago",     fechaReg: "02 Jul 2023", tier: "regular",   bicis: 2,  ots: 9,  gasto: 567100,   ultima: "20 Abr 2026", canal: "Email",    notas: "Suspensión Fox en servicio anual.",                             consentEmail: true,  consentWhatsApp: false, consentMarketing: false },
  { id: "CL-00131", nombre: "Bernardo Silva Cortés",  idType: "RUT",       idNum: "11.456.998-6",  email: "bernardo.silva@empresa.com",   tel: "+56 2 2299 0045", ciudad: "Chicureo",                 fechaReg: "30 Abr 2022", tier: "frecuente", bicis: 2,  ots: 18, gasto: 1324500,  ultima: "20 Abr 2026", canal: "WhatsApp", notas: "Santa Cruz Hightower, servicio 125h recurrente.",               consentEmail: true,  consentWhatsApp: true,  consentMarketing: false },
  { id: "CL-00132", nombre: "Emma Johansson Holm",    idType: "Pasaporte", idNum: "SE-8823451",     email: "emma.j.holm@protonmail.com",   tel: "+46 70 223 1145", ciudad: "Expat · Lo Barnechea",     fechaReg: "18 Feb 2025", tier: "nuevo",     bicis: 1,  ots: 1,  gasto: 98200,    ultima: "17 Abr 2026", canal: "Email",    notas: "Comunicación en inglés.",                                      consentEmail: true,  consentWhatsApp: false, consentMarketing: false },
]

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

export function nextClienteId(clientes: Cliente[]): string {
  const nums = clientes.map(c => parseInt(c.id.split("-")[1] ?? "0"))
  return `CL-${(Math.max(...nums, 132) + 1).toString().padStart(5, "0")}`
}

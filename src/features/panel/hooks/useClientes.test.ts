import { describe, it, expect } from "vitest"
import { toClienteUI } from "./useClientes"
import type { Cliente as ServiceCliente } from "../types/clientes.types"

const serviceCliente: ServiceCliente = {
  id: "CL-00121",
  nombre: "Paulina",
  apellido: "Mora Sánchez",
  tipo: "VIP",
  rut: "15.824.391-5",
  email: "paulina@gmail.com",
  telefono: "+56 9 6732 1451",
  bicicletasCount: 3,
  ordenesCount: 14,
  totalGastado: 842300,
  ciudad: "Providencia",
  fechaReg: "12 Mar 2023",
  ultimaVisita: "18 Abr 2026",
  canal: "WhatsApp",
  notas: "Trail rider",
  consentEmail: true,
  consentWhatsApp: true,
  consentMarketing: false,
}

describe("toClienteUI", () => {
  it("merges nombre + apellido into a single nombre string", () => {
    const ui = toClienteUI(serviceCliente)
    expect(ui.nombre).toBe("Paulina Mora Sánchez")
  })

  it("maps rut → idNum", () => {
    const ui = toClienteUI(serviceCliente)
    expect(ui.idNum).toBe("15.824.391-5")
  })

  it("maps telefono → tel", () => {
    const ui = toClienteUI(serviceCliente)
    expect(ui.tel).toBe("+56 9 6732 1451")
  })

  it("normalizes VIP tipo to lowercase vip tier", () => {
    const ui = toClienteUI(serviceCliente)
    expect(ui.tier).toBe("vip")
  })

  it("maps bicicletasCount → bicis", () => {
    const ui = toClienteUI(serviceCliente)
    expect(ui.bicis).toBe(3)
  })

  it("maps ordenesCount → ots", () => {
    const ui = toClienteUI(serviceCliente)
    expect(ui.ots).toBe(14)
  })

  it("maps totalGastado → gasto", () => {
    const ui = toClienteUI(serviceCliente)
    expect(ui.gasto).toBe(842300)
  })

  it("maps ultimaVisita → ultima", () => {
    const ui = toClienteUI(serviceCliente)
    expect(ui.ultima).toBe("18 Abr 2026")
  })

  it("defaults idType to RUT when not specified", () => {
    const ui = toClienteUI({ ...serviceCliente, rut: "11.111.111-1" })
    expect(ui.idType).toBe("RUT")
  })

  it("defaults missing optional fields gracefully", () => {
    const minimal: ServiceCliente = {
      id: "CL-00001",
      nombre: "Test",
      apellido: "User",
      tipo: "nuevo",
      rut: "11.111.111-1",
      email: "t@t.cl",
      telefono: "+56900000000",
      bicicletasCount: 0,
      ordenesCount: 0,
      totalGastado: 0,
    }
    const ui = toClienteUI(minimal)
    expect(ui.ciudad).toBe("")
    expect(ui.notas).toBe("")
    expect(ui.canal).toBe("Email")
    expect(ui.consentEmail).toBe(false)
  })
})

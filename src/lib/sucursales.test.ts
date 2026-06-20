import {
  getSucursalesStorage,
  setSucursalesStorage,
  clearSucursalesStorage,
  getActiveSucursalId,
} from "./sucursales"

const STORAGE_KEY = "vs-sucursales"
const SUCURSALES = [
  { id: "S-01", nombre: "Casa Matriz" },
  { id: "S-02", nombre: "Sucursal Norte" },
]

beforeEach(() => localStorage.clear())

describe("getSucursalesStorage", () => {
  it("returns null when key is absent", () => {
    expect(getSucursalesStorage()).toBeNull()
  })

  it("returns null when stored value is invalid JSON", () => {
    localStorage.setItem(STORAGE_KEY, "{{invalid")
    expect(getSucursalesStorage()).toBeNull()
  })

  it("returns parsed object when key holds valid JSON", () => {
    const stored = { sucursales: SUCURSALES, activa: "S-01" }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
    expect(getSucursalesStorage()).toEqual(stored)
  })
})

describe("setSucursalesStorage", () => {
  it("writes correct JSON to localStorage", () => {
    setSucursalesStorage(SUCURSALES, "S-02")
    const raw = localStorage.getItem(STORAGE_KEY)
    expect(JSON.parse(raw!)).toEqual({ sucursales: SUCURSALES, activa: "S-02" })
  })

  it("round-trips through getSucursalesStorage", () => {
    setSucursalesStorage(SUCURSALES, "S-01")
    expect(getSucursalesStorage()).toEqual({ sucursales: SUCURSALES, activa: "S-01" })
  })
})

describe("clearSucursalesStorage", () => {
  it("removes the key from localStorage", () => {
    setSucursalesStorage(SUCURSALES, "S-01")
    clearSucursalesStorage()
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })
})

describe("getActiveSucursalId", () => {
  it("returns null when nothing is stored", () => {
    expect(getActiveSucursalId()).toBeNull()
  })

  it("returns the activa field when stored", () => {
    setSucursalesStorage(SUCURSALES, "S-02")
    expect(getActiveSucursalId()).toBe("S-02")
  })

  it("returns null when stored object has no activa field", () => {
    localStorage.setItem("vs-sucursales", JSON.stringify({ sucursales: SUCURSALES }))
    expect(getActiveSucursalId()).toBeNull()
  })
})

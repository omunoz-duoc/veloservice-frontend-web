import { describe, it, expect } from "vitest"
import {
  getDashboardKpis,
  getPipelineSummary,
  getOrdenesUrgentes,
  getMecanicosActivos,
  getActividadReciente,
} from "./dashboard.mock"

describe("dashboard mock service", () => {
  it("getDashboardKpis returns 4 KPIs with required fields", async () => {
    const kpis = await getDashboardKpis()
    expect(kpis).toHaveLength(4)
    for (const kpi of kpis) {
      expect(kpi).toHaveProperty("id")
      expect(kpi).toHaveProperty("value")
      expect(kpi).toHaveProperty("accent")
      expect(kpi).toHaveProperty("iconKey")
      expect(["up", "down", "warn"]).toContain(kpi.trend)
      const hasSparkOrProgress = kpi.spark !== undefined || kpi.progress !== undefined
      expect(hasSparkOrProgress).toBe(true)
    }
  })

  it("getPipelineSummary returns 4 columns with items arrays", async () => {
    const columns = await getPipelineSummary()
    expect(columns).toHaveLength(4)
    for (const col of columns) {
      expect(col).toHaveProperty("key")
      expect(col).toHaveProperty("count")
      expect(Array.isArray(col.items)).toBe(true)
    }
  })

  it("getOrdenesUrgentes returns orders with valid level", async () => {
    const ordenes = await getOrdenesUrgentes()
    expect(ordenes.length).toBeGreaterThan(0)
    for (const o of ordenes) {
      expect(["crit", "warn"]).toContain(o.level)
      expect(o).toHaveProperty("ot")
      expect(o).toHaveProperty("mecanico")
    }
  })

  it("getMecanicosActivos returns mechanics with valid estado", async () => {
    const mecs = await getMecanicosActivos()
    expect(mecs.length).toBeGreaterThan(0)
    for (const m of mecs) {
      expect(["activo", "saturado", "pausa"]).toContain(m.estado)
      expect(Array.isArray(m.otsCursando)).toBe(true)
      expect(m.capacidad).toBeGreaterThan(0)
    }
  })

  it("getActividadReciente returns items with valid tone and iconKey", async () => {
    const items = await getActividadReciente()
    expect(items.length).toBeGreaterThan(0)
    for (const item of items) {
      expect(["violet", "good", "warn", "info"]).toContain(item.tone)
      expect(["wrench", "coin", "alert", "plus", "users", "doc"]).toContain(item.iconKey)
    }
  })
})

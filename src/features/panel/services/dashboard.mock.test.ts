import { describe, expect, it } from "vitest"
import { getActividadReciente } from "./dashboard.mock"

describe("dashboard mock service", () => {
  it("getActividadReciente returns items with valid tone and iconKey", async () => {
    const items = await getActividadReciente()
    expect(items.length).toBeGreaterThan(0)
    for (const item of items) {
      expect(["violet", "good", "warn", "info"]).toContain(item.tone)
      expect(["wrench", "coin", "alert", "plus", "users", "doc"]).toContain(item.iconKey)
    }
  })
})

import { describe, it, expect } from "vitest"
import { finanzasMock } from "./finanzas.mock"
import { finanzasService } from "./finanzas.provider"

describe("finanzasMock", () => {
  it("getMetricas resolves with FinanzasMetricas shape", async () => {
    const result = await finanzasMock.getMetricas()
    expect(result).toHaveProperty("cobrosDelDia")
    expect(typeof result.cobrosDelDia).toBe("number")
  })
})

describe("finanzasService provider", () => {
  it("exports finanzasService with getMetricas", () => {
    expect(typeof finanzasService.getMetricas).toBe("function")
  })
})

import { describe, it, expect } from "vitest"
import { adminAuthMock } from "./admin-auth.mock"
import { adminAuthService } from "./admin-auth.provider"

describe("adminAuthMock", () => {
  it("login resolves with AdminUser shape for sysadmin", async () => {
    const user = await adminAuthMock.login("sysadmin@veloservice.cl", "password")
    expect(user).toHaveProperty("id")
    expect(user).toHaveProperty("nombre")
    expect(user).toHaveProperty("rol", "sysadmin")
    expect(user).toHaveProperty("token")
  })

  it("login rejects for non-sysadmin emails", async () => {
    await expect(adminAuthMock.login("admin@veloservice.cl", "password")).rejects.toThrow("USER_NOT_FOUND")
  })

  it("logout resolves without error", async () => {
    await expect(adminAuthMock.logout()).resolves.toBeUndefined()
  })
})

describe("adminAuthService provider", () => {
  it("exports adminAuthService with login", () => {
    expect(typeof adminAuthService.login).toBe("function")
  })
})

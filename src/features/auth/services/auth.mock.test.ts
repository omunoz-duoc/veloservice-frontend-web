import { describe, it, expect } from "vitest"
import { authMock } from "./auth.mock"
import { authService } from "./auth.provider"

describe("authMock", () => {
  it("login resolves with User shape", async () => {
    const user = await authMock.login("admin@veloservice.cl", "password")
    expect(user).toHaveProperty("id")
    expect(user).toHaveProperty("nombre")
    expect(user).toHaveProperty("rol")
    expect(user).toHaveProperty("token")
  })

  it("logout resolves without error", async () => {
    await expect(authMock.logout()).resolves.toBeUndefined()
  })

  it("recoverPassword resolves without error", async () => {
    await expect(authMock.recoverPassword("test@test.cl")).resolves.toBeUndefined()
  })

  it("verifyCode resolves with boolean", async () => {
    const result = await authMock.verifyCode("123456")
    expect(typeof result).toBe("boolean")
  })

  it("resetPassword resolves without error", async () => {
    await expect(authMock.resetPassword("newpass")).resolves.toBeUndefined()
  })

  it("register resolves without error", async () => {
    await expect(
      authMock.register({
        nombre: "Test", apellido: "User", rut: "11.111.111-1",
        telefono: "+56912345678", email: "test@test.cl",
        rol: "Mecánico", sucursalId: "s-001", password: "pass"
      })
    ).resolves.toBeUndefined()
  })
})

describe("authService provider", () => {
  it("exports authService with login", () => {
    expect(typeof authService.login).toBe("function")
  })
})

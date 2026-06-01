import { describe, it, expect, beforeEach } from "vitest";
import { MockAuthService } from "./auth.mock";
import type { MockUser } from "./auth.mock";

const MOCK_USERS: MockUser[] = [
  {
    nombre: "Carlos",
    apellido: "Rodriguez",
    email: "jefe@veloservice.cl",
    rol: "Jefe de taller",
    password: "jefe123",
  },
  {
    nombre: "Ana",
    apellido: "Lopez",
    email: "mecanico@veloservice.cl",
    rol: "Mecanico",
    password: "mec123",
  },
];

let service: MockAuthService;

beforeEach(() => {
  service = new MockAuthService();
  service.seedUsers(MOCK_USERS);
});

describe("MockAuthService.login", () => {
  it("resolves with LoginResponse for valid credentials", async () => {
    const user = await service.login("jefe@veloservice.cl", "jefe123");
    expect(user.nombre).toBe("Carlos");
    expect(user.apellido).toBe("Rodriguez");
    expect(user.rol).toBe("Jefe de taller");
    expect(user.token).toBe("mock-token-jefe@veloservice.cl");
    expect("password" in user).toBe(false);
    expect("email" in user).toBe(false);
  });

  it("is case-insensitive on email", async () => {
    const user = await service.login("JEFE@VELOSERVICE.CL", "jefe123");
    expect(user.token).toBe("mock-token-jefe@veloservice.cl");
  });

  it("throws USER_NOT_FOUND when email not in db", async () => {
    await expect(service.login("noone@veloservice.cl", "any")).rejects.toThrow(
      "USER_NOT_FOUND"
    );
  });

  it("throws INVALID_CREDENTIALS when password is wrong", async () => {
    await expect(
      service.login("jefe@veloservice.cl", "wrongpassword")
    ).rejects.toThrow("INVALID_CREDENTIALS");
  });

  it("resolves for second seeded user too", async () => {
    const user = await service.login("mecanico@veloservice.cl", "mec123");
    expect(user.token).toBe("mock-token-mecanico@veloservice.cl");
  });
});

describe("MockAuthService other methods", () => {
  it("recoverPassword resolves without error", async () => {
    await expect(service.recoverPassword("x@y.com")).resolves.toBeUndefined();
  });

  it("verifyCode returns true only for 000000", async () => {
    await expect(service.verifyCode("000000")).resolves.toBe(true);
    await expect(service.verifyCode("123456")).resolves.toBe(false);
  });

  it("resetPassword resolves without error", async () => {
    await expect(service.resetPassword("newpass")).resolves.toBeUndefined();
  });

  it("register resolves without error", async () => {
    await expect(
      service.register({
        nombre: "New",
        apellido: "User",
        rut: "11111111-1",
        telefono: "+56912345678",
        email: "new@veloservice.cl",
        rol: "Mecanico",
        sucursalId: "s1",
        password: "pass",
      })
    ).resolves.toBeUndefined();
  });
});

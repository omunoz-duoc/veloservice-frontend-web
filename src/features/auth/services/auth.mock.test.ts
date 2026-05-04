import { describe, it, expect, beforeEach } from "vitest";
import { MockAuthService } from "./auth.mock";
import type { MockUser } from "./auth.mock";

const MOCK_USERS: MockUser[] = [
  {
    id: "u1",
    nombre: "Carlos",
    apellido: "Rodríguez",
    email: "jefe@veloservice.cl",
    cargo: "Jefe de taller",
    taller: "VeloService Providencia",
    password: "jefe123",
  },
  {
    id: "u2",
    nombre: "Ana",
    apellido: "López",
    email: "mecanico@veloservice.cl",
    cargo: "Mecánico",
    taller: "VeloService Providencia",
    password: "mec123",
  },
];

let service: MockAuthService;

beforeEach(() => {
  service = new MockAuthService();
  service.seedUsers(MOCK_USERS);
});

describe("MockAuthService.login", () => {
  it("resolves with User (no password) for valid credentials", async () => {
    const user = await service.login("jefe@veloservice.cl", "jefe123");
    expect(user.email).toBe("jefe@veloservice.cl");
    expect(user.nombre).toBe("Carlos");
    expect("password" in user).toBe(false);
  });

  it("is case-insensitive on email", async () => {
    const user = await service.login("JEFE@VELOSERVICE.CL", "jefe123");
    expect(user.email).toBe("jefe@veloservice.cl");
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
    expect(user.email).toBe("mecanico@veloservice.cl");
  });
});

describe("MockAuthService other methods", () => {
  it("recoverPassword resolves without error", async () => {
    await expect(
      service.recoverPassword("jefe@veloservice.cl")
    ).resolves.toBeUndefined();
  });

  it("verifyCode returns true for '000000'", async () => {
    expect(await service.verifyCode("000000")).toBe(true);
  });

  it("verifyCode returns false for wrong code", async () => {
    expect(await service.verifyCode("123456")).toBe(false);
  });

  it("register resolves without error", async () => {
    await expect(
      service.register({
        nombre: "Ana",
        apellido: "López",
        rut: "12.345.678-9",
        telefono: "+56912345678",
        email: "ana@veloservice.cl",
        cargo: "Mecánico Sr",
        taller: "VeloService Providencia",
        password: "Password123!",
      })
    ).resolves.toBeUndefined();
  });
});

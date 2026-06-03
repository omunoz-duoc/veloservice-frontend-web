import type { IAdminAuthService, AdminUser } from "./admin-auth.service"
import { ApiError } from "@/lib/api/api-error"

const MOCK_ADMIN_EMAIL = "sysadmin@veloservice.cl"
const MOCK_ADMIN: AdminUser = {
  nombre: "System",
  apellido: "Admin",
  token: "mock-token-sysadmin",
  rol: "sysadmin",
  ambito: "platform",
  tallerId: "sysadmin-taller",
  sucursalId: null,
}

async function mockFetch<T>(data: T, delayMs = 250): Promise<T> {
  await new Promise((r) => setTimeout(r, delayMs))
  return data
}

export const adminAuthMock: IAdminAuthService = {
  async login(email, _password) {
    const normalizedEmail = email.toLowerCase().trim()
    if (normalizedEmail !== MOCK_ADMIN_EMAIL.toLowerCase()) {
      throw new ApiError("USER_NOT_FOUND", 404, { message: "USER_NOT_FOUND" })
    }
    return mockFetch(MOCK_ADMIN)
  },
  async logout() {
    return mockFetch(undefined as void)
  },
}

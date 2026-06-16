import type { IAuthService, RegisterPayload, User } from "./auth.service"
import usersData from "./auth.mock.data.json"
import { ApiError } from "@/lib/api/api-error"

type MockUserEntry = User & { email: string }
const MOCK_USERS: MockUserEntry[] = usersData as unknown as MockUserEntry[]

async function mockFetch<T>(data: T, delayMs = 250): Promise<T> {
  await new Promise(r => setTimeout(r, delayMs))
  return data
}

export const authMock: IAuthService = {
  async login(email, _password) {
    const normalizedEmail = email.toLowerCase().trim()
    const user = MOCK_USERS.find((u) => u.email.toLowerCase() === normalizedEmail)
    if (!user) {
      throw new ApiError("USER_NOT_FOUND", 404, { message: "USER_NOT_FOUND" })
    }
    return mockFetch(user)
  },
  async logout() {
    return mockFetch(undefined as void)
  },
  async recoverPassword(_email) {
    return mockFetch(undefined as void)
  },
  async verifyCode(_code) {
    return mockFetch(true)
  },
  async resetPassword(_newPassword) {
    return mockFetch(undefined as void)
  },
  async register(_payload: RegisterPayload) {
    return mockFetch(undefined as void)
  },
  async checkRutExists(_rut) {
    return mockFetch(false)
  },
}

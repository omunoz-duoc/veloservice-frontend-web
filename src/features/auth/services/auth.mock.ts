import type { IAuthService, RegisterPayload, User } from "./auth.service"
import usersData from "./auth.mock.data.json"

const MOCK_USERS: User[] = usersData as unknown as User[]

async function mockFetch<T>(data: T, delayMs = 250): Promise<T> {
  await new Promise(r => setTimeout(r, delayMs))
  return data
}

export const authMock: IAuthService = {
  async login(email, _password) {
    const normalizedEmail = email.toLowerCase().trim()
    const user = MOCK_USERS.find((u) => u.email.toLowerCase() === normalizedEmail)
    if (!user) {
      const error = new Error("USER_NOT_FOUND")
      ;(error as any).body = { message: "USER_NOT_FOUND" }
      throw error
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
}

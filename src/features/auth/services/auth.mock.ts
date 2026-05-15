import type { IAuthService, RegisterPayload, User } from "./auth.service"
import userData from "./auth.mock.data.json"

async function mockFetch<T>(data: T, delayMs = 250): Promise<T> {
  await new Promise(r => setTimeout(r, delayMs))
  return data
}

export const authMock: IAuthService = {
  async login(_email, _password) {
    return mockFetch(userData as User)
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

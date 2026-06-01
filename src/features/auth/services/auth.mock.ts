import type { IAuthService, LoginResponse, RegisterPayload, User } from "./auth.service";

const MOCK_DELAY = 800;
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export interface MockUser extends User {
  email: string;
  password: string;
}

export class MockAuthService implements IAuthService {
  private users = new Map<string, MockUser>();

  seedUsers(users: MockUser[]): void {
    this.users.clear();
    for (const u of users) {
      this.users.set(u.email.toLowerCase(), u);
    }
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    await delay(MOCK_DELAY);
    const record = this.users.get(email.toLowerCase());
    if (!record) throw new Error("USER_NOT_FOUND");
    if (record.password !== password) throw new Error("INVALID_CREDENTIALS");
    const { password: _, ...user } = record;
    return { ...user, token: `mock-token-${record.email}` };
  }

  async logout(): Promise<void> {
    await delay(300);
  }

  async recoverPassword(_email: string): Promise<void> {
    await delay(MOCK_DELAY);
  }

  async verifyCode(code: string): Promise<boolean> {
    await delay(MOCK_DELAY);
    return code === "000000";
  }

  async resetPassword(_newPassword: string): Promise<void> {
    await delay(MOCK_DELAY);
  }

  async register(_payload: RegisterPayload): Promise<void> {
    await delay(MOCK_DELAY);
  }
}

import { httpClient } from "@/lib/api/http-client";
import type { AdminUser } from "@/features/auth/types/auth.types";

export type { AdminUser };

export const adminAuthService: IAdminAuthService = {
  async login(email, password) {
    return httpClient.post<AdminUser>("auth/login-admin", { email, password });
  },

  async logout() {
    return httpClient.post("auth/logout-admin", {});
  },
};

export interface IAdminAuthService {
  login(email: string, password: string): Promise<AdminUser>;
  logout(): Promise<void>;
}

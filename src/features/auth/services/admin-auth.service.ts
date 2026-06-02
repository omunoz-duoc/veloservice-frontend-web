import { httpClient } from "@/lib/api/http-client";

export interface AdminUser {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  taller: string;
  token?: string;
}

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

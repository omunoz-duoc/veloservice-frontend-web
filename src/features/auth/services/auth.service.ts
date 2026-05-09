import { httpClient } from "@/lib/api/http-client";

export interface User {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  taller: string;
}

export interface RegisterPayload {
  nombre: string;
  apellido: string;
  rut: string;
  telefono: string;
  email: string;
  rol: string;
  sucursalId: string;
  password: string;
}

export const authService: IAuthService = {
  async login(email, password) {
    console.log("AuthService.login called with", { email, password });
    return httpClient.post<User>("auth/login", { email, password });
  },

  async logout() {
    return httpClient.post("auth/logout", {});
  },

  async recoverPassword(email) {
    return httpClient.post("auth/reset-password", { email });
  },

  async verifyCode(code) {
    return httpClient.post<boolean>("auth/verify-code", { code });
  },

  async resetPassword(newPassword) {
    return httpClient.post("auth/reset-password", { password: newPassword });
  },

  async register(payload) {
    return httpClient.post("auth/register", payload);
  },
};

export interface IAuthService {
  login(email: string, password: string): Promise<User>;
  logout(): Promise<void>;
  recoverPassword(email: string): Promise<void>;
  verifyCode(code: string): Promise<boolean>;
  resetPassword(newPassword: string): Promise<void>;
  register(payload: RegisterPayload): Promise<void>;
}

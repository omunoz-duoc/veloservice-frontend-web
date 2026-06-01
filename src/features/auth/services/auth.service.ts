import { httpClient } from "@/lib/api/http-client";

export interface User {
  nombre: string;
  apellido: string;
  rol: string;
}

export interface LoginResponse extends User {
  token: string;
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
    return httpClient.post<LoginResponse>("auth/login", { email, password });
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
  login(email: string, password: string): Promise<LoginResponse>;
  logout(): Promise<void>;
  recoverPassword(email: string): Promise<void>;
  verifyCode(code: string): Promise<boolean>;
  resetPassword(newPassword: string): Promise<void>;
  register(payload: RegisterPayload): Promise<void>;
}

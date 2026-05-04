export interface User {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  cargo: string;
  taller: string;
}

export interface RegisterPayload {
  nombre: string;
  apellido: string;
  rut: string;
  telefono: string;
  email: string;
  cargo: string;
  taller: string;
  password: string;
}

export interface IAuthService {
  login(email: string, password: string): Promise<User>;
  logout(): Promise<void>;
  recoverPassword(email: string): Promise<void>;
  verifyCode(code: string): Promise<boolean>;
  resetPassword(newPassword: string): Promise<void>;
  register(payload: RegisterPayload): Promise<void>;
}

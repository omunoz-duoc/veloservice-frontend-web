export interface User {
  nombre: string;
  apellido: string;
  token: string;
  rol: string;
  ambito: string;
  tallerId: string;
  sucursalId: string | null;
}

export type AdminUser = User;

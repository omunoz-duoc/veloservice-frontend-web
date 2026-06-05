export interface User {
  id?: string;
  nombre: string;
  apellido: string;
  token: string;
  rol: string;
  ambito: string;
  tallerId: string;
  sucursalId: string | null;
}

export type AdminUser = User;

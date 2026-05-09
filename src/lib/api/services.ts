import { MockAuthService } from "@/features/auth/services/auth.mock";
import { authService as AuthService } from "@/features/auth/services/auth.service";
import type { MockUser } from "@/features/auth/services/auth.mock";

export const authService = AuthService

const SEED_USERS: MockUser[] = [
  {
    id: "u-admin",
    nombre: "Pedro",
    apellido: "Soto",
    email: "admin@veloservice.cl",
    rol: "Administrador",
    taller: "VeloService Central",
    password: "admin123",
  },
  {
    id: "u-jefe",
    nombre: "Carlos",
    apellido: "Rodríguez",
    email: "jefe@veloservice.cl",
    rol: "Jefe de taller",
    taller: "VeloService Providencia",
    password: "jefe123",
  },
  {
    id: "u-mec",
    nombre: "Ana",
    apellido: "López",
    email: "mecanico@veloservice.cl",
    rol: "Mecánico",
    taller: "VeloService Providencia",
    password: "mec123",
  },
  {
    id: "u-rec",
    nombre: "Sofía",
    apellido: "Muñoz",
    email: "recepcion@veloservice.cl",
    rol: "Recepcionista",
    taller: "VeloService Las Condes",
    password: "rec123",
  },
];

// authService.seedUsers(SEED_USERS);

import { MockAuthService } from "@/features/auth/services/auth.mock";
import type { MockUser } from "@/features/auth/services/auth.mock";

export const authService = new MockAuthService();

const SEED_USERS: MockUser[] = [
  {
    id: "u-admin",
    nombre: "Pedro",
    apellido: "Soto",
    email: "admin@veloservice.cl",
    cargo: "Administrador",
    taller: "VeloService Central",
    password: "admin123",
  },
  {
    id: "u-jefe",
    nombre: "Carlos",
    apellido: "Rodríguez",
    email: "jefe@veloservice.cl",
    cargo: "Jefe de taller",
    taller: "VeloService Providencia",
    password: "jefe123",
  },
  {
    id: "u-mec",
    nombre: "Ana",
    apellido: "López",
    email: "mecanico@veloservice.cl",
    cargo: "Mecánico",
    taller: "VeloService Providencia",
    password: "mec123",
  },
  {
    id: "u-rec",
    nombre: "Sofía",
    apellido: "Muñoz",
    email: "recepcion@veloservice.cl",
    cargo: "Recepcionista",
    taller: "VeloService Las Condes",
    password: "rec123",
  },
];

authService.seedUsers(SEED_USERS);

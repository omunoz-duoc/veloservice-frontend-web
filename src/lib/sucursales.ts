export interface Sucursal {
  id: string;
  nombre: string;
}

const STORAGE_KEY = "vs-sucursales";

export interface SucursalesStorage {
  sucursales: Sucursal[];
  activa: string;
}

export function getSucursalesStorage(): SucursalesStorage | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SucursalesStorage;
  } catch {
    return null;
  }
}

export function setSucursalesStorage(
  sucursales: Sucursal[],
  activa: string
): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ sucursales, activa }));
}

export function clearSucursalesStorage(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function getActiveSucursalId(): string | null {
  return getSucursalesStorage()?.activa ?? null;
}

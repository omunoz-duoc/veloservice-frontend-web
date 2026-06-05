export type CatKey = "rapidos" | "mantencion" | "ruedas" | "ebike" | "kids" | "logistica"

export interface IServiciosService {
  getServicios(): Promise<ServiciosListResponse>
  createServicio(payload: CreateServicioPayload): Promise<void>
}

export type Servicio = {
  id: string;
  nombre: string;
  descripcion: string;
  precioBase: number;
  activo: true;
}

export type ServiciosListResponse = { total: number; servicios: Servicio[] }

export type CreateServicioPayload = {
  cat: CatKey
  nombre: string
  precio: number
  precio2?: number
  dur: number
  desc: string
  incluye: string[]
  skills: string[]
  activo: boolean
  popular?: boolean
}

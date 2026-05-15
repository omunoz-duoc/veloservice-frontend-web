export interface IServiciosService {
  getServicios(): Promise<ServiciosListResponse>
  createServicio(payload: CreateServicioPayload): Promise<void>
}

export type Servicio = {
  id: string
  nombre: string
  descripcion: string
  precioBase: number
  tiempoEstimado: string
}

export type ServiciosListResponse = { total: number; servicios: Servicio[] }

export type CreateServicioPayload = {
  nombre: string
  descripcion: string
  precioBase: number
  tiempoEstimado: string
}

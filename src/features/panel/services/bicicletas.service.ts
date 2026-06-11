import { httpClient } from "@/lib/api/http-client"
import type { Bicicleta } from "../components/clientes/clientes.mock"

type ApiBicicleta = {
  id: string
  clienteId?: string
  marca?: string
  modelo?: string
  tipo?: string
  aro?: string
  color?: string
  numeroSerie?: string
  anio?: number
  notas?: string
}

type BicicletaPayload = {
  marca: string
  modelo: string
  tipo: string
  aro: string
  color: string
  numeroSerie: string
  anio: number | null
  notas: string
}

function parseMarcaModelo(marcaFull: string): { marca: string; modelo: string } {
  const parts = marcaFull.trim().split(/\s+/).filter(Boolean)
  if (parts.length <= 1) return { marca: marcaFull.trim(), modelo: "" }
  return { marca: parts[0], modelo: parts.slice(1).join(" ") }
}

function toBicicleta(api: ApiBicicleta): Bicicleta {
  const marca = [api.marca, api.modelo].filter(Boolean).join(" ").trim()

  return {
    id: api.id,
    marca: marca || "Sin marca",
    tipo: api.tipo ?? "",
    talla: api.aro ?? "",
    color: api.color ?? "",
    serial: api.numeroSerie ?? "",
    añoCompra: api.anio ?? 0,
    notas: api.notas ?? "",
  }
}

function toPayload(bici: Bicicleta): BicicletaPayload {
  const { marca, modelo } = parseMarcaModelo(bici.marca)

  return {
    marca,
    modelo,
    tipo: bici.tipo,
    aro: bici.talla,
    color: bici.color,
    numeroSerie: bici.serial,
    anio: bici.añoCompra || null,
    notas: bici.notas,
  }
}

export const bicicletasClienteQueryKey = (clienteId: string) => ["bicicletas", "cliente", clienteId] as const

export const bicicletasService = {
  async listarPorCliente(clienteId: string): Promise<Bicicleta[]> {
    const bicicletas = await httpClient.get<ApiBicicleta[]>(`bicicletas/cliente/${encodeURIComponent(clienteId)}`)
    return bicicletas.map(toBicicleta)
  },

  async crear(clienteId: string, bici: Bicicleta): Promise<Bicicleta> {
    const created = await httpClient.post<ApiBicicleta>(
      `bicicletas/cliente/${encodeURIComponent(clienteId)}`,
      toPayload(bici)
    )
    return toBicicleta(created)
  },

  async actualizar(id: string, bici: Bicicleta): Promise<Bicicleta> {
    const updated = await httpClient.patch<ApiBicicleta>(`bicicletas/${encodeURIComponent(id)}`, toPayload(bici))
    return toBicicleta(updated)
  },

  async eliminar(id: string): Promise<void> {
    await httpClient.delete(`bicicletas/${encodeURIComponent(id)}`)
  },
}

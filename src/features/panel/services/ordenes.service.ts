import { httpClient } from "@/lib/api/http-client";
import { CreateOrdenPayload, IOrdenesService, Orden, OrdenesListResponse, OrdenesMetricas, UpdateOrdenPayload, BulkUpdateOrdenPayload } from "../types/ordenes.types";
import { type OrdenTrabajo, type EstadoOT as FrontendEstadoOT, type TipoOT } from "../components/ordenes/ordenes.mock";

const ESTADO_MAP: Record<string, FrontendEstadoOT> = {
    pendiente:           "recibido",
    recibido:            "recibido",
    en_diagnostico:      "proceso",
    en_reparacion:       "proceso",
    en_proceso:          "proceso",
    esperando_repuesto:  "espera",
    espera_repuesto:     "espera",
    listo:               "listo",
    entregado:           "entregado",
}

export const ESTADO_TO_API_MAP: Record<FrontendEstadoOT, string> = {
    recibido:  "Recibido",
    proceso:   "En Proceso",
    espera:    "espera_repuesto",
    listo:     "Listo",
    entregado: "Entregado",
}

const MONTHS = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"]

export function mapApiOrden(orden: Orden, idx: number): OrdenTrabajo {
    const fecha = new Date(orden.fechaIngreso)
    const day   = fecha.getUTCDate().toString().padStart(2, "0")
    const month = MONTHS[fecha.getUTCMonth()]
    const hh    = fecha.getUTCHours().toString().padStart(2, "0")
    const mm    = fecha.getUTCMinutes().toString().padStart(2, "0")

    return {
        id:           orden.externalId ?? `OT-${String(idx + 1).padStart(4, "0")}`,
        tipo:         orden.tipo as TipoOT,
        estado:       ESTADO_MAP[orden.estado] ?? "recibido",
        prioridad:    "media",
        fechaIngreso: `${day} ${month} · ${hh}:${mm}`,
        fechaEstimada: "",
        mecanicoId:   orden.nombreMecanico,
        clienteNombre: orden.nombreCliente,
        biciMarca:    orden.bicicleta.marca,
        biciTipo:     orden.bicicleta.tipo,
        biciTalla:    orden.bicicleta.talla,
        biciColor:    orden.bicicleta.color,
        descripcion:  orden.descripcion,
        notasInternas: orden.observacionesCliente,
    }
}

export const ordenesService: IOrdenesService = {
    async getOrdenes() {
        return httpClient.get<OrdenesListResponse>("ordenes");
    },

    async getOrdenesUrgentes() {
        return httpClient.get<OrdenesListResponse>("ordenes/urgentes");
    },

    async getOrdenesMetricas() {
        return httpClient.get<OrdenesMetricas>("ordenes/metricas");
    },

    async getOrdenById(id: string) {
        return httpClient.get<Orden>(`ordenes/${id}`);
    },

    async createOrden(payload: CreateOrdenPayload) {
        return httpClient.post("ordenes", payload);
    },

    async updateOrden(id: string, payload: UpdateOrdenPayload) {
        return httpClient.put<Orden>(`ordenes/${id}`, payload);
    },

    async bulkUpdateOrdenes(payload: BulkUpdateOrdenPayload) {
        return httpClient.patch<void>("ordenes/bulk", payload);
    },

    async deleteOrden(id: string) {
        return httpClient.delete(`ordenes/${id}`);
    }
}

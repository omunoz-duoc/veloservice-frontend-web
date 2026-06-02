import { httpClient } from "@/lib/api/http-client";
import { CreateOrdenPayload, IOrdenesService, OrdenTrabajo as ApiOrdenTrabajo, OrdenTrabajoDetalle, OrdenesListResponse, OrdenesMetricas, UpdateOrdenPayload, BulkUpdateOrdenPayload } from "../types/ordenes.types";
import { type OrdenTrabajo, type EstadoOT as FrontendEstadoOT, type Prioridad as FrontendPrioridad, type TipoOT } from "../components/ordenes/ordenes.types";

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

export function mapApiOrden(orden: ApiOrdenTrabajo, idx: number): OrdenTrabajo {
    const fecha = new Date(orden.fechaIngreso)
    const day   = fecha.getUTCDate().toString().padStart(2, "0")
    const month = MONTHS[fecha.getUTCMonth()]
    const hh    = fecha.getUTCHours().toString().padStart(2, "0")
    const mm    = fecha.getUTCMinutes().toString().padStart(2, "0")

    return {
        id:           orden.numeroOrden ?? `OT-${String(idx + 1).padStart(4, "0")}`,
        tipo:         {
            id: "",
            codigo: orden.tipo.toLowerCase(),
            nombre: orden.tipo,
        },
        estado:       ESTADO_MAP[orden.estado] ?? "recibido",
        prioridad:    (orden.prioridad?.toLowerCase() as FrontendPrioridad) ?? "media",
        fechaIngreso: `${day} ${month} · ${hh}:${mm}`,
        fechaEstimada: "",
        mecanicoId:   orden.mecanico,
        clienteNombre: orden.cliente,
        biciMarca:    `${orden.bicicleta.marca} ${orden.bicicleta.modelo}`.trim(),
        biciTipo:     orden.bicicleta.tipo,
        biciColor:    orden.bicicleta.color,
        descripcion:  orden.diagnosticoInicial,
    }
}

export const ordenesService: IOrdenesService = {
    async getOrdenes() {
        return httpClient.get<OrdenesListResponse>("ordenes/resumen");
    },

    async getOrdenesUrgentes() {
        return httpClient.get<OrdenesListResponse>("ordenes/urgentes");
    },

    async getOrdenesMetricas() {
        return httpClient.get<OrdenesMetricas>("ordenes/metricas");
    },

    async getOrdenById(id: string) {
        return httpClient.get<OrdenTrabajoDetalle>(`ordenes/${id}`);
    },

    async createOrden(payload: CreateOrdenPayload) {
        return httpClient.post("ordenes", payload);
    },

    async updateOrden(id: string, payload: UpdateOrdenPayload) {
        return httpClient.put<ApiOrdenTrabajo>(`ordenes/${id}`, payload);
    },

    async bulkUpdateOrdenes(payload: BulkUpdateOrdenPayload) {
        return httpClient.patch<void>("ordenes/bulk", payload);
    },

    async deleteOrden(id: string) {
        return httpClient.delete(`ordenes/${id}`);
    }
}

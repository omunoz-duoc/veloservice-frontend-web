import { httpClient } from "@/lib/api/http-client";
import {
    BulkUpdateOrdenPayload,
    CreateOrdenPayload,
    IOrdenesService,
    OrdenTrabajo as ApiOrdenTrabajo,
    OrdenTrabajoDetalle,
    OrdenesListResponse,
    OrdenesMetricas,
    OrdenEstadoChangePayload,
    UpdateOrdenPayload,
} from "../types/ordenes.types";
import {
    type EstadoOT as FrontendEstadoOT,
    type OrdenTrabajo,
    type Prioridad as FrontendPrioridad,
    type TipoOT,
} from "../components/ordenes/ordenes.types";

type BackendCatalogValue = {
    id?: string;
    codigo?: string;
    nombre?: string;
}

type BackendOrdenTrabajo = Partial<Omit<ApiOrdenTrabajo, "tipo" | "estado" | "bicicleta" | "cliente" | "mecanico">> & {
    id?: string;
    numeroOrden?: string;
    tipo?: string | BackendCatalogValue;
    estado?: string | BackendCatalogValue;
    fechaPrometida?: string | null;
    observacionesCliente?: string | null;
    bicicleta?: {
        id?: string;
        marca?: string;
        modelo?: string;
        tipo?: string | null;
        aro?: string | null;
        color?: string | null;
        numeroSerie?: string | null;
    };
    cliente?: string | {
        id?: string;
        nombre?: string;
        apellido?: string;
        telefono?: string | null;
        email?: string | null;
        rut?: string | null;
    };
    mecanico?: string | {
        id?: string;
        nombre?: string;
        apellido?: string;
    } | null;
}

type BackendOrdenesListResponse = {
    total: number;
    ordenes: BackendOrdenTrabajo[];
}

const ESTADO_MAP: Record<string, FrontendEstadoOT> = {
    pendiente:           "recibido",
    recibido:            "recibido",
    en_diagnostico:      "diagnostico",
    diagnostico:         "diagnostico",
    en_reparacion:       "proceso",
    en_proceso:          "proceso",
    esperando_repuesto:  "espera",
    esperando_repuestos: "espera",
    espera_repuesto:     "espera",
    control_calidad:     "calidad",
    lista_para_entrega:  "listo",
    listo:               "listo",
    entregado:           "entregado",
    entregada:           "entregado",
    cancelada:           "cancelado",
    cancelado:           "cancelado",
}

export const ESTADO_TO_API_MAP: Record<FrontendEstadoOT, string> = {
    recibido:    "recibida",
    diagnostico: "en_diagnostico",
    espera:      "esperando_repuestos",
    proceso:     "en_reparacion",
    calidad:     "control_calidad",
    listo:       "lista_para_entrega",
    entregado:   "entregada",
    cancelado:   "cancelada",
}

const TIPO_MAP: Record<string, TipoOT> = {
    personalizacion: "personalizacion",
    mantencion: "mantencion",
    mantencion_general: "mantencion",
    mantenimiento: "mantencion",
    reparacion: "reparacion",
    revision: "revision",
    diagnostico: "revision",
    garantia: "garantia",
    armado: "armado",
    overhaul: "mantencion",
}

const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

function normalizeCode(value: string) {
    return value
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "_")
}

function catalogValue(value: string | BackendCatalogValue | undefined, fallback = "") {
    if (!value) return { id: "", codigo: fallback, nombre: fallback }
    if (typeof value === "string") return { id: "", codigo: normalizeCode(value), nombre: value }
    const nombre = value.nombre ?? value.codigo ?? fallback
    return {
        id: value.id ?? "",
        codigo: normalizeCode(value.codigo ?? nombre),
        nombre,
    }
}

function formatFechaIngreso(value: string | undefined) {
    const fecha = new Date(value ?? "")
    if (Number.isNaN(fecha.getTime())) return "Sin fecha"

    const day = fecha.getUTCDate().toString().padStart(2, "0")
    const month = MONTHS[fecha.getUTCMonth()]
    const hh = fecha.getUTCHours().toString().padStart(2, "0")
    const mm = fecha.getUTCMinutes().toString().padStart(2, "0")

    return `${day} ${month} · ${hh}:${mm}`
}

function normalizePrioridad(value: string | undefined): FrontendPrioridad {
    const prioridad = normalizeCode(value ?? "media")
    return prioridad === "baja" || prioridad === "alta" ? prioridad : "media"
}

function fullName(person: { nombre?: string; apellido?: string } | undefined | null) {
    return [person?.nombre, person?.apellido].filter(Boolean).join(" ")
}

export function mapApiOrden(apiOrden: ApiOrdenTrabajo | BackendOrdenTrabajo, idx: number): OrdenTrabajo {
    const orden = apiOrden as BackendOrdenTrabajo
    const tipo = catalogValue(orden.tipo, "mantencion")
    const estado = catalogValue(orden.estado, "recibido")
    const cliente = typeof orden.cliente === "string" ? orden.cliente : fullName(orden.cliente)
    const mecanico = typeof orden.mecanico === "string" ? orden.mecanico : fullName(orden.mecanico)
    const biciMarca = `${orden.bicicleta?.marca ?? ""} ${orden.bicicleta?.modelo ?? ""}`.trim()

    return {
        id: orden.numeroOrden ?? `OT-${String(idx + 1).padStart(4, "0")}`,
        backendId: orden.id,
        tipo: {
            id: tipo.id,
            codigo: TIPO_MAP[tipo.codigo] ?? "mantencion",
            nombre: tipo.nombre,
        },
        estado: ESTADO_MAP[estado.codigo] ?? "recibido",
        prioridad: normalizePrioridad(orden.prioridad),
        fechaIngreso: formatFechaIngreso(orden.fechaIngreso),
        fechaEstimada: orden.fechaPrometida ?? "",
        mecanicoId: typeof orden.mecanico === "object" ? orden.mecanico?.id ?? mecanico : mecanico,
        clienteNombre: cliente || "Sin cliente",
        clienteTelefono: typeof orden.cliente === "object" ? orden.cliente?.telefono ?? undefined : undefined,
        clienteEmail: typeof orden.cliente === "object" ? orden.cliente?.email ?? undefined : undefined,
        biciMarca: biciMarca || "Sin bicicleta",
        biciTipo: orden.bicicleta?.tipo ?? "Otro",
        biciTalla: orden.bicicleta?.aro ?? undefined,
        biciColor: orden.bicicleta?.color ?? "",
        biciNumSerie: orden.bicicleta?.numeroSerie ?? undefined,
        descripcion: orden.diagnosticoInicial ?? orden.observacionesCliente ?? "Sin descripcion",
    }
}

export const ordenesService: IOrdenesService = {
    async getOrdenes() {
        return httpClient.get<BackendOrdenesListResponse>("ordenes") as unknown as Promise<OrdenesListResponse>;
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

    async cambiarEstado(id: string, payload: OrdenEstadoChangePayload) {
        return httpClient.patch<OrdenTrabajoDetalle>(`ordenes/${id}/estado`, payload);
    },

    async bulkUpdateOrdenes(payload: BulkUpdateOrdenPayload) {
        return httpClient.patch<void>("ordenes/bulk", payload);
    },

    async deleteOrden(id: string) {
        return httpClient.delete(`ordenes/${id}`);
    }
}

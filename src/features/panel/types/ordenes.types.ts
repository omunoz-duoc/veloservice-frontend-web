export interface IOrdenesService {
    getOrdenes(): Promise<OrdenesListResponse>;
    getOrdenesMetricas(): Promise<OrdenesMetricas>;
    getEstadosOrden(): Promise<OrdenCatalogoItem[]>;
    getTiposOrden(): Promise<OrdenCatalogoItem[]>;
    getPrioridadesOrden(): Promise<OrdenCatalogoItem[]>;
    createOrden(payload: CreateOrdenPayload): Promise<void>;
    getOrdenById(id: string): Promise<OrdenTrabajoDetalle>;
    updateOrden(id: string, payload: UpdateOrdenPayload): Promise<OrdenTrabajo>;
    addProductos(id: string, payload: OrdenProductoAddPayload[]): Promise<OrdenTrabajoDetalle["productos"]>;
    bulkUpdateOrdenes(payload: BulkUpdateOrdenPayload): Promise<void>;
    deleteOrden(id: string): Promise<void>;
}

export type OrdenTrabajo = {
    numeroOrden: string;
    tipo: string;
    fechaIngreso: string;
    mecanico: string;
    cliente: string;
    bicicleta: {
        marca: string;
        modelo: string;
        tipo: string;
        color: string;
    };
    diagnosticoInicial: string;
    estado: string;
    prioridad: string;
}

export type OrdenTrabajoDetalle = {
    id: string;
    numeroOrden: string;
    tallerId: string;
    sucursalId: string;
    estado: { id: string; codigo: string; nombre: string };
    tipo: { id: string; codigo: string; nombre: string };
    fechaIngreso: string;
    fechaPrometida: string;
    fechaEntrega: string | null;
    diagnosticoInicial: string;
    diagnosticoFinal: string | null;
    observacionesCliente: string;
    bicicleta: {
        id: string;
        marca: string;
        modelo: string;
        tipo: string;
        color: string;
        numeroSerie: string;
    };
    cliente: {
        id: string;
        nombre: string;
        apellido: string;
        telefono: string;
        email: string;
        rut: string;
    };
    mecanico: {
        id: string;
        nombre: string;
        apellido: string;
    };
    prioridad: string;
    comentarios: Array<{
        usuario: string;
        texto: string;
        createdAt: string;
    }>;
    multimedia: Array<{
        usuario: string;
        tipoArchivo: string;
        url: string;
        etapa: string;
        descripcion: string;
    }>;
    productos: Array<{
        id: string;
        productoId: string;
        nombre: string;
        sku: string;
        cantidad: number;
        precioVenta: number;
        notas?: string;
    }>;
    servicios: Array<{
        id: string;
        servicioId: string;
        nombre: string;
        precioBase: number;
    }>;
}


export type CreateOrdenPayload = {
    servicioIds: string[];
    prioridad: Prioridad;
    fechaEstimada: string;
    mecanicoId: string;
    bicicletaId: string;
    descripcion: string;
    estado: string;
    notasInternas?: string;
}

export type UpdateOrdenPayload = {
    estadoCodigo?: string;
    estadoObservacion?: string;
    tipoCodigo?: string;
    prioridad?: string;
    mecanicoId?: string;
    productosCambios?: OrdenProductoCambioPayload[];
    productosAgregar?: OrdenProductoAddPayload[];
    fechaEstimada?: string;
    bicicletaId?: string;
    descripcion?: string;
    estado?: string;
    notasInternas?: string;
}

export type BulkUpdateOrdenPayload = {
    ids: string[];
    estado?: string;
    mecanicoId?: string;
}

export type OrdenProductoAddPayload = {
    productoId: string;
    cantidad: number;
    proporcionadoPorCliente: boolean;
    notas?: string;
}

export type OrdenProductoCambioPayload =
    | {
        accion: "AGREGAR";
        productoId: string;
        cantidad: number;
        notas?: string;
        proporcionadoPorCliente: boolean;
    }
    | {
        accion: "ACTUALIZAR";
        lineaId: string;
        cantidad: number;
        notas?: string;
    }
    | {
        accion: "ELIMINAR";
        lineaId: string;
    }

export type OrdenCatalogoItem = { id?: string; codigo: string; nombre: string };
export type TipoOT = "mantencion" | "reparacion" | "revision" | "armado" | "garantia" | "personalizacion";
export type EstadoOT = "recibida" | "en_diagnostico" | "esperando_repuestos" | "en_reparacion" | "control_calidad" | "lista_para_entrega" | "entregada" | "cancelada";
export type Prioridad = "baja" | "media" | "alta";
export type TipoBici = "Ruta" | "Montaña" | "Híbrida" | "Eléctrica" | "Infantil" | "Otra";

export type OrdenesListResponse = { total: number; ordenes: OrdenTrabajo[] }
export type OrdenesMetricas = { recibidas: number; enProceso: number; listas: number; entregadas: number }
